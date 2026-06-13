import { z } from 'zod';

export const updateCourseSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
