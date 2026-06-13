/**
 * Frontend Type Definitions
 * 
 * This file contains frontend-specific types that extend backend types.
 * Backend types should be imported directly from the backend when available.
 * Frontend types are UI-specific or augment backend types with display logic.
 */

/**
 * UI State for async operations
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

/**
 * Paginated list response
 */
export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Form submission state
 */
export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  message?: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    userId: string;
    fullName: string | null;
    roles: string[];
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Filter/Search params
 */
export interface ListFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Toast notification
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean;
  title?: string;
  data?: any;
}

/**
 * Course with UI metadata
 */
export interface CourseWithUI {
  id: string;
  title: string;
  description: string | null;
  teacherId: string;
  createdAt: string;
  // UI specific
  isEnrolled?: boolean;
  isFavorite?: boolean;
  progress?: number; // 0-100
}

/**
 * Assignment with UI metadata
 */
export interface AssignmentWithUI {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  maxGrade: number;
  attachmentUrl: string | null;
  createdBy: string;
  createdAt: string;
  // UI specific
  isOverdue?: boolean;
  isSubmitted?: boolean;
  grade?: number | null;
  feedback?: string | null;
}

/**
 * Student profile for parent view
 */
export interface StudentProfileForParent {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  // Parent-specific
  enrolledCoursesCount: number;
  averageGrade: number | null;
  pendingAssignments: number;
}

/**
 * Notification preference
 */
export interface NotificationPreference {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  notifyOnGrades: boolean;
  notifyOnAssignments: boolean;
  notifyOnMessages: boolean;
}

/**
 * User preference/settings
 */
export interface UserPreference {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  timezone: string;
  notification: NotificationPreference;
}
