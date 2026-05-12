import { SignIn, SignUp } from "@clerk/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

export default function Auth() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const { t, lang } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-sm group-hover:blur-md transition-all" />
            <img src={logo} alt={t.schoolName} className="relative h-12 w-12 object-contain rounded-xl" />
          </div>
          <span className="text-xl font-bold text-foreground">{t.schoolName}</span>
        </Link>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl mb-6 border border-border">
          <button
            onClick={() => setMode("sign-in")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "sign-in" ? "bg-card text-foreground shadow-depth-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.signIn}
          </button>
          <button
            onClick={() => setMode("sign-up")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "sign-up" ? "bg-card text-foreground shadow-depth-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.signUp}
          </button>
        </div>

        {/* Clerk Components */}
        <div className="flex justify-center">
          {mode === "sign-in" ? (
            <SignIn
              routing="hash"
              afterSignInUrl="/onboarding"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-card border border-border shadow-depth-md rounded-2xl",
                  headerTitle: "text-foreground font-bold",
                  headerSubtitle: "text-muted-foreground",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors",
                  formFieldInput: "border-input rounded-lg focus:ring-2 focus:ring-primary/20",
                  footerActionLink: "text-primary hover:text-primary/80",
                  dividerLine: "bg-border",
                  dividerText: "text-muted-foreground",
                  socialButtonsBlockButton: "border border-border rounded-lg hover:bg-accent transition-colors",
                  alertText: "text-destructive",
                },
              }}
            />
          ) : (
            <SignUp
              routing="hash"
              afterSignUpUrl="/onboarding"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-card border border-border shadow-depth-md rounded-2xl",
                  headerTitle: "text-foreground font-bold",
                  headerSubtitle: "text-muted-foreground",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors",
                  formFieldInput: "border-input rounded-lg focus:ring-2 focus:ring-primary/20",
                  footerActionLink: "text-primary hover:text-primary/80",
                  dividerLine: "bg-border",
                  dividerText: "text-muted-foreground",
                  socialButtonsBlockButton: "border border-border rounded-lg hover:bg-accent transition-colors",
                },
              }}
            />
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowRight className="h-4 w-4" />
            {lang === "ar" ? "العودة للصفحة الرئيسية" : "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
