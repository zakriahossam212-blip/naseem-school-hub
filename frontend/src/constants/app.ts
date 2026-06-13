/**
 * Application Constants
 * General app configuration, roles, schedule types, and thresholds
 */

// User Roles
export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  PARENT: "parent",
  ADMIN: "admin",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Days of Week (in order)
export const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

// Days order for display
export const DAY_ORDER = DAYS_OF_WEEK;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

// Schedule Types
export const SCHEDULE_TYPES = {
  EXAM: "exam",
  LESSON: "lesson",
  EVENT: "event",
} as const;

export type ScheduleType = typeof SCHEDULE_TYPES[keyof typeof SCHEDULE_TYPES];

// Schedule Type Colors (for UI display)
export const SCHEDULE_TYPE_COLORS: Record<ScheduleType, string> = {
  lesson: "bg-blue-50 border-blue-200 text-blue-700",
  exam: "bg-red-50 border-red-200 text-red-700",
  event: "bg-green-50 border-green-200 text-green-700",
} as const;

// Statistics
export const STATS = {
  courses: "+50",
  students: "+500",
  teachers: "+100",
} as const;

// Numeric Thresholds
export const NUMERIC_CONSTANTS = {
  DEFAULT_RETRY_COUNT: 1,
  DEFAULT_STALE_TIME: 30000, // 30 seconds
  GRADE_PASS_THRESHOLD: 60,
  GRADE_GOOD_THRESHOLD: 80,
  DEFAULT_MAX_GRADE: 100,
} as const;

// External Links
export const EXTERNAL_LINKS = {
  supportEmail: "support@nasreldin-school.com",
  supportPhone: "+20 123 456 7890",
} as const;
