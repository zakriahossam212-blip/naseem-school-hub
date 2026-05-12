const BASE = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api";

async function req<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, ...init } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(BASE + path, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  auth: {
    me: (token: string) => req<{ userId: string; fullName: string | null; roles: string[] }>("/auth/me", { token }),
    ensureProfile: (token: string, body: { fullName?: string; role?: "student" | "teacher" | "parent" }) =>
      req<{ userId: string; fullName: string | null; roles: string[] }>("/auth/ensure-profile", {
        method: "POST", body: JSON.stringify(body), token,
      }),
  },
  profiles: {
    get: (userId: string) =>
      req<ProfileDto>(`/profiles/${userId}`),
    list: (userIds: string[]) =>
      req<ProfileDto[]>(`/profiles?userIds=${userIds.join(",")}`),
  },
  courses: {
    list: (token?: string) => req<CourseDto[]>("/courses", token ? { token } : {}),
    listByTeacher: (teacherId: string, token?: string) =>
      req<CourseDto[]>(`/courses?teacherId=${encodeURIComponent(teacherId)}`, token ? { token } : {}),
    get: (id: string) => req<CourseDto>(`/courses/${id}`),
    create: (body: { title: string; description?: string }, token: string) =>
      req<CourseDto>("/courses", { method: "POST", body: JSON.stringify(body), token }),
    update: (id: string, body: { title?: string; description?: string }, token: string) =>
      req<CourseDto>(`/courses/${id}`, { method: "PUT", body: JSON.stringify(body), token }),
    enroll: (id: string, token: string) =>
      req<{ success: boolean }>(`/courses/${id}/enroll`, { method: "POST", body: JSON.stringify({}), token }),
    enrollments: (token: string) => req<string[]>("/enrollments", { token }),
  },
  lessons: {
    list: (courseId: string) => req<LessonDto[]>(`/lessons?courseId=${encodeURIComponent(courseId)}`),
    create: (body: LessonCreateDto, token: string) =>
      req<LessonDto>("/lessons", { method: "POST", body: JSON.stringify(body), token }),
    update: (id: string, body: Partial<LessonCreateDto>, token: string) =>
      req<LessonDto>(`/lessons/${id}`, { method: "PUT", body: JSON.stringify(body), token }),
    delete: (id: string, token: string) =>
      req<{ success: boolean }>(`/lessons/${id}`, { method: "DELETE", token }),
  },
  assignments: {
    list: (courseId?: string, token?: string) =>
      req<AssignmentDto[]>(
        courseId ? `/assignments?courseId=${encodeURIComponent(courseId)}` : "/assignments",
        token ? { token } : {},
      ),
    get: (id: string) => req<AssignmentDto>(`/assignments/${id}`),
    create: (body: AssignmentCreateDto, token: string) =>
      req<AssignmentDto>("/assignments", { method: "POST", body: JSON.stringify(body), token }),
    delete: (id: string, token: string) =>
      req<{ success: boolean }>(`/assignments/${id}`, { method: "DELETE", token }),
  },
  submissions: {
    list: (params: { assignmentId?: string; studentId?: string }, token: string) => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v) as [string, string][],
      ).toString();
      return req<SubmissionDto[]>(`/submissions${qs ? `?${qs}` : ""}`, { token });
    },
    create: (body: { assignmentId: string; content?: string; fileUrl?: string }, token: string) =>
      req<SubmissionDto>("/submissions", { method: "POST", body: JSON.stringify(body), token }),
    grade: (id: string, body: { grade: number; feedback?: string; status?: string }, token: string) =>
      req<SubmissionDto>(`/submissions/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  },
  schedule: {
    list: () => req<ScheduleEntryDto[]>("/schedule"),
    create: (body: ScheduleCreateDto, token: string) =>
      req<ScheduleEntryDto>("/schedule", { method: "POST", body: JSON.stringify(body), token }),
    delete: (id: string, token: string) =>
      req<{ success: boolean }>(`/schedule/${id}`, { method: "DELETE", token }),
  },
  parent: {
    link: (studentId: string, token: string) =>
      req<{ id: string }>("/parent/link", { method: "POST", body: JSON.stringify({ studentId }), token }),
    students: (token: string) => req<ProfileDto[]>("/parent/students", { token }),
    grades: (studentId: string, token: string) =>
      req<GradeDto[]>(`/parent/students/${studentId}/grades`, { token }),
    studentCourses: (studentId: string, token: string) =>
      req<CourseDto[]>(`/parent/students/${studentId}/courses`, { token }),
  },
  messages: {
    inbox: (token: string) => req<MessageDto[]>("/messages/inbox", { token }),
    send: (body: { toUserId: string; subject: string; body: string }, token: string) =>
      req<MessageDto>("/messages", { method: "POST", body: JSON.stringify(body), token }),
    markRead: (id: string, token: string) =>
      req<{ success: boolean }>(`/messages/${id}/read`, { method: "PATCH", body: JSON.stringify({}), token }),
  },
  files: {
    upload: async (file: File, token?: string): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append("file", file);
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(BASE + "/files/upload", { method: "POST", headers, body: formData });
      if (!res.ok) throw new Error("Upload failed");
      return res.json() as Promise<{ url: string }>;
    },
  },
};

export interface CourseDto { id: string; title: string; description: string | null; teacherId: string; createdAt: string; }
export interface LessonDto { id: string; courseId: string; title: string; content: string | null; videoUrl: string | null; orderIndex: number; createdBy: string; createdAt: string; }
export interface LessonCreateDto { courseId: string; title: string; content?: string; videoUrl?: string; orderIndex?: number; }
export interface AssignmentDto { id: string; courseId: string; title: string; description: string | null; dueDate: string | null; maxGrade: number; attachmentUrl: string | null; createdBy: string; createdAt: string; }
export interface AssignmentCreateDto { courseId: string; title: string; description?: string; dueDate?: string; maxGrade?: number; }
export interface SubmissionDto { id: string; assignmentId: string; studentId: string; content: string | null; fileUrl: string | null; grade: number | null; feedback: string | null; status: string; gradedBy: string | null; gradedAt: string | null; submittedAt: string; }
export interface ScheduleEntryDto { id: string; title: string; type: "lesson" | "exam" | "event"; courseId: string | null; dayOfWeek: string | null; startTime: string | null; endTime: string | null; specificDate: string | null; location: string | null; notes: string | null; createdBy: string; createdAt: string; }
export interface ScheduleCreateDto { title: string; type?: "lesson" | "exam" | "event"; courseId?: string; dayOfWeek?: string; startTime?: string; endTime?: string; specificDate?: string; location?: string; notes?: string; }
export interface ProfileDto { userId: string; fullName: string | null; avatarUrl: string | null; }
export interface GradeDto { id: string; assignmentId: string; assignmentTitle: string; courseTitle: string; grade: number | null; maxGrade: number; status: string; feedback: string | null; submittedAt: string; }
export interface MessageDto { id: string; fromUserId: string; toUserId: string; subject: string; body: string; isRead?: boolean; createdAt: string; }
