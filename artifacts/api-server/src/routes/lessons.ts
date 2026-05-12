import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { lessonsTable, coursesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const mapLesson = (l: typeof lessonsTable.$inferSelect) => ({
  id: l.id,
  courseId: l.courseId,
  title: l.title,
  content: l.content,
  videoUrl: l.videoUrl,
  orderIndex: l.orderIndex,
  createdBy: l.createdBy,
  createdAt: l.createdAt.toISOString(),
});

router.get("/lessons", async (req, res): Promise<void> => {
  const courseId = typeof req.query.courseId === "string" ? req.query.courseId : undefined;
  if (!courseId) { res.json([]); return; }
  const lessons = await db.select().from(lessonsTable)
    .where(eq(lessonsTable.courseId, courseId))
    .orderBy(asc(lessonsTable.orderIndex));
  res.json(lessons.map(mapLesson));
});

router.post("/lessons", requireAuth, async (req, res): Promise<void> => {
  const { courseId, title, content, videoUrl, orderIndex } =
    req.body as { courseId?: string; title?: string; content?: string; videoUrl?: string; orderIndex?: number };
  if (!courseId || !title?.trim()) { res.status(400).json({ error: "courseId and title required" }); return; }
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId));
  if (!course) { res.status(404).json({ error: "Course not found" }); return; }
  if (course.teacherId !== req.authUserId) { res.status(403).json({ error: "Forbidden" }); return; }
  const [lesson] = await db.insert(lessonsTable).values({
    courseId,
    title: title.trim(),
    content: content?.trim() || null,
    videoUrl: videoUrl?.trim() || null,
    orderIndex: orderIndex ?? 0,
    createdBy: req.authUserId,
  }).returning();
  res.status(201).json(mapLesson(lesson));
});

router.put("/lessons/:id", requireAuth, async (req, res): Promise<void> => {
  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, req.params.id));
  if (!lesson) { res.status(404).json({ error: "Not found" }); return; }
  if (lesson.createdBy !== req.authUserId) { res.status(403).json({ error: "Forbidden" }); return; }
  const { title, content, videoUrl, orderIndex } =
    req.body as { title?: string; content?: string; videoUrl?: string; orderIndex?: number };
  const [updated] = await db.update(lessonsTable).set({
    title: title?.trim() ?? lesson.title,
    content: content?.trim() ?? lesson.content,
    videoUrl: videoUrl?.trim() ?? lesson.videoUrl,
    orderIndex: orderIndex ?? lesson.orderIndex,
  }).where(eq(lessonsTable.id, req.params.id)).returning();
  res.json(mapLesson(updated));
});

router.delete("/lessons/:id", requireAuth, async (req, res): Promise<void> => {
  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, req.params.id));
  if (!lesson) { res.status(404).json({ error: "Not found" }); return; }
  if (lesson.createdBy !== req.authUserId) { res.status(403).json({ error: "Forbidden" }); return; }
  await db.delete(lessonsTable).where(eq(lessonsTable.id, req.params.id));
  res.json({ success: true });
});

export default router;
