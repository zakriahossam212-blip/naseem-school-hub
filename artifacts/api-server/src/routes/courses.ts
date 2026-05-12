import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { coursesTable, courseEnrollmentsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const mapCourse = (c: typeof coursesTable.$inferSelect) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  teacherId: c.teacherId,
  createdAt: c.createdAt.toISOString(),
});

router.get("/courses", async (req, res): Promise<void> => {
  const teacherId = typeof req.query.teacherId === "string" ? req.query.teacherId : undefined;
  const courses = teacherId
    ? await db.select().from(coursesTable).where(eq(coursesTable.teacherId, teacherId)).orderBy(desc(coursesTable.createdAt))
    : await db.select().from(coursesTable).orderBy(desc(coursesTable.createdAt));
  res.json(courses.map(mapCourse));
});

router.post("/courses", requireAuth, async (req, res): Promise<void> => {
  const { title, description } = req.body as { title?: string; description?: string };
  if (!title?.trim()) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  const [course] = await db.insert(coursesTable).values({
    title: title.trim(),
    description: description?.trim() || null,
    teacherId: req.authUserId,
  }).returning();
  res.status(201).json(mapCourse(course));
});

router.get("/courses/:id", async (req, res): Promise<void> => {
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, req.params.id));
  if (!course) { res.status(404).json({ error: "Course not found" }); return; }
  res.json(mapCourse(course));
});

router.put("/courses/:id", requireAuth, async (req, res): Promise<void> => {
  const { title, description } = req.body as { title?: string; description?: string };
  const [existing] = await db.select().from(coursesTable).where(eq(coursesTable.id, req.params.id));
  if (!existing) { res.status(404).json({ error: "Course not found" }); return; }
  if (existing.teacherId !== req.authUserId) { res.status(403).json({ error: "Forbidden" }); return; }
  const [updated] = await db.update(coursesTable)
    .set({ title: title?.trim() ?? existing.title, description: description?.trim() ?? existing.description })
    .where(eq(coursesTable.id, req.params.id))
    .returning();
  res.json(mapCourse(updated));
});

router.post("/courses/:id/enroll", requireAuth, async (req, res): Promise<void> => {
  const courseId = req.params.id;
  const studentId = req.authUserId;
  const existing = await db.select().from(courseEnrollmentsTable)
    .where(and(eq(courseEnrollmentsTable.courseId, courseId), eq(courseEnrollmentsTable.studentId, studentId)));
  if (existing.length > 0) { res.status(409).json({ error: "Already enrolled" }); return; }
  await db.insert(courseEnrollmentsTable).values({ courseId, studentId });
  res.status(201).json({ success: true });
});

router.get("/enrollments", requireAuth, async (req, res): Promise<void> => {
  // Always scope to the authenticated caller — no cross-user enrollment reads
  const enrollments = await db.select().from(courseEnrollmentsTable)
    .where(eq(courseEnrollmentsTable.studentId, req.authUserId));
  res.json(enrollments.map((e) => e.courseId));
});

export default router;
