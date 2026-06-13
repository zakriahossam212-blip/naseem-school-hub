import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { ScheduleEntryDto, CreateScheduleEntryRequest, UpdateScheduleEntryRequest } from "@/types/index";

export class ScheduleService {
  /**
   * Create schedule entry
   */
  async createScheduleEntry(
    createdBy: string,
    data: CreateScheduleEntryRequest
  ): Promise<ScheduleEntryDto> {
    const entry = await db.scheduleEntry.create({
      data: {
        title: data.title,
        type: data.type || "LESSON",
        courseId: data.courseId || null,
        dayOfWeek: data.dayOfWeek || null,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        specificDate: data.specificDate ? new Date(data.specificDate) : null,
        location: data.location || null,
        notes: data.notes || null,
        createdBy,
      },
    });

    return this.mapScheduleEntryToDto(entry);
  }

  /**
   * Get schedule entry by ID
   */
  async getScheduleEntry(id: string): Promise<ScheduleEntryDto> {
    const entry = await db.scheduleEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw errors.notFound("Schedule entry not found");
    }

    return this.mapScheduleEntryToDto(entry);
  }

  /**
   * List schedule entries (optionally filtered by course)
   */
  async listScheduleEntries(courseId?: string): Promise<ScheduleEntryDto[]> {
    const entries = await db.scheduleEntry.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: { specificDate: "asc" },
    });

    return entries.map((e) => this.mapScheduleEntryToDto(e));
  }

  /**
   * Update schedule entry
   */
  async updateScheduleEntry(
    id: string,
    userId: string,
    data: UpdateScheduleEntryRequest
  ): Promise<ScheduleEntryDto> {
    const entry = await db.scheduleEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw errors.notFound("Schedule entry not found");
    }

    if (entry.createdBy !== userId) {
      throw errors.forbidden("Only creator can update schedule entry");
    }

    const updated = await db.scheduleEntry.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.type && { type: data.type }),
        ...(data.courseId !== undefined && { courseId: data.courseId }),
        ...(data.dayOfWeek !== undefined && { dayOfWeek: data.dayOfWeek }),
        ...(data.startTime !== undefined && { startTime: data.startTime }),
        ...(data.endTime !== undefined && { endTime: data.endTime }),
        ...(data.specificDate && { specificDate: new Date(data.specificDate) }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });

    return this.mapScheduleEntryToDto(updated);
  }

  /**
   * Delete schedule entry
   */
  async deleteScheduleEntry(id: string, userId: string): Promise<void> {
    const entry = await db.scheduleEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw errors.notFound("Schedule entry not found");
    }

    if (entry.createdBy !== userId) {
      throw errors.forbidden("Only creator can delete schedule entry");
    }

    await db.scheduleEntry.delete({
      where: { id },
    });
  }

  private mapScheduleEntryToDto(entry: any): ScheduleEntryDto {
    return {
      id: entry.id,
      title: entry.title,
      type: entry.type,
      courseId: entry.courseId,
      dayOfWeek: entry.dayOfWeek,
      startTime: entry.startTime,
      endTime: entry.endTime,
      specificDate: entry.specificDate ? entry.specificDate.toISOString() : null,
      location: entry.location,
      notes: entry.notes,
      createdBy: entry.createdBy,
      createdAt: entry.createdAt.toISOString(),
    };
  }
}

export const scheduleService = new ScheduleService();
