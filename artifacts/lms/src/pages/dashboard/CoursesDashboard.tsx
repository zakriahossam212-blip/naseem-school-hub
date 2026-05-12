import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, ChevronLeft, UserPlus, Check } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api, CourseDto } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CoursesDashboard() {
  const { userId, isTeacher, isStudent } = useAuth();
  const { getToken } = useClerkAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const token = await getToken().catch(() => null);
    const data = isTeacher && userId
      ? await api.courses.listByTeacher(userId, token ?? undefined).catch(() => [])
      : await api.courses.list(token ?? undefined).catch(() => []);
    setCourses(data);
    if (token) {
      const ids = await api.courses.enrollments(token).catch(() => []);
      setEnrolled(new Set(ids));
    }
    setLoading(false);
  };

  useEffect(() => { if (userId) load(); }, [userId, isTeacher]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    setSaving(true);
    try {
      await api.courses.create({ title: title.trim(), description: description.trim() || undefined }, token);
      toast({ title: lang === "ar" ? "تم إنشاء المقرر" : "Course created!" });
      setTitle(""); setDescription(""); setShowForm(false);
      load();
    } catch (err: unknown) {
      toast({ title: lang === "ar" ? "خطأ" : "Error", description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const enroll = async (courseId: string) => {
    const token = await getToken().catch(() => null);
    if (!token) return;
    try {
      await api.courses.enroll(courseId, token);
      toast({ title: lang === "ar" ? "تم التسجيل" : "Enrolled!" });
      load();
    } catch (err: unknown) {
      toast({ title: lang === "ar" ? "تعذر التسجيل" : "Enrollment failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title={t.courses}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {isTeacher ? (lang === "ar" ? "مقرراتك التي تدرّسها" : "Your teaching courses") : (lang === "ar" ? "المقررات المتاحة" : "Available courses")}
          </p>
          {isTeacher && (
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              {lang === "ar" ? "مقرر جديد" : "New Course"}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-5 animate-scale-in shadow-depth-md space-y-3">
            <h3 className="font-semibold">{lang === "ar" ? "مقرر جديد" : "New Course"}</h3>
            <div>
              <Label>{lang === "ar" ? "العنوان" : "Title"} *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" maxLength={200} />
            </div>
            <div>
              <Label>{lang === "ar" ? "الوصف" : "Description"}</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" maxLength={1000} rows={3} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving || !title.trim()}>{saving ? "..." : t.save}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{t.cancel}</Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : courses.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">{t.noData}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c, i) => {
              const isEnrolled = enrolled.has(c.id);
              return (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-5 shadow-card hover-lift animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{c.description || (lang === "ar" ? "بدون وصف" : "No description")}</p>
                  <div className="flex items-center gap-2">
                    <Link to={`/dashboard/courses/${c.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        {lang === "ar" ? "التفاصيل" : "Details"}
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    {isStudent && !isEnrolled && (
                      <Button size="sm" onClick={() => enroll(c.id)} className="gap-1">
                        <UserPlus className="h-3.5 w-3.5" />
                        {lang === "ar" ? "تسجيل" : "Enroll"}
                      </Button>
                    )}
                    {isStudent && isEnrolled && (
                      <Button size="sm" variant="secondary" disabled className="gap-1">
                        <Check className="h-3.5 w-3.5" />
                        {lang === "ar" ? "مسجّل" : "Enrolled"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
