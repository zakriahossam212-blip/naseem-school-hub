/**
 * Type Definitions - Main Export
 * 
 * All types are organized by feature in separate files:
 * - common.ts: Shared types (ApiResponse, Pagination, etc)
 * - auth.ts: Authentication & profiles
 * - courses.ts: Courses, lessons, enrollments
 * - assignments.ts: Assignments, submissions, grading
 * - messaging.ts: Messages and conversations
 * - schedule.ts: Schedule entries and calendar
 * - parent.ts: Parent portal types
 */

// Common types
export * from './common';

// Feature-specific types
export * from './auth';
export * from './courses';
export * from './assignments';
export * from './messaging';
export * from './schedule';
export * from './parent';
