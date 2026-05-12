import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useLang } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api, LessonDto } from "@/lib/apiClient";
import { BookOpen, Plus, Trash2, Edit2, ChevronLeft, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function TeacherLessons() {
  const { id: courseId } = useParams<{ id: string }>();
  const { getToken } = useClerkAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<LessonDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", videoUrl: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!courseId) return;
    setLoading(true);
    api.lessons.list(courseId).then(setLessons).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [courseId]);

  const handleSave = async () => {
    if (!form.title.trim() || !courseId) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await api.lessons.update(editingId, form, token);
        setLessons((prev) => prev.map((l) => l.id === editingId ? updated : l));
      } else {
        const created = await api.lessons.create({ courseId, ...form, orderIndex: lessons.length }, token);
        setLessons((prev) => [...prev, created]);
      }
      setShowForm(false); setEditingId(null); setForm({ title: "", content: "", videoUrl: "" });
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved!" });
    } catch { toast({ title: lang === "ar" ? "خطأ" : "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const token = await getToken().catch(() => null);
    if (!token) return;
    await api.lessons.delete(id, token).catch(() => {});
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const startEdit = (l: LessonDto) => { setEditingId(l.id); setForm({ title: l.title, content: l.content ?? "", videoUrl: l.videoUrl ?? "" }); setShowForm(true); };

  return (
    <DashboardLayout title={t.lessons}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/teacher/courses">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              {lang === "ar" ? "العودة" : "Back"}
            </Button>
          </Link>
          <Button onClick={() => { setEditingId(null); setForm({ title: "", content: "", videoUrl: "" }); setShowForm(true); }} className="gap-2 mr-auto">
            <Plus className="h-4 w-4" />
            {lang === "ar" ? "درس جديد" : "New Lesson"}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in shadow-depth-md">
            <h3 className="font-semibold mb-4">{editingId ? (lang === "ar" ? "تعديل الدرس" : "Edit Lesson") : (lang === "ar" ? "درس جديد" : "New Lesson")}</h3>
            <div className="space-y-3">
              <div>
                <Label>{lang === "ar" ? "عنوان الدرس" : "Lesson Title"} *</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>{lang === "ar" ? "المحتوى" : "Content"}</Label>
                <Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="mt-1" rows={5} />
              </div>
              <div>
                <Label>{lang === "ar" ? "رابط الفيديو" : "Video URL"}</Label>
                <Input value={form.videoUrl} onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))} className="mt-1" placeholder="https://..." />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>{saving ? "..." : t.save}</Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>{t.cancel}</Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : lessons.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === "ar" ? "لا توجد دروس. أضف درسك الأول!" : "No lessons yet. Add your first lesson!"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <div key={lesson.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4 shadow-card animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                  {lesson.content && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{lesson.content}</p>}
                  {lesson.videoUrl && (
                    <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                      <Video className="h-3 w-3" />{lang === "ar" ? "مشاهدة الفيديو" : "Watch Video"}
                    </a>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(lesson)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(lesson.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
