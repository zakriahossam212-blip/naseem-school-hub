import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { coursesTable } from "./courses";

export const scheduleTypeEnum = pgEnum("schedule_type", ["lesson", "exam", "event"]);
export const dayOfWeekEnum = pgEnum("day_of_week", ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]);

export const scheduleEntriesTable = pgTable("schedule_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  type: scheduleTypeEnum("type").notNull().default("lesson"),
  courseId: uuid("course_id").references(() => coursesTable.id, { onDelete: "cascade" }),
  dayOfWeek: dayOfWeekEnum("day_of_week"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  specificDate: timestamp("specific_date", { withTimezone: true }),
  location: text("location"),
  notes: text("notes"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ScheduleEntry = typeof scheduleEntriesTable.$inferSelect;
export type InsertScheduleEntry = typeof scheduleEntriesTable.$inferInsert;
