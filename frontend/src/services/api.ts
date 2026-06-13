/**
 * Centralized API Client
 * All communication with backend goes through this module
 * Backend runs at http://localhost:3000/api
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function req<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...init } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {}),
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(BASE_URL + path, { ...init, headers });
  
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  
  return res.json() as Promise<T>;
}

// ============================================================================
// AUTH
// ============================================================================

export const authApi = {
  /**
   * Get current user profile
   */
  me: (token: string) =>
    req<{ userId: string; fullName: string | null; roles: string[] }>(
      "/auth/me",
      { token }
    ),

  /**
   * Create or update user profile (first login)
   */
  ensureProfile: (
    token: string,
    body: { fullName?: string; role?: "student" | "teacher" | "parent" }
  ) =>
    req<{ userId: string; fullName: string | null; roles: string[] }>(
      "/auth/ensure-profile",
      { method: "POST", body: JSON.stringify(body), token }
    ),
};

// ============================================================================
// COURSES
// ============================================================================

export interface CourseDto {
  id: string;
  title: string;
  description: string | null;
  teacherId: string;
  createdAt: string;
}

export const coursesApi = {
  /**
   * List all courses or filter by teacher
   */
  list: (teacherId?: string) => {
    const query = teacherId ? `?teacherId=${encodeURIComponent(teacherId)}` : "";
    return req<CourseDto[]>(`/courses${query}`);
  },

  /**
   * Get course by ID
   */
  get: (id: string) => req<CourseDto>(`/courses/${id}`),

  /**
   * Create new course (teacher only)
   */
  create: (body: { title: string; description?: string }, token: string) =>
    req<CourseDto>("/courses", {
      method: "POST",
      body: JSON.stringify(body),
      token,
    }),

  /**
   * Update course (teacher only)
   */
  update: (
    id: string,
    body: { title?: string; description?: string },
    token: string
  ) =>
    req<CourseDto>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      token,
    }),

  /**
   * Delete course (teacher only)
   */
  delete: (id: string, token: string) =>
    req<{ success: boolean }>(`/courses/${id}`, { method: "DELETE", token }),

  /**
   * Enroll student in course
   */
  enroll: (id: string, token: string) =>
    req<{ success: boolean }>(`/courses/${id}/enroll`, {
      method: "POST",
      body: JSON.stringify({}),
      token,
    }),
};

// ============================================================================
// ASSIGNMENTS
// ============================================================================

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
}

export const assignmentsApi = {
  /**
   * List assignments (optional courseId filter)
   */
  list: (courseId?: string) => {
    const query = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
    return req<AssignmentDto[]>(`/assignments${query}`);
  },

  /**
   * Get assignment by ID
   */
  get: (id: string) => req<AssignmentDto>(`/assignments/${id}`),

  /**
   * Create assignment (teacher only)
   */
  create: (
    body: {
      courseId: string;
      title: string;
      description?: string;
      dueDate?: string;
      maxGrade?: number;
    },
    token: string
  ) =>
    req<AssignmentDto>("/assignments", {
      method: "POST",
      body: JSON.stringify(body),
      token,
    }),

  /**
   * Delete assignment (teacher only)
   */
  delete: (id: string, token: string) =>
    req<{ success: boolean }>(`/assignments/${id}`, { method: "DELETE", token }),
};

// ============================================================================
// SUBMISSIONS
// ============================================================================

export interface SubmissionDto {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string | null;
  fileUrl: string | null;
  grade: number | null;
  feedback: string | null;
  status: string;
  gradedBy: string | null;
  gradedAt: string | null;
  submittedAt: string;
}

export const submissionsApi = {
  /**
   * List submissions for assignment
   */
  list: (assignmentId: string, token: string) =>
    req<SubmissionDto[]>(`/submissions?assignmentId=${encodeURIComponent(assignmentId)}`, {
      token,
    }),

  /**
   * Submit assignment (student)
   */
  create: (
    body: { assignmentId: string; content?: string; fileUrl?: string },
    token: string
  ) =>
    req<SubmissionDto>("/submissions", {
      method: "POST",
      body: JSON.stringify(body),
      token,
    }),

  /**
   * Grade submission (teacher) or update (student)
   */
  update: (
    id: string,
    body: { grade?: number; feedback?: string; content?: string; fileUrl?: string },
    token: string
  ) =>
    req<SubmissionDto>(`/submissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      token,
    }),
};

// ============================================================================
// PROFILES
// ============================================================================

export interface ProfileDto {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export const profilesApi = {
  /**
   * Get user profile by ID
   */
  get: (userId: string) => req<ProfileDto>(`/profiles/${userId}`),

  /**
   * Get multiple profiles
   */
  listByIds: (userIds: string[]) =>
    req<ProfileDto[]>(`/profiles?userIds=${userIds.join(",")}`),
};

// ============================================================================
// ENROLLMENTS
// ============================================================================

export const enrollmentsApi = {
  /**
   * Get list of course IDs student is enrolled in
   */
  list: (token: string) => req<string[]>("/enrollments", { token }),
};

// ============================================================================
// SCHEDULE (Ready for implementation)
// ============================================================================

export const scheduleApi = {
  list: () => req<any[]>("/schedule"),
  create: (body: any, token: string) =>
    req<any>("/schedule", { method: "POST", body: JSON.stringify(body), token }),
  delete: (id: string, token: string) =>
    req<{ success: boolean }>(`/schedule/${id}`, { method: "DELETE", token }),
};

// ============================================================================
// MESSAGES (Ready for implementation)
// ============================================================================

export const messagesApi = {
  inbox: (token: string) => req<any[]>("/messages/inbox", { token }),
  send: (body: any, token: string) =>
    req<any>("/messages", { method: "POST", body: JSON.stringify(body), token }),
  markRead: (id: string, token: string) =>
    req<{ success: boolean }>(`/messages/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({}),
      token,
    }),
};

// ============================================================================
// PARENT PORTAL (Ready for implementation)
// ============================================================================

export const parentApi = {
  linkStudent: (studentId: string, token: string) =>
    req<{ id: string }>("/parent/link", {
      method: "POST",
      body: JSON.stringify({ studentId }),
      token,
    }),
  getStudents: (token: string) => req<ProfileDto[]>("/parent/students", { token }),
  getStudentGrades: (studentId: string, token: string) =>
    req<any[]>(`/parent/students/${studentId}/grades`, { token }),
  getStudentCourses: (studentId: string, token: string) =>
    req<CourseDto[]>(`/parent/students/${studentId}/courses`, { token }),
};

// ============================================================================
// FILES (Ready for implementation)
// ============================================================================

export const filesApi = {
  /**
   * Get presigned upload URL
   */
  getUploadUrl: (token: string) =>
    req<{ uploadURL: string; objectPath: string }>("/files/upload-url", {
      method: "POST",
      body: JSON.stringify({}),
      token,
    }),

  /**
   * Register file ownership after upload to GCS
   */
  registerFile: (objectPath: string, token: string) =>
    req<{ objectPath: string }>("/files/register", {
      method: "POST",
      body: JSON.stringify({ objectPath }),
      token,
    }),
};
