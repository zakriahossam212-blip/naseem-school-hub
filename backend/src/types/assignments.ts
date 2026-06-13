/**
 * Assignments, Submissions & Grading Type Definitions
 */

/**
 * Assignment Data Transfer Object
 */
export interface AssignmentDto {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  maxGrade: number;
  attachmentUrl: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Create Assignment Request
 */
export interface CreateAssignmentRequest {
  courseId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  maxGrade?: number;
  attachmentUrl?: string;
}

/**
 * Update Assignment Request
 */
export interface UpdateAssignmentRequest {
  title?: string;
  description?: string;
  dueDate?: Date;
  maxGrade?: number;
  attachmentUrl?: string;
}

/**
 * Assignment with submission count
 */
export interface AssignmentWithStats extends AssignmentDto {
  totalSubmissions?: number;
  gradedSubmissions?: number;
  avgGrade?: number;
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
  gradedAt: Date | null;
  submittedAt: Date;
  updatedAt?: Date;
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
  submittedAt: Date;
  gradedAt: Date | null;
}

/**
 * Grade statistics
 */
export interface GradeStats {
  totalAssignments: number;
  submittedCount: number;
  gradedCount: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
}
