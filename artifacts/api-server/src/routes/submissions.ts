import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { submissionsTable, assignmentsTable, coursesTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const mapSub = (s: typeof submissionsTable.$inferSelect) => ({
  id: s.id,
  assignmentId: s.assignmentId,
  studentId: s.studentId,
  content: s.content,
  fileUrl: s.fileUrl,
  grade: s.grade,
  feedback: s.feedback,
  status: s.status,
  gradedBy: s.gradedBy,
  gradedAt: s.gradedAt ? s.gradedAt.toISOString() : null,
  submittedAt: s.submittedAt.toISOString(),
});

router.get("/submissions", requireAuth, async (req, res): Promise<void> => {
  const callerId = req.authUserId;
  const assignmentId = typeof req.query.assignmentId === "string" ? req.query.assignmentId : undefined;

  if (assignmentId) {
    // Resolve the assignment's course teacher
    const [assignment] = await db.select().from(assignmentsTable).where(eq(assignmentsTable.id, assignmentId));
    if (!assignment) { res.json([]); return; }
    const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, assignment.courseId));
    const isCourseTeacher = course?.teacherId === callerId;

    if (isCourseTeacher) {
      // Teacher: return all submissions for this assignment
      const subs = await db.select().from(submissionsTable)
        .where(eq(submissionsTable.assignmentId, assignmentId))
        .orderBy(desc(submissionsTable.submittedAt));
      res.json(subs.map(mapSub));
    } else {
      // Student (or anyone else): only return their own submission
      const subs = await db.select().from(submissionsTable)
        .where(and(eq(submissionsTable.assignmentId, assignmentId), eq(submissionsTable.studentId, callerId)));
      res.json(subs.map(mapSub));
    }
    return;
  }

  // No assignmentId: return caller's own submissions
  const subs = await db.select().from(submissionsTable)
    .where(eq(submissionsTable.studentId, callerId))
    .orderBy(desc(submissionsTable.submittedAt));
  res.json(subs.map(mapSub));
});

router.post("/submissions", requireAuth, async (req, res): Promise<void> => {
  const { assignmentId, content, fileUrl } =
    req.body as { assignmentId?: string; content?: string; fileUrl?: string };
  if (!assignmentId) { res.status(400).json({ error: "assignmentId is required" }); return; }
  const [sub] = await db.insert(submissionsTable).values({
    assignmentId,
    studentId: req.authUserId,
    content: content || null,
    fileUrl: fileUrl || null,
    status: "submitted",
  }).returning();
  res.status(201).json(mapSub(sub));
});

router.patch("/submissions/:id", requireAuth, async (req, res): Promise<void> => {
  const [sub] = await db.select().from(submissionsTable).where(eq(submissionsTable.id, req.params.id));
  if (!sub) { res.status(404).json({ error: "Not found" }); return; }

  const { content, fileUrl, grade, feedback, status } =
    req.body as { content?: string; fileUrl?: string; grade?: number; feedback?: string; status?: string };

  const isStudent = sub.studentId === req.authUserId;
  const [assignment] = await db.select().from(assignmentsTable).where(eq(assignmentsTable.id, sub.assignmentId));
  const [course] = assignment
    ? await db.select().from(coursesTable).where(eq(coursesTable.id, assignment.courseId))
    : [];
  const isTeacher = course?.teacherId === req.authUserId;

  if (!isStudent && !isTeacher) { res.status(403).json({ error: "Forbidden" }); return; }

  const updates: Partial<typeof submissionsTable.$inferInsert> = {};
  if (isStudent && (content !== undefined || fileUrl !== undefined)) {
    if (content !== undefined) updates.content = content || null;
    if (fileUrl !== undefined) updates.fileUrl = fileUrl || null;
    updates.status = "submitted";
  }
  if (isTeacher && (grade !== undefined || feedback !== undefined)) {
    if (grade !== undefined) updates.grade = grade;
    if (feedback !== undefined) updates.feedback = feedback || null;
    updates.status = status || "graded";
    updates.gradedBy = req.authUserId;
    updates.gradedAt = new Date();
  }

  const [updated] = await db.update(submissionsTable)
    .set(updates).where(eq(submissionsTable.id, req.params.id)).returning();
  res.json(mapSub(updated));
});

export default router;
