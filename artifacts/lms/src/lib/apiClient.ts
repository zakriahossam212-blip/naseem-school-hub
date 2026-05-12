const BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("lms_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.error || res.statusText), { status: res.status });
  }
  return res.json();
}

export const api = {
  auth: {
    me: () => request<{ userId: string; fullName: string | null; roles: string[] }>("/auth/me"),
    signUp: (data: { email: string; password: string; fullName: string; role?: string }) =>
      request<{ userId: string; fullName: string | null; roles: string[]; token: string }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    signIn: (data: { email: string; password: string }) =>
      request<{ userId: string; token: string; fullName: string | null; roles: string[] }>("/auth/signin", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    signOut: () => request("/auth/signout", { method: "POST" }),
  },
  profiles: {
    get: (userId: string) =>
      request<{ userId: string; fullName: string | null; avatarUrl: string | null }>(`/profiles/${userId}`),
    list: (userIds: string[]) =>
      request<Array<{ userId: string; fullName: string | null; avatarUrl: string | null }>>(`/profiles?userIds=${userIds.join(",")}`),
  },
  courses: {
    list: (params?: { teacherId?: string }) => {
      const q = params?.teacherId ? `?teacherId=${params.teacherId}` : "";
      return request<Array<{ id: string; title: string; description: string | null; teacherId: string; createdAt: string }>>(`/courses${q}`);
    },
    get: (id: string) =>
      request<{ id: string; title: string; description: string | null; teacherId: string; createdAt: string }>(`/courses/${id}`),
    create: (data: { title: string; description?: string; teacherId: string }) =>
      request<{ id: string; title: string; description: string | null; teacherId: string; createdAt: string }>("/courses", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    enroll: (courseId: string, studentId: string) =>
      request(`/courses/${courseId}/enroll`, {
        method: "POST",
        body: JSON.stringify({ studentId }),
      }),
    listEnrollments: (studentId: string) =>
      request<string[]>(`/enrollments?studentId=${studentId}`),
  },
  assignments: {
    list: (params?: { courseId?: string }) => {
      const q = params?.courseId ? `?courseId=${params.courseId}` : "";
      return request<Array<{
        id: string; courseId: string; title: string; description: string | null;
        dueDate: string | null; maxGrade: number; attachmentUrl: string | null;
        createdBy: string; createdAt: string;
      }>>(`/assignments${q}`);
    },
    get: (id: string) =>
      request<{
        id: string; courseId: string; title: string; description: string | null;
        dueDate: string | null; maxGrade: number; attachmentUrl: string | null;
        createdBy: string; createdAt: string;
      }>(`/assignments/${id}`),
    create: (data: {
      courseId: string; title: string; description?: string;
      dueDate?: string; maxGrade?: number; attachmentUrl?: string; createdBy: string;
    }) =>
      request<{ id: string; courseId: string; title: string; description: string | null; dueDate: string | null; maxGrade: number; attachmentUrl: string | null; createdBy: string; createdAt: string }>("/assignments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  submissions: {
    list: (params?: { assignmentId?: string; studentId?: string }) => {
      const q = new URLSearchParams();
      if (params?.assignmentId) q.set("assignmentId", params.assignmentId);
      if (params?.studentId) q.set("studentId", params.studentId);
      const qs = q.toString() ? `?${q}` : "";
      return request<Array<{
        id: string; assignmentId: string; studentId: string; content: string | null;
        fileUrl: string | null; grade: number | null; feedback: string | null;
        status: string; gradedBy: string | null; gradedAt: string | null; submittedAt: string;
      }>>(`/submissions${qs}`);
    },
    create: (data: { assignmentId: string; studentId: string; content?: string; fileUrl?: string; status?: string }) =>
      request<{
        id: string; assignmentId: string; studentId: string; content: string | null;
        fileUrl: string | null; grade: number | null; feedback: string | null;
        status: string; gradedBy: string | null; gradedAt: string | null; submittedAt: string;
      }>("/submissions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: { content?: string; fileUrl?: string; grade?: number; feedback?: string; status?: string; gradedBy?: string }) =>
      request<{
        id: string; assignmentId: string; studentId: string; content: string | null;
        fileUrl: string | null; grade: number | null; feedback: string | null;
        status: string; gradedBy: string | null; gradedAt: string | null; submittedAt: string;
      }>(`/submissions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  files: {
    upload: async (file: File): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${BASE}/files/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    getUrl: (path: string) => `${BASE}${path}`,
  },
};

export { getToken };
