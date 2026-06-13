/**
 * Authentication & User Profile Type Definitions
 */

/**
 * User Profile DTO
 */
export interface ProfileDto {
  userId: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ensure Profile Request - called on first login
 */
export interface EnsureProfileRequest {
  userId: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
  phoneNumber?: string;
  avatar?: string;
}

/**
 * Update Profile Request
 */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
}

/**
 * Profile with additional metadata
 */
export interface ProfileWithMetadata extends ProfileDto {
  enrollmentCount?: number;
  coursesTeaching?: number;
  studentLinked?: number;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: ProfileDto;
  token?: string;
  expiresAt?: Date;
}
