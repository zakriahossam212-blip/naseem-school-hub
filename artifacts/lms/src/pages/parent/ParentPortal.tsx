import { useState, useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useLang } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api, ProfileDto } from "@/lib/apiClient";
import { Link } from "react-router-dom";
import { Users, Plus, ChevronLeft, BookOpen, GraduationCap, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ParentPortal() {
  const { getToken } = useClerkAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [students, setStudents] = useState<ProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLink, setShowLink] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [linking, setLinking] = useState(false);

  const load = async () => {
    const token = await getToken().catch(() => null);
    if (!token) { setLoading(false); return; }
    setLoading(true);
    api.parent.students(token).then(setStudents).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleLink = async () => {
    if (!studentId.trim()) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    setLinking(true);
    try {
      await api.parent.link(studentId.trim(), token);
      await load();
      setShowLink(false); setStudentId("");
      toast({ title: lang === "ar" ? "تم الربط بنجاح" : "Student linked!" });
    } catch (err: unknown) {
      toast({ title: lang === "ar" ? "خطأ في الربط" : "Link failed", description: (err as Error).message, variant: "destructive" });
    } finally { setLinking(false); }
  };

  return (
    <DashboardLayout title={t.parentPortal}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-l from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Users className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{t.parentPortal}</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              {lang === "ar" ? "تابع أداء أبنائك الدراسي والتواصل مع المعلمين" : "Track your children's academic performance and communicate with teachers"}
            </p>
          </div>
          <Button onClick={() => setShowLink(!showLink)} className="mr-auto gap-2 flex-shrink-0" variant="outline">
            <Plus className="h-4 w-4" />
            {lang === "ar" ? "إضافة طالب" : "Add Student"}
          </Button>
        </div>

        {/* Link form */}
        {showLink && (
          <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in shadow-depth-md space-y-3">
            <h3 className="font-semibold">{lang === "ar" ? "ربط حساب طالب" : "Link Student Account"}</h3>
            <p className="text-sm text-muted-foreground">
              {lang === "ar" ? "أدخل معرّف المستخدم الخاص بالطالب (يجدها في إعدادات حسابه)" : "Enter the student's user ID (found in their account settings)"}
            </p>
            <div>
              <Label>{lang === "ar" ? "معرّف الطالب" : "Student ID"}</Label>
              <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="user_..." className="mt-1 font-mono text-sm" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLink} disabled={linking}>{linking ? "..." : lang === "ar" ? "ربط" : "Link"}</Button>
              <Button variant="outline" onClick={() => setShowLink(false)}>{t.cancel}</Button>
            </div>
          </div>
        )}

        {/* Students list */}
        {loading ? (
          <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">{lang === "ar" ? "لا يوجد طلاب مرتبطون بحسابك بعد" : "No students linked to your account yet"}</p>
            <Button onClick={() => setShowLink(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              {lang === "ar" ? "إضافة طالب" : "Add Student"}
            </Button>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              {t.myStudents} ({students.length})
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((s, i) => (
                <Link
                  key={s.userId}
                  to={`/parent/students/${s.userId}`}
                  className="bg-card border border-border rounded-2xl p-5 shadow-card hover-lift animate-fade-in group"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                      {(s.fullName ?? "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{s.fullName ?? (lang === "ar" ? "طالب" : "Student")}</p>
                      <p className="text-xs text-muted-foreground font-mono">{s.userId.slice(0, 16)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      {lang === "ar" ? "عرض التفاصيل" : "View Details"}
                    </span>
                    <ChevronLeft className="h-4 w-4 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
