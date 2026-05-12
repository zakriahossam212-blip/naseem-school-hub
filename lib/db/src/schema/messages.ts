import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromUserId: text("from_user_id").notNull(),
  toUserId: text("to_user_id").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Message = typeof messagesTable.$inferSelect;
export type InsertMessage = typeof messagesTable.$inferInsert;
