import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  parentStudentLinksTable, profilesTable, userRolesTable,
  submissionsTable, assignmentsTable, courseEnrollmentsTable, coursesTable,
  messagesTable,
} from "@workspace/db";
import { eq, and, desc, inArray } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

// Link parent to student
router.post("/parent/link", requireAuth, async (req, res): Promise<void> => {
  const { studentId } = req.body as { studentId?: string };
  if (!studentId) { res.status(400).json({ error: "studentId required" }); return; }
  const parentId = req.authUserId;
  const existing = await db.select().from(parentStudentLinksTable)
    .where(and(eq(parentStudentLinksTable.parentId, parentId), eq(parentStudentLinksTable.studentId, studentId)));
  if (existing.length > 0) { res.status(409).json({ error: "Already linked" }); return; }
  const [link] = await db.insert(parentStudentLinksTable).values({ parentId, studentId }).returning();
  res.status(201).json({ id: link.id, parentId: link.parentId, studentId: link.studentId });
});

// Get students linked to this parent
router.get("/parent/students", requireAuth, async (req, res): Promise<void> => {
  const links = await db.select().from(parentStudentLinksTable)
    .where(eq(parentStudentLinksTable.parentId, req.authUserId));
  const studentIds = links.map((l) => l.studentId);
  if (studentIds.length === 0) { res.json([]); return; }
  const profiles = await db.select().from(profilesTable).where(inArray(profilesTable.userId, studentIds));
  res.json(profiles.map((p) => ({ userId: p.userId, fullName: p.fullName, avatarUrl: p.avatarUrl })));
});

// Get student grades/submissions (parent view)
router.get("/parent/students/:studentId/grades", requireAuth, async (req, res): Promise<void> => {
  const { studentId } = req.params;
  const links = await db.select().from(parentStudentLinksTable)
    .where(and(eq(parentStudentLinksTable.parentId, req.authUserId), eq(parentStudentLinksTable.studentId, studentId)));
  if (links.length === 0) { res.status(403).json({ error: "Not authorized to view this student" }); return; }
  const subs = await db.select().from(submissionsTable)
    .where(eq(submissionsTable.studentId, studentId)).orderBy(desc(submissionsTable.submittedAt));
  const aIds = [...new Set(subs.map((s) => s.assignmentId))];
  let aMap: Record<string, { title: string; maxGrade: number; courseId: string }> = {};
  if (aIds.length) {
    const assignments = await db.select().from(assignmentsTable).where(inArray(assignmentsTable.id, aIds));
    assignments.forEach((a) => { aMap[a.id] = { title: a.title, maxGrade: a.maxGrade, courseId: a.courseId }; });
    const cIds = [...new Set(assignments.map((a) => a.courseId))];
    const courses = cIds.length ? await db.select().from(coursesTable).where(inArray(coursesTable.id, cIds)) : [];
    let cMap: Record<string, string> = {};
    courses.forEach((c) => { cMap[c.id] = c.title; });
    Object.values(aMap).forEach((a) => { (a as Record<string, unknown>).courseTitle = cMap[a.courseId] ?? ""; });
  }
  res.json(subs.map((s) => ({
    id: s.id,
    assignmentId: s.assignmentId,
    assignmentTitle: aMap[s.assignmentId]?.title ?? "",
    courseTitle: (aMap[s.assignmentId] as Record<string, unknown> | undefined)?.courseTitle ?? "",
    grade: s.grade,
    maxGrade: aMap[s.assignmentId]?.maxGrade ?? 100,
    status: s.status,
    feedback: s.feedback,
    submittedAt: s.submittedAt.toISOString(),
  })));
});

// Get student enrollments (parent view)
router.get("/parent/students/:studentId/courses", requireAuth, async (req, res): Promise<void> => {
  const { studentId } = req.params;
  const links = await db.select().from(parentStudentLinksTable)
    .where(and(eq(parentStudentLinksTable.parentId, req.authUserId), eq(parentStudentLinksTable.studentId, studentId)));
  if (links.length === 0) { res.status(403).json({ error: "Not authorized" }); return; }
  const enrollments = await db.select().from(courseEnrollmentsTable)
    .where(eq(courseEnrollmentsTable.studentId, studentId));
  const courseIds = enrollments.map((e) => e.courseId);
  if (courseIds.length === 0) { res.json([]); return; }
  const courses = await db.select().from(coursesTable).where(inArray(coursesTable.id, courseIds));
  res.json(courses.map((c) => ({ id: c.id, title: c.title, description: c.description, teacherId: c.teacherId })));
});

// Messages: send
router.post("/messages", requireAuth, async (req, res): Promise<void> => {
  const { toUserId, subject, body } = req.body as { toUserId?: string; subject?: string; body?: string };
  if (!toUserId || !subject?.trim() || !body?.trim()) {
    res.status(400).json({ error: "toUserId, subject, body required" }); return;
  }
  const [msg] = await db.insert(messagesTable).values({
    fromUserId: req.authUserId,
    toUserId,
    subject: subject.trim(),
    body: body.trim(),
  }).returning();
  res.status(201).json({ id: msg.id, fromUserId: msg.fromUserId, toUserId: msg.toUserId, subject: msg.subject, body: msg.body, createdAt: msg.createdAt.toISOString() });
});

// Messages: inbox
router.get("/messages/inbox", requireAuth, async (req, res): Promise<void> => {
  const msgs = await db.select().from(messagesTable)
    .where(eq(messagesTable.toUserId, req.authUserId)).orderBy(desc(messagesTable.createdAt));
  res.json(msgs.map((m) => ({ id: m.id, fromUserId: m.fromUserId, toUserId: m.toUserId, subject: m.subject, body: m.body, isRead: m.isRead, createdAt: m.createdAt.toISOString() })));
});

// Messages: mark read
router.patch("/messages/:id/read", requireAuth, async (req, res): Promise<void> => {
  const [msg] = await db.select().from(messagesTable).where(eq(messagesTable.id, req.params.id));
  if (!msg) { res.status(404).json({ error: "Not found" }); return; }
  if (msg.toUserId !== req.authUserId) { res.status(403).json({ error: "Forbidden" }); return; }
  await db.update(messagesTable).set({ isRead: true }).where(eq(messagesTable.id, req.params.id));
  res.json({ success: true });
});

export default router;
