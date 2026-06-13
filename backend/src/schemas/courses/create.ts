import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
