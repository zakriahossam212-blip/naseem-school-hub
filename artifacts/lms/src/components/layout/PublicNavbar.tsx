import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Globe, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, fullName, signOut, isTeacher, isParent } = useAuth();
  const { lang, toggle, t } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/courses", label: t.courses },
    { href: "/teachers", label: t.teachers },
    { href: "/about", label: t.about },
  ];

  const dashboardHref = isTeacher ? "/teacher/courses" : isParent ? "/parent" : "/dashboard";

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-card/95 backdrop-blur-md border-b border-border shadow-depth-md"
          : "bg-card border-b border-transparent",
      )}
    >
      <nav className="container">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm group-hover:blur-md transition-all" />
              <img
                src={logo}
                alt={t.schoolName}
                width={40} height={40}
                className="relative h-9 w-9 object-contain rounded-lg"
              />
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:block">
              {t.schoolName}
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      "relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      active
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0.5 right-1/2 translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="تبديل اللغة"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "ar" ? "EN" : "ع"}
            </button>

            {userId ? (
              <>
                <Link to={dashboardHref}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {fullName?.split(" ")[0] || t.dashboard}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5 text-muted-foreground">
                  <LogOut className="h-3.5 w-3.5" />
                  {t.signOut}
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">{t.signIn}</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {t.signUp}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile row */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-accent"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="القائمة"
            >
              {isOpen
                ? <X className="h-5 w-5 text-foreground" />
                : <Menu className="h-5 w-5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in space-y-1">
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
            <div className="pt-3 border-t border-border mt-3 space-y-2 px-1">
              {userId ? (
                <>
                  <Link to={dashboardHref}>
                    <Button variant="outline" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      {t.dashboard}
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    {t.signOut}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth"><Button variant="outline" className="w-full">{t.signIn}</Button></Link>
                  <Link to="/auth"><Button className="w-full">{t.signUp}</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
