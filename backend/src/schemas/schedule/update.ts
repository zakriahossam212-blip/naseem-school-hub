import { z } from 'zod';

export const updateScheduleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  type: z.enum(['LESSON', 'EXAM', 'EVENT']).optional(),
  courseId: z.string().optional().nullable(),
  dayOfWeek: z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']).optional().nullable(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  specificDate: z.string().datetime().optional().nullable(),
  location: z.string().max(500).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
