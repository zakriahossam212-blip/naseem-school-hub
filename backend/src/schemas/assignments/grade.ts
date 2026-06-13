import { z } from 'zod';

export const gradeSubmissionSchema = z.object({
  grade: z.number().int().min(0).max(1000),
  feedback: z.string().max(5000).optional().nullable(),
});

export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
