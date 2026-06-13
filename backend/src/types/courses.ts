/**
 * Courses & Learning Type Definitions
 */

/**
 * Course Data Transfer Object
 */
export interface CourseDto {
  id: string;
  title: string;
  description: string | null;
  teacherId: string;
  createdAt: Date;
  updatedAt?: Date;
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
 * Course with full details including teacher info and counts
 */
export interface CourseWithDetails extends CourseDto {
  teacherName?: string;
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
  createdAt: Date;
  updatedAt?: Date;
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
  enrolledAt: Date;
}

/**
 * Enroll Course Request
 */
export interface EnrollCourseRequest {
  courseId: string;
  studentId?: string;
}

/**
 * Course enrollment response with student details
 */
export interface CourseEnrollmentResponse {
  courseId: string;
  courseName: string;
  studentCount: number;
  enrolledAt: Date;
}
