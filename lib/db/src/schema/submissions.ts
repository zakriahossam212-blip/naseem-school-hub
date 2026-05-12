import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { assignmentsTable } from "./assignments";

export const submissionsTable = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id").notNull().references(() => assignmentsTable.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull(),
  content: text("content"),
  fileUrl: text("file_url"),
  grade: integer("grade"),
  feedback: text("feedback"),
  status: text("status").notNull().default("submitted"),
  gradedBy: text("graded_by"),
  gradedAt: timestamp("graded_at", { withTimezone: true }),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSubmissionSchema = createInsertSchema(submissionsTable).omit({ id: true, submittedAt: true });
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissionsTable.$inferSelect;
