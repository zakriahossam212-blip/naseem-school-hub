/**
 * TypeScript Type Definitions - Organized by Domain
 * 
 * This file contains all type definitions for the backend API.
 * Types are organized into clear categories:
 * 1. Common/Shared types
 * 2. Authentication types
 * 3. Course types
 * 4. Assignment & Grading types
 * 5. Messaging types
 * 6. Schedule types
 * 7. API Response types
 */

// ============================================================================
// COMMON / SHARED TYPES
// ============================================================================

/**
 * API Response Wrapper - used for all API responses
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * API Error Format - standardized error response
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ============================================================================
// AUTHENTICATION & USER TYPES
// ============================================================================

/**
 * User Profile DTO
 */
export interface ProfileDto {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  role?: string;
}

/**
 * Ensure Profile Request - called on first login
 */
export interface EnsureProfileRequest {
  fullName?: string;
  role?: 'student' | 'teacher' | 'parent' | 'admin';
}

/**
 * Update Profile Request
 */
export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
}

/**
 * Profile with additional metadata
 */
export interface ProfileWithMetadata extends ProfileDto {
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// COURSE & LEARNING TYPES
// ============================================================================

/**
 * Course Data Transfer Object
 */
export interface CourseDto {
  id: string;
  title: string;
  description: string | null;
  teacherId: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Course Request
 */
export interface CreateCourseRequest {
  title: string;
  description?: string;
}

/**
 * Update Course Request
 */
export interface UpdateCourseRequest {
  title?: string;
  description?: string;
}

/**
 * Course with full details including teacher info
 */
export interface CourseWithTeacher extends CourseDto {
  teacher?: ProfileDto;
  studentCount?: number;
  lessonCount?: number;
}

/**
 * Lesson Data Transfer Object
 */
export interface LessonDto {
  id: string;
  courseId: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  orderIndex: number;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Lesson Request
 */
export interface CreateLessonRequest {
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  orderIndex?: number;
}

/**
 * Update Lesson Request
 */
export interface UpdateLessonRequest {
  title?: string;
  content?: string;
  videoUrl?: string;
  orderIndex?: number;
}

/**
 * Enrollment Data Transfer Object
 */
export interface EnrollmentDto {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
}

/**
 * Course enrollment response
 */
export interface CourseEnrollmentResponse {
  courseId: string;
  studentCount: number;
  students: ProfileDto[];
}

// ============================================================================
// ASSIGNMENT & GRADING TYPES
// ============================================================================

/**
 * Assignment Data Transfer Object
 */
export interface AssignmentDto {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  maxGrade: number;
  attachmentUrl: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Assignment Request
 */
export interface CreateAssignmentRequest {
  courseId: string;
  title: string;
  description?: string;
  dueDate?: string;
  maxGrade?: number;
  attachmentUrl?: string;
}

/**
 * Update Assignment Request
 */
export interface UpdateAssignmentRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  maxGrade?: number;
  attachmentUrl?: string;
}

/**
 * Submission Data Transfer Object
 */
export interface SubmissionDto {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string | null;
  fileUrl: string | null;
  grade: number | null;
  feedback: string | null;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
  gradedBy: string | null;
  gradedAt: string | null;
  submittedAt: string;
  updatedAt?: string;
}

/**
 * Create Submission Request
 */
export interface CreateSubmissionRequest {
  assignmentId: string;
  content?: string;
  fileUrl?: string;
}

/**
 * Grade Submission Request
 */
export interface GradeSubmissionRequest {
  grade: number;
  feedback?: string;
}

/**
 * Grade Data Transfer Object - for parent/student viewing
 */
export interface GradeDto {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseTitle: string;
  grade: number | null;
  maxGrade: number;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
  feedback: string | null;
  submittedAt: string;
}

/**
 * Assignment with submission details
 */
export interface AssignmentWithSubmissions extends AssignmentDto {
  submissions?: SubmissionDto[];
  submissionCount?: number;
}

/**
 * Student grades summary
 */
export interface StudentGradesSummary {
  studentId: string;
  studentName: string;
  totalGrades: number;
  averageGrade: number;
  grades: GradeDto[];
}

// ============================================================================
// MESSAGING TYPES
// ============================================================================

/**
 * Message Data Transfer Object
 */
export interface MessageDto {
  id: string;
  fromUserId: string;
  toUserId: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Send Message Request
 */
export interface SendMessageRequest {
  toUserId: string;
  subject: string;
  body: string;
}

/**
 * Message with sender/recipient profile info
 */
export interface MessageWithProfiles extends MessageDto {
  sender?: ProfileDto;
  recipient?: ProfileDto;
}

/**
 * Inbox summary
 */
export interface InboxSummary {
  unreadCount: number;
  messages: MessageDto[];
}

// ============================================================================
// SCHEDULE & CALENDAR TYPES
// ============================================================================

/**
 * Schedule Entry Data Transfer Object
 */
export interface ScheduleEntryDto {
  id: string;
  title: string;
  type: 'LESSON' | 'EXAM' | 'EVENT';
  courseId: string | null;
  dayOfWeek: string | null;  // MON, TUE, WED, THU, FRI, SAT, SUN
  startTime: string | null;  // HH:MM format
  endTime: string | null;    // HH:MM format
  specificDate: string | null;
  location: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Schedule Entry Request
 */
export interface CreateScheduleEntryRequest {
  title: string;
  type?: 'LESSON' | 'EXAM' | 'EVENT';
  courseId?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  specificDate?: string;
  location?: string;
  notes?: string;
}

/**
 * Update Schedule Entry Request
 */
export interface UpdateScheduleEntryRequest {
  title?: string;
  type?: 'LESSON' | 'EXAM' | 'EVENT';
  courseId?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  specificDate?: string;
  location?: string;
  notes?: string;
}

// ============================================================================
// PARENT PORTAL TYPES
// ============================================================================

/**
 * Parent-Student Link Response
 */
export interface ParentLinkResponse {
  id: string;
  parentId: string;
  studentId: string;
  studentName: string;
  createdAt: string;
}

/**
 * Link Parent Request
 */
export interface LinkParentRequest {
  studentId: string;
}

/**
 * Student overview for parent
 */
export interface StudentOverview {
  studentId: string;
  studentName: string;
  enrolledCourses: CourseDto[];
  recentGrades: GradeDto[];
  upcomingAssignments: AssignmentDto[];
}

// ============================================================================
// FILE STORAGE TYPES
// ============================================================================

/**
 * File Record Data Transfer Object
 */
export interface FileRecordDto {
  id: string;
  objectPath: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

/**
 * File Upload Request
 */
export interface FileUploadRequest {
  file: File;
  fileName?: string;
}

/**
 * File Upload Response
 */
export interface FileUploadResponse {
  id: string;
  objectPath: string;
  fileName: string;
  url: string;
}

// ============================================================================
// AUDIT & LOGGING TYPES
// ============================================================================

/**
 * Audit Log Data Transfer Object
 */
export interface AuditLogDto {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityType: string;
  entityId: string;
  userId: string;
  changes?: Record<string, any>;
  description?: string;
  createdAt: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Request context - extracted from auth middleware
 */
export interface RequestContext {
  userId: string;
  role: string;
  userProfile: ProfileDto;
}

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Query filters
 */
export interface QueryFilters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortOrder;
  search?: string;
  [key: string]: any;
}

/**
 * Utility type for database model to DTO mapping
 */
export type MapToDtoFunction<T, U> = (model: T) => U;
