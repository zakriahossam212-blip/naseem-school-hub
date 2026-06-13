import { z } from 'zod';

export const ensureProfileSchema = z.object({
  fullName: z.string().min(1).max(200).optional().nullable(),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'ADMIN']).optional(),
});

export type EnsureProfileInput = z.infer<typeof ensureProfileSchema>;
