import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useLang } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api, AssignmentDto, SubmissionDto } from "@/lib/apiClient";
import { FileText, Plus, Trash2, ChevronLeft, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function TeacherAssignments() {
  const { id: courseId } = useParams<{ id: string }>();
  const { getToken } = useClerkAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, SubmissionDto[]>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", maxGrade: "100" });
  const [saving, setSaving] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<Record<string, string>>({});

  const load = async () => {
    if (!courseId) return;
    setLoading(true);
    const token = await getToken().catch(() => null);
    const list = await api.assignments.list(courseId, token ?? undefined).catch(() => []);
    setAssignments(list);
    setLoading(false);
  };
  useEffect(() => { load(); }, [courseId]);

  const loadSubmissions = async (assignmentId: string) => {
    const token = await getToken().catch(() => null);
    if (!token) return;
    const subs = await api.submissions.list({ assignmentId }, token).catch(() => []);
    setSubmissions((prev) => ({ ...prev, [assignmentId]: subs }));
    setSelectedAssignment(assignmentId);
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !courseId) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    setSaving(true);
    try {
      const created = await api.assignments.create({
        courseId, title: form.title, description: form.description,
        dueDate: form.dueDate || undefined, maxGrade: Number(form.maxGrade) || 100,
      }, token);
      setAssignments((prev) => [...prev, created]);
      setShowForm(false); setForm({ title: "", description: "", dueDate: "", maxGrade: "100" });
      toast({ title: lang === "ar" ? "تمت الإضافة" : "Added!" });
    } catch { toast({ title: lang === "ar" ? "خطأ" : "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const token = await getToken().catch(() => null);
    if (!token) return;
    await api.assignments.delete(id, token).catch(() => {});
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleGrade = async (submissionId: string, grade: string) => {
    const token = await getToken().catch(() => null);
    if (!token) return;
    await api.submissions.grade(submissionId, { grade: Number(grade) }, token).catch(() => {});
    if (selectedAssignment) await loadSubmissions(selectedAssignment);
  };

  return (
    <DashboardLayout title={t.assignments}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/teacher/courses">
            <Button variant="ghost" size="sm" className="gap-1"><ChevronLeft className="h-4 w-4" />{lang === "ar" ? "العودة" : "Back"}</Button>
          </Link>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 mr-auto">
            <Plus className="h-4 w-4" />{lang === "ar" ? "واجب جديد" : "New Assignment"}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in shadow-depth-md space-y-3">
            <h3 className="font-semibold">{lang === "ar" ? "واجب جديد" : "New Assignment"}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label>{lang === "ar" ? "العنوان" : "Title"} *</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label>{lang === "ar" ? "الوصف" : "Description"}</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1" rows={3} />
              </div>
              <div>
                <Label>{lang === "ar" ? "تاريخ التسليم" : "Due Date"}</Label>
                <Input type="datetime-local" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>{lang === "ar" ? "الدرجة الكاملة" : "Max Grade"}</Label>
                <Input type="number" value={form.maxGrade} onChange={(e) => setForm((f) => ({ ...f, maxGrade: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving}>{saving ? "..." : t.save}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{t.cancel}</Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : assignments.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === "ar" ? "لا توجد واجبات" : "No assignments yet"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((a, i) => (
              <div key={a.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    {a.description && <p className="text-sm text-muted-foreground mt-0.5">{a.description}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      {a.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(a.dueDate).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{lang === "ar" ? `الدرجة الكاملة: ${a.maxGrade}` : `Max: ${a.maxGrade}`}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => selectedAssignment === a.id ? setSelectedAssignment(null) : loadSubmissions(a.id)} className="text-xs">
                      {lang === "ar" ? "الإجابات" : "Submissions"}
                    </Button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {selectedAssignment === a.id && (
                  <div className="border-t border-border bg-secondary/20 p-4 space-y-3 animate-fade-in">
                    <p className="text-sm font-medium">{lang === "ar" ? "إجابات الطلاب" : "Student Submissions"}</p>
                    {(submissions[a.id] ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t.noData}</p>
                    ) : (submissions[a.id] ?? []).map((sub) => (
                      <div key={sub.id} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">{sub.studentId.slice(0, 16)}...</p>
                          {sub.content && <p className="text-sm mt-1">{sub.content}</p>}
                          <p className="text-xs text-muted-foreground mt-1">{sub.status} {sub.grade != null ? `| ${sub.grade}/${a.maxGrade}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number" placeholder={lang === "ar" ? "الدرجة" : "Grade"} className="w-20 h-8 text-xs"
                            value={gradeInput[sub.id] ?? (sub.grade?.toString() ?? "")}
                            onChange={(e) => setGradeInput((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                          />
                          <Button size="sm" className="h-8 text-xs gap-1" onClick={() => handleGrade(sub.id, gradeInput[sub.id] ?? "")}>
                            <CheckCircle className="h-3 w-3" />{lang === "ar" ? "منح" : "Grade"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
