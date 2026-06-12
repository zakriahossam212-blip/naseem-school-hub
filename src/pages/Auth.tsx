import { SignIn, SignUp } from "@clerk/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, BookOpen, Users, Award } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const features = [
  { icon: BookOpen, labelAr: "50+ مقرر دراسي", labelEn: "50+ Courses" },
  { icon: Users,    labelAr: "500+ طالب نشط",  labelEn: "500+ Students" },
  { icon: Award,    labelAr: "30+ معلم متميز",  labelEn: "30+ Teachers" },
];

export default function Auth() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const { t, lang, toggle } = useLang();

  return (
    <div className="min-h-screen bg-background flex">

      {/* Left panel — decorative (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex-col justify-between p-10">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt={t.schoolName} className="h-12 w-12 object-contain rounded-2xl ring-2 ring-white/30" />
          <span className="text-2xl font-bold text-white">{t.schoolName}</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-snug">
            {lang === "ar"
              ? "منصة تعليمية متكاملة\nللطلاب والمعلمين"
              : "A complete learning platform\nfor students & teachers"}
          </h2>
          <p className="text-white/80 text-base leading-relaxed">
            {lang === "ar"
              ? "انضم إلى مجتمعنا التعليمي وابدأ رحلتك نحو التميز والنجاح."
              : "Join our educational community and start your journey towards excellence."}
          </p>
          <div className="flex flex-col gap-3 mt-4">
            {features.map((f) => (
              <div key={f.labelAr} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-white/90 font-medium text-sm">
                  {lang === "ar" ? f.labelAr : f.labelEn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-white/50 text-xs">
          {lang === "ar" ? "© 2025 مدرسة نصر الدين" : "© 2025 Nasr Al-Din School"}
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border lg:border-0">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <img src={logo} alt={t.schoolName} className="h-8 w-8 object-contain rounded-xl" />
            <span className="text-sm font-bold text-foreground">{t.schoolName}</span>
          </Link>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="تبديل اللغة"
            >
              <Globe className="h-3.5 w-3.5" />
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm animate-scale-in">
            {/* Heading */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {mode === "sign-in"
                  ? (lang === "ar" ? "تسجيل الدخول" : "Sign In")
                  : (lang === "ar" ? "إنشاء حساب" : "Create Account")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "sign-in"
                  ? (lang === "ar" ? "أهلاً بعودتك إلى مدرستك" : "Welcome back to your school")
                  : (lang === "ar" ? "انضم إلى مجتمعنا التعليمي" : "Join our educational community")}
              </p>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-1 p-1 bg-secondary/60 rounded-xl mb-5 border border-border/60">
              <button
                onClick={() => setMode("sign-in")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === "sign-in"
                    ? "bg-card text-foreground shadow-depth-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.signIn}
              </button>
              <button
                onClick={() => setMode("sign-up")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === "sign-up"
                    ? "bg-card text-foreground shadow-depth-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.signUp}
              </button>
            </div>

            {/* Clerk */}
            <div className="flex justify-center w-full">
              {mode === "sign-in" ? (
                <SignIn
                  fallbackRedirectUrl="/onboarding"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-card border border-border shadow-depth-md rounded-2xl",
                      headerTitle: "text-foreground font-bold",
                      headerSubtitle: "text-muted-foreground",
                      formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors font-medium",
                      formFieldInput: "border-input rounded-xl focus:ring-2 focus:ring-primary/20 bg-background",
                      formFieldLabel: "text-foreground font-medium text-sm",
                      footerActionLink: "text-primary hover:text-primary/80 font-medium",
                      dividerLine: "bg-border",
                      dividerText: "text-muted-foreground text-xs",
                      socialButtonsBlockButton: "border border-border rounded-xl hover:bg-accent transition-colors",
                      alertText: "text-destructive",
                    },
                  }}
                />
              ) : (
                <SignUp
                  fallbackRedirectUrl="/onboarding"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-card border border-border shadow-depth-md rounded-2xl",
                      headerTitle: "text-foreground font-bold",
                      headerSubtitle: "text-muted-foreground",
                      formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors font-medium",
                      formFieldInput: "border-input rounded-xl focus:ring-2 focus:ring-primary/20 bg-background",
                      formFieldLabel: "text-foreground font-medium text-sm",
                      footerActionLink: "text-primary hover:text-primary/80 font-medium",
                      dividerLine: "bg-border",
                      dividerText: "text-muted-foreground text-xs",
                      socialButtonsBlockButton: "border border-border rounded-xl hover:bg-accent transition-colors",
                      alertText: "text-destructive",
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
