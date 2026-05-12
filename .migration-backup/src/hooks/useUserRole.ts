import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "teacher" | "student";

export function useUserRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      setRoles((data ?? []).map((r) => r.role as AppRole));
      setLoading(false);
    })();
  }, [user]);

  const isTeacher = roles.includes("teacher");
  const isStudent = roles.includes("student");
  const isAdmin = roles.includes("admin");
  const primaryRole: AppRole = isAdmin ? "admin" : isTeacher ? "teacher" : "student";

  return { roles, isTeacher, isStudent, isAdmin, primaryRole, loading };
}
