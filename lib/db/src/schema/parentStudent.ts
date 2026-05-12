import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const parentStudentLinksTable = pgTable("parent_student_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: text("parent_id").notNull(),
  studentId: text("student_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ParentStudentLink = typeof parentStudentLinksTable.$inferSelect;
export type InsertParentStudentLink = typeof parentStudentLinksTable.$inferInsert;
