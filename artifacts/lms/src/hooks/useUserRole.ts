import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "teacher" | "student";

export function useUserRole() {
  const { user, roles, loading } = useAuth();

  const typedRoles = roles as AppRole[];
  const isTeacher = typedRoles.includes("teacher");
  const isStudent = typedRoles.includes("student");
  const isAdmin = typedRoles.includes("admin");
  const primaryRole: AppRole = isAdmin ? "admin" : isTeacher ? "teacher" : "student";

  return { roles: typedRoles, isTeacher, isStudent, isAdmin, primaryRole, loading: loading && !user };
}
