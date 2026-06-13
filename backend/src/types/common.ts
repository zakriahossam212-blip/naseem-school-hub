/**
 * Common / Shared Type Definitions
 * Used across multiple features
 */

/**
 * API Response Wrapper - used for all API responses
 */
export interface ApiResponse<T = any> {
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

/**
 * Request context - user info from middleware
 */
export interface RequestContext {
  userId: string;
  userRole?: string;
  sessionId?: string;
}

/**
 * Query filters for list operations
 */
export interface QueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
