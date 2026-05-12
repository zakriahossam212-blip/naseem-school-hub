import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { submissionsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { CreateSubmissionBody, UpdateSubmissionBody } from "@workspace/api-zod";

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

router.get("/submissions", async (req, res): Promise<void> => {
  const { assignmentId, studentId } = req.query as { assignmentId?: string; studentId?: string };
  let subs;
  if (assignmentId && studentId) {
    subs = await db.select().from(submissionsTable)
      .where(and(
        eq(submissionsTable.assignmentId, assignmentId),
        eq(submissionsTable.studentId, studentId),
      ));
  } else if (assignmentId) {
    subs = await db.select().from(submissionsTable)
      .where(eq(submissionsTable.assignmentId, assignmentId))
      .orderBy(desc(submissionsTable.submittedAt));
  } else if (studentId) {
    subs = await db.select().from(submissionsTable)
      .where(eq(submissionsTable.studentId, studentId))
      .orderBy(desc(submissionsTable.submittedAt));
  } else {
    subs = await db.select().from(submissionsTable).orderBy(desc(submissionsTable.submittedAt));
  }
  res.json(subs.map(mapSub));
});

router.post("/submissions", async (req, res): Promise<void> => {
  const parsed = CreateSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const [sub] = await db.insert(submissionsTable).values({
    assignmentId: data.assignmentId,
    studentId: data.studentId,
    content: data.content || null,
    fileUrl: data.fileUrl || null,
    status: data.status || "submitted",
  }).returning();
  res.status(201).json(mapSub(sub));
});

router.patch("/submissions/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = UpdateSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const updates: Partial<typeof submissionsTable.$inferInsert> = {};
  if (data.content !== undefined) updates.content = data.content || null;
  if (data.fileUrl !== undefined) updates.fileUrl = data.fileUrl || null;
  if (data.grade !== undefined) updates.grade = data.grade;
  if (data.feedback !== undefined) updates.feedback = data.feedback || null;
  if (data.status !== undefined) updates.status = data.status;
  if (data.gradedBy !== undefined) updates.gradedBy = data.gradedBy || null;
  if (data.gradedBy !== undefined) updates.gradedAt = new Date();

  const [sub] = await db.update(submissionsTable)
    .set(updates)
    .where(eq(submissionsTable.id, id))
    .returning();

  if (!sub) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }
  res.json(mapSub(sub));
});

export default router;
