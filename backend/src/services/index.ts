/**
 * Services Layer - Barrel Export
 * 
 * All services are organized by domain/feature into separate folders:
 * - auth: Authentication & profile management
 * - courses: Course management (courses, enrollments, lessons)
 * - assignments: Assignment management (assignments, submissions, grading)
 * - messaging: User messaging
 * - schedule: Class schedules & events
 * - parent: Parent portal functionality
 */

// Auth Services
export * from './auth';

// Course Services
export * from './courses';

// Assignment Services
export * from './assignments';

// Messaging Services
export * from './messaging';

// Schedule Services
export * from './schedule';

// Parent Services
export * from './parent';
