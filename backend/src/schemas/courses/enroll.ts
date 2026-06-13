import { z } from 'zod';

export const enrollSchema = z.object({
  courseId: z.string().min(1),
});

export type EnrollInput = z.infer<typeof enrollSchema>;
