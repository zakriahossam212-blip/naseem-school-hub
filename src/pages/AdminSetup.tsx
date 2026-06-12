import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { useAuth as useClerkAuth } from "@clerk/react";
import { SignIn } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api";

export default function AdminSetup() {
  const { userId } = useAuth();
  const { getToken, isSignedIn } = useClerkAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const token = await getToken();
      const res = await fetch(`${BASE}/auth/make-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ secret }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Unknown error");
        setResult("error");
      } else {
        setResult("success");
        setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
      }
    } catch {
      setError(lang === "ar" ? "خطأ في الاتصال بالخادم" : "Connection error");
      setResult("error");
    }
    setLoading(false);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">
              {lang === "ar" ? "إعداد حساب الإدارة" : "Admin Setup"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {lang === "ar" ? "سجّل الدخول أولاً لترقية حسابك إلى مدير" : "Sign in first to upgrade to admin"}
            </p>
          </div>
          <SignIn fallbackRedirectUrl="/admin-setup" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {lang === "ar" ? "ترقية إلى مدير" : "Upgrade to Admin"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {lang === "ar"
                ? "أدخل المفتاح السري لمنح صلاحيات الإدارة لحسابك"
                : "Enter the secret key to grant admin privileges to your account"}
            </p>
            {userId && (
              <div className="mt-3 px-3 py-1.5 bg-muted rounded-lg text-xs text-muted-foreground font-mono break-all">
                {userId}
              </div>
            )}
          </div>

          {result === "success" ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">
                {lang === "ar" ? "تمت الترقية بنجاح!" : "Admin access granted!"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {lang === "ar" ? "جاري التحويل إلى لوحة التحكم..." : "Redirecting to dashboard..."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                  <Lock className="h-3.5 w-3.5" />
                  {lang === "ar" ? "المفتاح السري" : "Admin Secret Key"}
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••••••••••••••"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              {result === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error === "Invalid secret" ? (lang === "ar" ? "المفتاح غير صحيح" : "Invalid secret key") : error}</span>
                </div>
              )}

              <Button type="submit" className="w-full h-11 rounded-xl gap-2" disabled={loading || !secret.trim()}>
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Shield className="h-4 w-4" />}
                {lang === "ar" ? "ترقية الحساب" : "Upgrade Account"}
              </Button>

              <Button type="button" variant="ghost" className="w-full rounded-xl" onClick={() => navigate("/")}>
                {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {lang === "ar"
                ? "المفتاح الافتراضي: nasreldin-admin-2025 — غيّره من متغيرات البيئة ADMIN_SECRET"
                : "Default key: nasreldin-admin-2025 — change via ADMIN_SECRET env var"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
