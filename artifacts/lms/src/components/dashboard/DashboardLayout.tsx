import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, FileText, GraduationCap, LogOut,
  User, Calendar, Users, MessageSquare, ChevronLeft, Menu, X,
  ClipboardList, BookMarked,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

interface Props { children: ReactNode; title?: string; }

export default function DashboardLayout({ children, title }: Props) {
  const { userId, fullName, loading, signOut, isTeacher, isParent, isAdmin } = useAuth();
  const { t, lang, toggle } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !userId) navigate("/auth");
  }, [userId, loading, navigate]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }
  if (!userId) return null;

  const studentNav = [
    { label: t.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { label: t.courses, href: "/dashboard/courses", icon: BookOpen },
    { label: t.assignments, href: "/dashboard/assignments", icon: FileText },
    { label: t.grades, href: "/dashboard/grades", icon: GraduationCap },
    { label: t.schedule, href: "/dashboard/schedule", icon: Calendar },
    { label: t.messages, href: "/messages", icon: MessageSquare },
  ];
  const teacherNav = [
    { label: t.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { label: t.myCourses, href: "/teacher/courses", icon: BookMarked },
    { label: t.assignments, href: "/teacher/grades", icon: ClipboardList },
    { label: t.schedule, href: "/dashboard/schedule", icon: Calendar },
    { label: t.messages, href: "/messages", icon: MessageSquare },
  ];
  const parentNav = [
    { label: t.parentPortal, href: "/parent", icon: Users },
    { label: t.schedule, href: "/dashboard/schedule", icon: Calendar },
    { label: t.messages, href: "/messages", icon: MessageSquare },
  ];

  const navItems = isTeacher ? teacherNav : isParent ? parentNav : studentNav;
  const roleLabel = isAdmin ? "الإدارة" : isTeacher ? t.teacherPanel : isParent ? t.parentPortal : t.studentDashboard;

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-card border-l border-border">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt={t.schoolName} className="h-8 w-8 object-contain rounded-lg" />
          <div>
            <p className="text-sm font-bold leading-none text-foreground">{t.schoolName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{roleLabel}</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground shadow-depth-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
              {active && <ChevronLeft className="h-3.5 w-3.5 mr-auto opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-2">
        <button
          onClick={toggle}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <span className="text-base">{lang === "ar" ? "🇸🇦" : "🇬🇧"}</span>
          <span>{lang === "ar" ? "English" : "العربية"}</span>
        </button>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/50">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-xs font-medium text-foreground truncate flex-1">
            {fullName || userId?.slice(0, 12)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut().then(() => navigate("/"))}
          className="w-full gap-2 text-muted-foreground hover:text-foreground justify-start"
        >
          <LogOut className="h-4 w-4" />
          {t.signOut}
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-60 lg:flex-shrink-0 lg:flex-col lg:fixed lg:inset-y-0 lg:right-0 lg:z-30">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-64 transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 lg:mr-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-depth-sm">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {title && <h1 className="text-base font-semibold text-foreground hidden sm:block">{title}</h1>}
            </div>
            <div className="flex items-center gap-2">
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{fullName?.split(" ")[0] || "..."}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {title && (
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 animate-fade-in">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
