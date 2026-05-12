import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { scheduleEntriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

const router: IRouter = Router();

const mapEntry = (e: typeof scheduleEntriesTable.$inferSelect) => ({
  id: e.id,
  title: e.title,
  type: e.type,
  courseId: e.courseId,
  dayOfWeek: e.dayOfWeek,
  startTime: e.startTime,
  endTime: e.endTime,
  specificDate: e.specificDate ? e.specificDate.toISOString() : null,
  location: e.location,
  notes: e.notes,
  createdBy: e.createdBy,
  createdAt: e.createdAt.toISOString(),
});

router.get("/schedule", async (_req, res): Promise<void> => {
  const entries = await db.select().from(scheduleEntriesTable).orderBy(desc(scheduleEntriesTable.createdAt));
  res.json(entries.map(mapEntry));
});

router.post("/schedule", requireAuth, requireRole("teacher", "admin"), async (req, res): Promise<void> => {
  const { title, type, courseId, dayOfWeek, startTime, endTime, specificDate, location, notes } =
    req.body as {
      title?: string; type?: "lesson" | "exam" | "event";
      courseId?: string; dayOfWeek?: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
      startTime?: string; endTime?: string; specificDate?: string;
      location?: string; notes?: string;
    };
  if (!title?.trim()) { res.status(400).json({ error: "title required" }); return; }
  const [entry] = await db.insert(scheduleEntriesTable).values({
    title: title.trim(),
    type: type || "lesson",
    courseId: courseId || null,
    dayOfWeek: dayOfWeek || null,
    startTime: startTime || null,
    endTime: endTime || null,
    specificDate: specificDate ? new Date(specificDate) : null,
    location: location?.trim() || null,
    notes: notes?.trim() || null,
    createdBy: req.authUserId,
  }).returning();
  res.status(201).json(mapEntry(entry));
});

router.delete("/schedule/:id", requireAuth, async (req, res): Promise<void> => {
  const id = String(req.params.id);
  const [entry] = await db.select().from(scheduleEntriesTable).where(eq(scheduleEntriesTable.id, id));
  if (!entry) { res.status(404).json({ error: "Not found" }); return; }
  if (entry.createdBy !== req.authUserId) { res.status(403).json({ error: "Forbidden" }); return; }
  await db.delete(scheduleEntriesTable).where(eq(scheduleEntriesTable.id, id));
  res.json({ success: true });
});

export default router;
