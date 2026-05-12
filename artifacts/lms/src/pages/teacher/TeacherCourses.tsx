import { useState, useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api, CourseDto } from "@/lib/apiClient";
import { Link } from "react-router-dom";
import { BookOpen, Plus, ChevronLeft, Users, FileText, Edit2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function TeacherCourses() {
  const { getToken } = useClerkAuth();
  const { userId } = useAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    api.courses.listByTeacher(userId).then(setCourses).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [userId]);

  const handleSave = async () => {
    if (!title.trim()) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await api.courses.update(editingId, { title, description: desc }, token);
        setCourses((prev) => prev.map((c) => c.id === editingId ? updated : c));
      } else {
        const created = await api.courses.create({ title, description: desc }, token);
        setCourses((prev) => [created, ...prev]);
      }
      setShowForm(false); setEditingId(null); setTitle(""); setDesc("");
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved!" });
    } catch { toast({ title: lang === "ar" ? "خطأ" : "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const startEdit = (c: CourseDto) => { setEditingId(c.id); setTitle(c.title); setDesc(c.description ?? ""); setShowForm(true); };
  const startNew = () => { setEditingId(null); setTitle(""); setDesc(""); setShowForm(true); };

  return (
    <DashboardLayout title={t.teacherPanel}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{t.myCourses}</h2>
          <Button onClick={startNew} className="gap-2">
            <Plus className="h-4 w-4" />
            {lang === "ar" ? "مقرر جديد" : "New Course"}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in shadow-depth-md">
            <h3 className="font-semibold mb-4">
              {editingId ? (lang === "ar" ? "تعديل المقرر" : "Edit Course") : (lang === "ar" ? "مقرر جديد" : "New Course")}
            </h3>
            <div className="space-y-3">
              <div>
                <Label>{lang === "ar" ? "اسم المقرر" : "Course Name"} *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>{lang === "ar" ? "الوصف" : "Description"}</Label>
                <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-1" rows={3} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>{saving ? "..." : t.save}</Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>{t.cancel}</Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : courses.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === "ar" ? "لا توجد مقررات بعد. أضف مقررك الأول!" : "No courses yet. Add your first course!"}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, i) => (
              <div
                key={course.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-card hover-lift animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <button onClick={() => startEdit(course)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground mb-1 leading-snug">{course.title}</h3>
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                )}
                <div className="flex gap-2">
                  <Link to={`/teacher/courses/${course.id}/lessons`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {t.lessons}
                    </Button>
                  </Link>
                  <Link to={`/teacher/courses/${course.id}/assignments`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                      <FileText className="h-3.5 w-3.5" />
                      {t.assignments}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
