import { z } from 'zod';

export const submitAssignmentSchema = z.object({
  assignmentId: z.string().min(1),
  content: z.string().max(10000).optional().nullable(),
  fileUrl: z.string().url().optional().nullable(),
});

export type SubmitAssignmentInput = z.infer<typeof submitAssignmentSchema>;
