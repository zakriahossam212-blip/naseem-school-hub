import { z } from 'zod';

export const sendMessageSchema = z.object({
  toUserId: z.string().min(1),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
