/**
 * Schedule & Calendar Type Definitions
 */

/**
 * Schedule Entry Data Transfer Object
 */
export interface ScheduleEntryDto {
  id: string;
  courseId: string;
  eventName: string;
  eventType: 'LECTURE' | 'LAB' | 'EXAM' | 'ASSIGNMENT' | 'OTHER';
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  description?: string;
  location?: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Create Schedule Entry Request
 */
export interface CreateScheduleRequest {
  courseId: string;
  eventName: string;
  eventType: 'LECTURE' | 'LAB' | 'EXAM' | 'ASSIGNMENT' | 'OTHER';
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  description?: string;
  location?: string;
}

/**
 * Update Schedule Entry Request
 */
export interface UpdateScheduleRequest {
  eventName?: string;
  eventType?: 'LECTURE' | 'LAB' | 'EXAM' | 'ASSIGNMENT' | 'OTHER';
  startTime?: string;
  endTime?: string;
  dayOfWeek?: number;
  description?: string;
  location?: string;
}

/**
 * Schedule with course details
 */
export interface ScheduleWithCourse extends ScheduleEntryDto {
  courseName?: string;
  teacherName?: string;
}

/**
 * Weekly schedule view
 */
export interface WeeklySchedule {
  week: number;
  year: number;
  entries: ScheduleEntryDto[];
}

/**
 * Calendar event
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  eventType: 'LECTURE' | 'LAB' | 'EXAM' | 'ASSIGNMENT' | 'HOLIDAY' | 'OTHER';
  location?: string;
  courseId?: string;
}
