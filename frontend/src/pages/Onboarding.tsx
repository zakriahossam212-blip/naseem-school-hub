import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useLang } from "@/contexts/LanguageContext";
import { api } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ROLE_OPTIONS } from "@/data";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

type Role = "student" | "teacher" | "parent";

export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { t, lang } = useLang();

  const handleContinue = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await api.auth.ensureProfile(token, { role: selectedRole });
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src={logo} alt={t.schoolName} className="h-12 w-12 object-contain rounded-xl" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t.schoolName}</h1>
          <p className="text-muted-foreground mt-2">
            {lang === "ar" ? "اختر دورك في المنصة" : "Choose your role on the platform"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-depth-md p-6 space-y-4">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedRole(option.value as Role)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-right",
                selectedRole === option.value
                  ? "border-primary bg-primary/5 shadow-depth-sm"
                  : "border-border hover:border-primary/40 hover:bg-accent",
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", option.color)}>
                <option.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 text-right">
                <p className="font-semibold text-foreground">
                  {lang === "ar" ? option.labelAr : option.labelEn}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lang === "ar" ? option.descAr : option.descEn}
                </p>
              </div>
              {selectedRole === option.value && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))}

          <Button
            onClick={handleContinue}
            disabled={loading}
            className="w-full gap-2 mt-2"
            size="lg"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {lang === "ar" ? "متابعة" : "Continue"}
                <ArrowLeft className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
