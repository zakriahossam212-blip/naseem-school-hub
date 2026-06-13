/**
 * Repository Layer - Data access abstraction
 * All repositories follow the BaseRepository pattern and abstract Prisma operations
 */

// Auth repositories
export { ProfileRepository } from './auth';

// Course repositories
export { CourseRepository, EnrollmentRepository } from './courses';

// Assignment repositories
export { AssignmentRepository, SubmissionRepository } from './assignments';

// Messaging repositories
export { MessageRepository } from './messaging';

// Base repository for extension
export { BaseRepository } from './BaseRepository';
