import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, FileText, ChevronLeft, Calendar, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api, CourseDto, AssignmentDto } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useLang } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { userId, isTeacher } = useAuth();
  const { getToken } = useClerkAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseDto | null>(null);
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", maxGrade: "100" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    const c = await api.courses.get(id).catch(() => null);
    setCourse(c);
    const a = await api.assignments.list(id).catch(() => []);
    setAssignments(a);
  };

  useEffect(() => { load(); }, [id]);

  const isCourseTeacher = isTeacher && course?.teacherId === userId;

  const create = async () => {
    if (!id || !form.title.trim()) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    setSaving(true);
    try {
      await api.assignments.create({
        courseId: id, title: form.title.trim(),
        description: form.description.trim() || undefined,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        maxGrade: Number(form.maxGrade) || 100,
      }, token);
      toast({ title: lang === "ar" ? "تم إنشاء الواجب" : "Assignment created!" });
      setForm({ title: "", description: "", dueDate: "", maxGrade: "100" });
      setShowForm(false);
      load();
    } catch (err: unknown) {
      toast({ title: lang === "ar" ? "خطأ" : "Error", description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (!course) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Back */}
        <Link to="/dashboard/courses" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          {lang === "ar" ? "العودة للمقررات" : "Back to Courses"}
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-l from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{course.title}</h1>
            {course.description && <p className="text-muted-foreground">{course.description}</p>}
          </div>
        </div>

        {/* Assignments section */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">{t.assignments}</h2>
          {isCourseTeacher && (
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              {lang === "ar" ? "واجب جديد" : "New Assignment"}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in shadow-depth-md space-y-3">
            <h3 className="font-semibold">{lang === "ar" ? "واجب جديد" : "New Assignment"}</h3>
            <div>
              <Label>{lang === "ar" ? "العنوان" : "Title"} *</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1" maxLength={200} />
            </div>
            <div>
              <Label>{lang === "ar" ? "الوصف" : "Description"}</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1" maxLength={2000} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "تاريخ التسليم" : "Due Date"}</Label>
                <Input type="datetime-local" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>{lang === "ar" ? "الدرجة الكاملة" : "Max Grade"}</Label>
                <Input type="number" min="1" value={form.maxGrade} onChange={(e) => setForm((f) => ({ ...f, maxGrade: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={create} disabled={saving || !form.title.trim()}>{saving ? "..." : t.save}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{t.cancel}</Button>
            </div>
          </div>
        )}

        {assignments.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === "ar" ? "لا توجد واجبات بعد" : "No assignments yet"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((a, i) => (
              <div key={a.id} className="bg-card border border-border rounded-2xl p-4 shadow-card hover-lift animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    {a.description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{a.description}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {a.dueDate && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      <Calendar className="h-3 w-3" />
                      {new Date(a.dueDate).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {lang === "ar" ? `الدرجة: ${a.maxGrade}` : `Grade: ${a.maxGrade}`}
                  </span>
                </div>
                <Link to={`/dashboard/assignments/${a.id}`}>
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    {lang === "ar" ? "عرض الواجب" : "View Assignment"}
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
