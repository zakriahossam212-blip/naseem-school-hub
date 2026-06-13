import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/react";
import { api } from "@/lib/apiClient";

export type AppRole = "admin" | "teacher" | "student" | "parent";

interface AuthContextType {
  userId: string | null;
  user: { id: string } | null;
  loading: boolean;
  roles: AppRole[];
  fullName: string | null;
  isTeacher: boolean;
  isStudent: boolean;
  isParent: boolean;
  isAdmin: boolean;
  primaryRole: AppRole;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null, user: null, loading: true, roles: [],
  fullName: null, isTeacher: false, isStudent: false, isParent: false, isAdmin: false,
  primaryRole: "student", signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut, getToken } = useClerkAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [fullName, setFullName] = useState<string | null>(null);
  const [rolesLoaded, setRolesLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkUser) {
      setRoles([]);
      setFullName(null);
      setRolesLoaded(true);
      return;
    }
    getToken().then((token) => {
      if (!token) { setRolesLoaded(true); return; }
      return api.auth.me(token).then((data) => {
        setRoles((data.roles ?? []) as AppRole[]);
        setFullName(data.fullName ?? clerkUser.fullName);
      }).catch(() => {});
    }).finally(() => setRolesLoaded(true));
  }, [clerkUser?.id, isLoaded]);

  const userId = clerkUser?.id ?? null;
  const isAdmin = roles.includes("admin");
  const isTeacher = roles.includes("teacher");
  const isStudent = roles.includes("student");
  const isParent = roles.includes("parent");
  const primaryRole: AppRole = isAdmin ? "admin" : isTeacher ? "teacher" : isParent ? "parent" : "student";

  return (
    <AuthContext.Provider value={{
      userId,
      user: userId ? { id: userId } : null,
      loading: !isLoaded || !rolesLoaded,
      roles, fullName: fullName ?? clerkUser?.fullName ?? null,
      isTeacher, isStudent, isParent, isAdmin, primaryRole,
      signOut: async () => { await clerkSignOut(); setRoles([]); setFullName(null); },
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
