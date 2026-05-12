import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, FileText, GraduationCap, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const { user, loading, signOut } = useAuth();
  const { primaryRole, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { label: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
    { label: "المقررات", href: "/dashboard/courses", icon: BookOpen },
    { label: "الواجبات", href: "/dashboard/assignments", icon: FileText },
    ...(primaryRole === "student"
      ? [{ label: "درجاتي", href: "/dashboard/grades", icon: GraduationCap }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-depth-sm sticky top-0 z-30">
        <div className="container py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="text-base md:text-lg font-bold truncate">
              مدرسة نصر الدين
            </Link>
            <span className="text-muted-foreground hidden sm:inline">/</span>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {primaryRole === "teacher" ? "لوحة المعلم" : primaryRole === "admin" ? "الإدارة" : "لوحة الطالب"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-secondary/50">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.user_metadata?.full_name || user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 ml-1" />
              خروج
            </Button>
          </div>
        </div>
        <nav className="container pb-2 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap border border-transparent transition-colors",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-depth-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="container py-6 md:py-8">
        {title && (
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h1>
        )}
        {children}
      </main>
    </div>
  );
}
