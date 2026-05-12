import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { coursesTable, courseEnrollmentsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateCourseBody, EnrollInCourseBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/courses", async (req, res): Promise<void> => {
  const { teacherId } = req.query as { teacherId?: string };
  let courses;
  if (teacherId) {
    courses = await db.select().from(coursesTable).where(eq(coursesTable.teacherId, teacherId)).orderBy(desc(coursesTable.createdAt));
  } else {
    courses = await db.select().from(coursesTable).orderBy(desc(coursesTable.createdAt));
  }
  res.json(courses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    teacherId: c.teacherId,
    createdAt: c.createdAt.toISOString(),
  })));
});

router.post("/courses", async (req, res): Promise<void> => {
  const parsed = CreateCourseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [course] = await db.insert(coursesTable).values({
    title: parsed.data.title,
    description: parsed.data.description || null,
    teacherId: parsed.data.teacherId,
  }).returning();
  res.status(201).json({
    id: course.id,
    title: course.title,
    description: course.description,
    teacherId: course.teacherId,
    createdAt: course.createdAt.toISOString(),
  });
});

router.get("/courses/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json({
    id: course.id,
    title: course.title,
    description: course.description,
    teacherId: course.teacherId,
    createdAt: course.createdAt.toISOString(),
  });
});

router.post("/courses/:id/enroll", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = EnrollInCourseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { studentId } = parsed.data;

  const existing = await db.select().from(courseEnrollmentsTable)
    .where(eq(courseEnrollmentsTable.courseId, id));
  const alreadyEnrolled = existing.some((e) => e.studentId === studentId);
  if (alreadyEnrolled) {
    res.status(409).json({ error: "Already enrolled" });
    return;
  }

  await db.insert(courseEnrollmentsTable).values({ courseId: id, studentId });
  res.status(201).json({ success: true });
});

router.get("/enrollments", async (req, res): Promise<void> => {
  const { studentId } = req.query as { studentId?: string };
  if (!studentId) {
    res.json([]);
    return;
  }
  const enrollments = await db.select().from(courseEnrollmentsTable)
    .where(eq(courseEnrollmentsTable.studentId, studentId));
  res.json(enrollments.map((e) => e.courseId));
});

export default router;
