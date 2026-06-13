import { z } from 'zod';

export const createAssignmentSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  maxGrade: z.number().int().min(0).max(1000).optional(),
  attachmentUrl: z.string().url().optional().nullable(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
