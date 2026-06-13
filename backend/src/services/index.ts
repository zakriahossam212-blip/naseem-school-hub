/**
 * Services Layer - Barrel Export
 * 
 * All services are organized by domain/feature:
 * - auth: Authentication & profile management
 * - courses: Course management (courses, enrollments, lessons)
 * - assignments: Assignment management (assignments, submissions, grading)
 * - messaging: User messaging
 * - schedule: Class schedules & events
 * - parent: Parent portal functionality
 * - common: Shared services (profiles, files)
 */

// Auth Services
export { AuthService, authService } from './AuthService';

// Course Services
export { CourseService, courseService } from './CourseService';

// Assignment Services
export { AssignmentService, assignmentService } from './AssignmentService';

// Future: Organized imports once refactored
// export * from './auth/index';
// export * from './courses/index';
// export * from './assignments/index';
// export * from './messaging/index';
// export * from './schedule/index';
// export * from './parent/index';
// export * from './common/index';
