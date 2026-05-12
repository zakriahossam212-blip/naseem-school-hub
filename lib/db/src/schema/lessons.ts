import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { coursesTable } from "./courses";

export const lessonsTable = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"),
  videoUrl: text("video_url"),
  orderIndex: integer("order_index").notNull().default(0),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Lesson = typeof lessonsTable.$inferSelect;
export type InsertLesson = typeof lessonsTable.$inferInsert;
