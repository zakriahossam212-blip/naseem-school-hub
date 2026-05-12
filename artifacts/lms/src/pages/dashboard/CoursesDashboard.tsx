import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, ChevronLeft, UserPlus, Check, Clock, Users } from "lucide-react";
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

const COURSE_PALETTES = [
  { from: "from-blue-500", to: "to-blue-700", light: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", icon: "🔢" },
  { from: "from-emerald-500", to: "to-emerald-700", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", icon: "📖" },
  { from: "from-purple-500", to: "to-purple-700", light: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", icon: "🔬" },
  { from: "from-orange-500", to: "to-orange-700", light: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", icon: "🗣" },
  { from: "from-amber-500", to: "to-amber-700", light: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", icon: "🏛" },
  { from: "from-teal-500", to: "to-teal-700", light: "bg-teal-50", border: "border-teal-200", text: "text-teal-600", icon: "🌍" },
];

const getPalette = (title: string, index: number) => {
  if (title.includes("رياض") || title.toLowerCase().includes("math")) return COURSE_PALETTES[0];
  if (title.includes("عربية") || title.toLowerCase().includes("arabic")) return COURSE_PALETTES[1];
  if (title.includes("علوم") || title.toLowerCase().includes("science")) return COURSE_PALETTES[2];
  if (title.includes("إنجليزية") || title.toLowerCase().includes("english")) return COURSE_PALETTES[3];
  if (title.includes("تاريخ") || title.toLowerCase().includes("history")) return COURSE_PALETTES[4];
  if (title.includes("جغرافيا") || title.toLowerCase().includes("geography")) return COURSE_PALETTES[5];
  return COURSE_PALETTES[index % COURSE_PALETTES.length];
};

const FAKE_DURATIONS = ["12 أسبوع", "16 أسبوع", "14 أسبوع", "20 أسبوع", "10 أسبوع", "8 أسبوع"];
const FAKE_STUDENTS = [120, 150, 95, 180, 75, 60];

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
      toast({ title: lang === "ar" ? "✅ تم التسجيل" : "Enrolled!" });
      setEnrolled((prev) => new Set([...prev, courseId]));
    } catch (err: unknown) {
      toast({ title: lang === "ar" ? "تعذر التسجيل" : "Enrollment failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title={t.courses}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {isTeacher
              ? (lang === "ar" ? "مقرراتك التي تدرّسها" : "Your teaching courses")
              : (lang === "ar" ? "المقررات المتاحة" : "Available courses")}
          </p>
          {isTeacher && (
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              {lang === "ar" ? "مقرر جديد" : "New Course"}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-5 animate-scale-in shadow-md space-y-4">
            <h3 className="font-semibold text-foreground">{lang === "ar" ? "مقرر جديد" : "New Course"}</h3>
            <div>
              <Label>{lang === "ar" ? "عنوان المقرر" : "Course Title"} *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5 rounded-xl" maxLength={200} />
            </div>
            <div>
              <Label>{lang === "ar" ? "الوصف" : "Description"}</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 rounded-xl" maxLength={1000} rows={3} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving || !title.trim()} className="rounded-xl">
                {saving ? "..." : t.save}
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>{t.cancel}</Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-28 bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-8 bg-muted rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-medium">{t.noData}</p>
            {isTeacher && (
              <Button className="mt-4 gap-2 rounded-xl" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" />
                {lang === "ar" ? "أنشئ مقررك الأول" : "Create Your First Course"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c, i) => {
              const isEnrolled = enrolled.has(c.id);
              const palette = getPalette(c.title, i);
              const duration = FAKE_DURATIONS[i % FAKE_DURATIONS.length];
              const students = FAKE_STUDENTS[i % FAKE_STUDENTS.length];
              return (
                <div
                  key={c.id}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-in flex flex-col"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Gradient top band */}
                  <div className={`relative h-24 bg-gradient-to-br ${palette.from} ${palette.to} flex items-center px-5 gap-4 overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                    <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                      {palette.icon}
                    </div>
                    <div className="relative flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base leading-tight truncate">{c.title}</h3>
                      <p className="text-white/70 text-xs mt-0.5">{lang === "ar" ? "مقرر دراسي" : "Course"}</p>
                    </div>
                    {isEnrolled && (
                      <div className="relative flex-shrink-0 w-7 h-7 rounded-full bg-green-400 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
                      {c.description || (lang === "ar" ? "مقرر دراسي متكامل يشمل أهم المحاور التعليمية." : "A comprehensive course covering key learning topics.")}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/dashboard/courses/${c.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1 rounded-xl">
                          {lang === "ar" ? "التفاصيل" : "Details"}
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      {isStudent && !isEnrolled && (
                        <Button size="sm" onClick={() => enroll(c.id)} className="gap-1 rounded-xl">
                          <UserPlus className="h-3.5 w-3.5" />
                          {lang === "ar" ? "تسجيل" : "Enroll"}
                        </Button>
                      )}
                      {isStudent && isEnrolled && (
                        <Button size="sm" variant="secondary" disabled className="gap-1 rounded-xl text-green-700 bg-green-50 border border-green-200">
                          <Check className="h-3.5 w-3.5" />
                          {lang === "ar" ? "مسجّل" : "Enrolled"}
                        </Button>
                      )}
                    </div>
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
