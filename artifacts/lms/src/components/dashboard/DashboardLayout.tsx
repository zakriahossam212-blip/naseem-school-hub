import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, FileText, GraduationCap, LogOut,
  User, Calendar, Users, MessageSquare, ChevronLeft, Menu, X,
  ClipboardList, BookMarked, Globe, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
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
  const [collapsed, setCollapsed] = useState(false);

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
    { label: t.dashboard,     href: "/dashboard",            icon: LayoutDashboard },
    { label: t.courses,       href: "/dashboard/courses",    icon: BookOpen },
    { label: t.assignments,   href: "/dashboard/assignments",icon: FileText },
    { label: t.grades,        href: "/dashboard/grades",     icon: GraduationCap },
    { label: t.schedule,      href: "/dashboard/schedule",   icon: Calendar },
    { label: t.messages,      href: "/messages",             icon: MessageSquare },
  ];
  const teacherNav = [
    { label: t.dashboard,  href: "/dashboard",        icon: LayoutDashboard },
    { label: t.myCourses,  href: "/teacher/courses",  icon: BookMarked },
    { label: t.assignments,href: "/teacher/grades",   icon: ClipboardList },
    { label: t.schedule,   href: "/dashboard/schedule",icon: Calendar },
    { label: t.messages,   href: "/messages",          icon: MessageSquare },
  ];
  const parentNav = [
    { label: t.parentPortal, href: "/parent",             icon: Users },
    { label: t.schedule,     href: "/dashboard/schedule", icon: Calendar },
    { label: t.messages,     href: "/messages",            icon: MessageSquare },
  ];

  const navItems = isTeacher ? teacherNav : isParent ? parentNav : studentNav;
  const roleLabel = isAdmin ? "الإدارة" : isTeacher ? t.teacherPanel : isParent ? t.parentPortal : t.studentDashboard;
  const initials = fullName
    ? fullName.trim().split(" ").slice(0, 2).map((w) => w[0]).join("")
    : "؟";

  const sidebarW = collapsed ? "w-16" : "w-60";

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={cn(
      "flex flex-col h-full bg-card border-border transition-all duration-300",
      mobile ? "w-64 border-l" : cn(sidebarW, "border-l"),
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center border-b border-border transition-all duration-300",
        collapsed && !mobile ? "justify-center p-3" : "p-4 gap-3",
      )}>
        <Link to="/" className="flex-shrink-0">
          <img
            src={logo}
            alt={t.schoolName}
            className="h-8 w-8 object-contain rounded-xl ring-1 ring-primary/20 hover:ring-primary/40 transition-all"
          />
        </Link>
        {(!collapsed || mobile) && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-none truncate">{t.schoolName}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{roleLabel}</p>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            title={collapsed ? "توسيع" : "تصغير"}
          >
            {collapsed
              ? <PanelLeftOpen className="h-3.5 w-3.5" />
              : <PanelLeftClose className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = location.pathname === item.href
            || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed && !mobile ? item.label : undefined}
              className={cn(
                "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group",
                collapsed && !mobile
                  ? "justify-center w-10 h-10 mx-auto"
                  : "gap-3 px-3 py-2.5",
                active
                  ? "bg-primary text-primary-foreground shadow-depth-sm"
                  : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {(!collapsed || mobile) && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronLeft className="h-3.5 w-3.5 opacity-60" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t border-border space-y-1",
        collapsed && !mobile ? "p-2" : "p-2.5",
      )}>
        {/* Lang toggle */}
        <button
          onClick={toggle}
          title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
          className={cn(
            "transition-colors text-muted-foreground hover:bg-accent/70 hover:text-foreground rounded-xl",
            collapsed && !mobile
              ? "w-10 h-10 flex items-center justify-center mx-auto"
              : "w-full flex items-center gap-2.5 px-3 py-2 text-sm",
          )}
        >
          <Globe className="h-4 w-4 flex-shrink-0" />
          {(!collapsed || mobile) && (
            <span>{lang === "ar" ? "English" : "العربية"}</span>
          )}
        </button>

        {/* User */}
        <div className={cn(
          "rounded-xl bg-secondary/40 border border-border/60",
          collapsed && !mobile
            ? "flex items-center justify-center w-10 h-10 mx-auto"
            : "flex items-center gap-2.5 px-3 py-2",
        )}>
          <div
            className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0"
            title={fullName || ""}
          >
            {initials}
          </div>
          {(!collapsed || mobile) && (
            <p className="text-xs font-medium text-foreground truncate flex-1">
              {fullName || userId?.slice(0, 12)}
            </p>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut().then(() => navigate("/"))}
          title={collapsed && !mobile ? t.signOut : undefined}
          className={cn(
            "text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/8 rounded-xl transition-all duration-200",
            collapsed && !mobile
              ? "w-10 h-10 flex items-center justify-center mx-auto"
              : "w-full flex items-center gap-2.5 px-3 py-2",
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {(!collapsed || mobile) && <span>{t.signOut}</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background flex">

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-shrink-0 lg:flex-col lg:fixed lg:inset-y-0 lg:right-0 lg:z-30 transition-all duration-300",
        sidebarW,
      )}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <Sidebar mobile />
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        collapsed ? "lg:mr-16" : "lg:mr-60",
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/96 backdrop-blur-xl border-b border-border shadow-depth-sm">
          <div className="flex items-center justify-between px-4 h-14 gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-accent transition-colors flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1">
              {title && (
                <h1 className="text-base font-semibold text-foreground truncate hidden sm:block">{title}</h1>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Link to="/messages">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-secondary/40 border border-border/60">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {initials}
                </div>
                <span className="text-xs font-medium text-foreground">{fullName?.split(" ")[0] || "..."}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {title && (
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 animate-fade-in">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
