/**
 * Parent Portal Type Definitions
 */

import { CourseDto } from './courses';
import { GradeDto } from './assignments';

/**
 * Parent-Student Link Response
 */
export interface ParentLinkResponse {
  linkId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  linkedAt: Date;
}

/**
 * Student Overview for Parent
 */
export interface StudentOverview {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  role: string;
  enrolledCourses: CourseDto[];
  recentGrades: GradeDto[];
  upcomingAssignments: AssignmentPreview[];
  averageGrade?: number;
  attendanceRate?: number;
}

/**
 * Assignment Preview for Parent
 */
export interface AssignmentPreview {
  assignmentId: string;
  title: string;
  courseName: string;
  dueDate: Date;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  grade?: number;
}

/**
 * Student Performance Summary
 */
export interface StudentPerformance {
  studentId: string;
  courseName: string;
  averageGrade: number;
  totalAssignments: number;
  completedAssignments: number;
  completionRate: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

/**
 * Parent Dashboard Data
 */
export interface ParentDashboard {
  linkedStudents: ParentLinkResponse[];
  recentActivities: ActivityLog[];
  alerts: ParentAlert[];
  performanceSummary: StudentPerformance[];
}

/**
 * Activity Log Entry
 */
export interface ActivityLog {
  id: string;
  studentId: string;
  activityType: string;
  description: string;
  timestamp: Date;
}

/**
 * Parent Alert
 */
export interface ParentAlert {
  id: string;
  studentId: string;
  alertType: 'LOW_GRADE' | 'MISSED_ASSIGNMENT' | 'ABSENCE' | 'BEHAVIOR' | 'OTHER';
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  resolved: boolean;
}

/**
 * Link Student Request
 */
export interface LinkStudentRequest {
  studentId: string;
}

/**
 * Student Grades Response
 */
export interface StudentGradesResponse {
  studentId: string;
  studentName: string;
  grades: GradeDto[];
  summary: GradesSummary;
}

/**
 * Grades Summary
 */
export interface GradesSummary {
  totalCourses: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  passedCourses: number;
  failedCourses: number;
}
