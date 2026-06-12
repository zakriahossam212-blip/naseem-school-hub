import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe, GraduationCap, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, fullName, signOut, isTeacher, isParent } = useAuth();
  const { lang, toggle, t } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setAvatarOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/courses", label: t.courses },
    { href: "/teachers", label: t.teachers },
    { href: "/about", label: t.about },
  ];

  const dashboardHref = isTeacher ? "/teacher/courses" : isParent ? "/parent" : "/dashboard";
  const initials = fullName
    ? fullName.trim().split(" ").slice(0, 2).map((w) => w[0]).join("")
    : "؟";

  const handleSignOut = async () => {
    setAvatarOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-card/96 backdrop-blur-xl border-b border-border shadow-depth-md"
          : "bg-card/80 backdrop-blur-sm border-b border-transparent",
      )}
    >
      <nav className="container">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-primary/25 blur-sm group-hover:blur-md transition-all duration-300" />
              <img
                src={logo}
                alt={t.schoolName}
                width={40} height={40}
                className="relative h-9 w-9 object-contain rounded-xl ring-1 ring-primary/20"
              />
            </div>
            <span className="text-base font-bold text-foreground hidden sm:block tracking-tight">
              {t.schoolName}
            </span>
          </Link>

          {/* Desktop center nav */}
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-1 right-1/2 translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right actions — icon-only */}
          <div className="hidden md:flex items-center gap-1.5">

            {/* Lang toggle — globe icon only */}
            <button
              onClick={toggle}
              title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent/60 hover:border-primary/30 transition-all duration-200"
              aria-label="تبديل اللغة"
            >
              <Globe className="h-4 w-4" />
            </button>

            {userId ? (
              /* Avatar dropdown */
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen((v) => !v)}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold flex items-center justify-center ring-2 ring-transparent hover:ring-primary/40 transition-all duration-200 shadow-depth-sm"
                  aria-label="القائمة الشخصية"
                  title={fullName || ""}
                >
                  {initials}
                </button>
                {avatarOpen && (
                  <div className={cn(
                    "absolute top-11 z-50 w-52 rounded-2xl bg-card border border-border shadow-depth-lg overflow-hidden animate-scale-in",
                    lang === "ar" ? "left-0" : "right-0",
                  )}>
                    <div className="px-4 py-3 border-b border-border bg-secondary/30">
                      <p className="text-xs text-muted-foreground">{lang === "ar" ? "مرحباً" : "Hello"}</p>
                      <p className="text-sm font-semibold text-foreground truncate">{fullName}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        to={dashboardHref}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent/60 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        {t.dashboard}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/8 transition-colors"
                      >
                        <LogOut className="h-4 w-4 flex-shrink-0" />
                        {t.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login icon button */
              <Link to="/auth">
                <button
                  title={lang === "ar" ? "تسجيل الدخول" : "Sign In"}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-depth-sm"
                  aria-label="تسجيل الدخول"
                >
                  <LogIn className="h-4 w-4" />
                </button>
              </Link>
            )}
          </div>

          {/* Mobile row */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggle}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent"
              aria-label="تبديل اللغة"
            >
              <Globe className="h-3.5 w-3.5" />
            </button>
            {userId && (
              <Link to={dashboardHref}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {initials}
                </div>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
              aria-label="القائمة"
            >
              {isOpen
                ? <X className="h-4.5 w-4.5 text-foreground" />
                : <Menu className="h-4.5 w-4.5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-3 animate-fade-in">
            <div className="space-y-0.5 mb-3">
              {navLinks.map((link) => {
                const active = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-border pt-3 px-1 space-y-2">
              {userId ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/40 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-foreground truncate">{fullName}</span>
                  </div>
                  <Link to={dashboardHref} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-accent transition-colors">
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    {t.dashboard}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.signOut}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    {t.signIn}
                  </Link>
                  <Link to="/auth" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    {t.signUp}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
