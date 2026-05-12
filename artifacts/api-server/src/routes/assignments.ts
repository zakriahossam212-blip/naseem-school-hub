import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { assignmentsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateAssignmentBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/assignments", async (req, res): Promise<void> => {
  const { courseId } = req.query as { courseId?: string };
  let assignments;
  if (courseId) {
    assignments = await db.select().from(assignmentsTable)
      .where(eq(assignmentsTable.courseId, courseId))
      .orderBy(desc(assignmentsTable.createdAt));
  } else {
    assignments = await db.select().from(assignmentsTable)
      .orderBy(assignmentsTable.dueDate);
  }
  res.json(assignments.map((a) => ({
    id: a.id,
    courseId: a.courseId,
    title: a.title,
    description: a.description,
    dueDate: a.dueDate ? a.dueDate.toISOString() : null,
    maxGrade: a.maxGrade,
    attachmentUrl: a.attachmentUrl,
    createdBy: a.createdBy,
    createdAt: a.createdAt.toISOString(),
  })));
});

router.post("/assignments", async (req, res): Promise<void> => {
  const parsed = CreateAssignmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const [assignment] = await db.insert(assignmentsTable).values({
    courseId: data.courseId,
    title: data.title,
    description: data.description || null,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    maxGrade: data.maxGrade ?? 100,
    attachmentUrl: data.attachmentUrl || null,
    createdBy: data.createdBy,
  }).returning();

  res.status(201).json({
    id: assignment.id,
    courseId: assignment.courseId,
    title: assignment.title,
    description: assignment.description,
    dueDate: assignment.dueDate ? assignment.dueDate.toISOString() : null,
    maxGrade: assignment.maxGrade,
    attachmentUrl: assignment.attachmentUrl,
    createdBy: assignment.createdBy,
    createdAt: assignment.createdAt.toISOString(),
  });
});

router.get("/assignments/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [assignment] = await db.select().from(assignmentsTable).where(eq(assignmentsTable.id, id));
  if (!assignment) {
    res.status(404).json({ error: "Assignment not found" });
    return;
  }
  res.json({
    id: assignment.id,
    courseId: assignment.courseId,
    title: assignment.title,
    description: assignment.description,
    dueDate: assignment.dueDate ? assignment.dueDate.toISOString() : null,
    maxGrade: assignment.maxGrade,
    attachmentUrl: assignment.attachmentUrl,
    createdBy: assignment.createdBy,
    createdAt: assignment.createdAt.toISOString(),
  });
});

export default router;
