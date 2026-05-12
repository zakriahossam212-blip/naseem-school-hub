import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/apiClient";

export interface AppUser {
  id: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  roles: string[];
  fullName: string | null;
  signUp: (email: string, password: string, fullName: string, role?: "student" | "teacher") => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("lms_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth.me()
      .then((data) => {
        setUser({ id: data.userId });
        setRoles(data.roles);
        setFullName(data.fullName);
      })
      .catch(() => {
        localStorage.removeItem("lms_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: "student" | "teacher" = "student") => {
    try {
      const data = await api.auth.signUp({ email, password, fullName, role });
      localStorage.setItem("lms_token", data.token);
      setUser({ id: data.userId });
      setRoles(data.roles);
      setFullName(data.fullName);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.auth.signIn({ email, password });
      localStorage.setItem("lms_token", data.token);
      setUser({ id: data.userId });
      setRoles(data.roles);
      setFullName(data.fullName);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await api.auth.signOut().catch(() => {});
    localStorage.removeItem("lms_token");
    setUser(null);
    setRoles([]);
    setFullName(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, roles, fullName, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
