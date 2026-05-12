import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { assignmentsTable, coursesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const mapAssignment = (a: typeof assignmentsTable.$inferSelect) => ({
  id: a.id,
  courseId: a.courseId,
  title: a.title,
  description: a.description,
  dueDate: a.dueDate ? a.dueDate.toISOString() : null,
  maxGrade: a.maxGrade,
  attachmentUrl: a.attachmentUrl,
  createdBy: a.createdBy,
  createdAt: a.createdAt.toISOString(),
});

router.get("/assignments", async (req, res): Promise<void> => {
  const courseId = typeof req.query.courseId === "string" ? req.query.courseId : undefined;
  const assignments = courseId
    ? await db.select().from(assignmentsTable).where(eq(assignmentsTable.courseId, courseId)).orderBy(desc(assignmentsTable.createdAt))
    : await db.select().from(assignmentsTable).orderBy(assignmentsTable.dueDate);
  res.json(assignments.map(mapAssignment));
});

router.post("/assignments", requireAuth, async (req, res): Promise<void> => {
  const { courseId, title, description, dueDate, maxGrade, attachmentUrl } =
    req.body as { courseId?: string; title?: string; description?: string; dueDate?: string; maxGrade?: number; attachmentUrl?: string };
  if (!courseId || !title?.trim()) {
    res.status(400).json({ error: "courseId and title are required" });
    return;
  }
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId));
  if (!course) { res.status(404).json({ error: "Course not found" }); return; }
  if (course.teacherId !== req.authUserId) { res.status(403).json({ error: "Forbidden" }); return; }
  const [assignment] = await db.insert(assignmentsTable).values({
    courseId,
    title: title.trim(),
    description: description?.trim() || null,
    dueDate: dueDate ? new Date(dueDate) : null,
    maxGrade: Number(maxGrade) || 100,
    attachmentUrl: attachmentUrl || null,
    createdBy: req.authUserId,
  }).returning();
  res.status(201).json(mapAssignment(assignment));
});

router.get("/assignments/:id", async (req, res): Promise<void> => {
  const [assignment] = await db.select().from(assignmentsTable).where(eq(assignmentsTable.id, req.params.id));
  if (!assignment) { res.status(404).json({ error: "Assignment not found" }); return; }
  res.json(mapAssignment(assignment));
});

router.delete("/assignments/:id", requireAuth, async (req, res): Promise<void> => {
  const [assignment] = await db.select().from(assignmentsTable).where(eq(assignmentsTable.id, req.params.id));
  if (!assignment) { res.status(404).json({ error: "Not found" }); return; }
  if (assignment.createdBy !== req.authUserId) { res.status(403).json({ error: "Forbidden" }); return; }
  await db.delete(assignmentsTable).where(eq(assignmentsTable.id, req.params.id));
  res.json({ success: true });
});

export default router;
