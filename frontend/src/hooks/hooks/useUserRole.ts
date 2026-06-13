import { useAuth } from "@/contexts/AuthContext";
export type AppRole = "admin" | "teacher" | "student" | "parent";
export function useUserRole() {
  const auth = useAuth();
  return {
    roles: auth.roles as AppRole[],
    isTeacher: auth.isTeacher,
    isStudent: auth.isStudent,
    isParent: auth.isParent,
    isAdmin: auth.isAdmin,
    primaryRole: auth.primaryRole as AppRole,
    loading: auth.loading,
  };
}
