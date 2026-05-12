import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Download, Upload, Save, CheckCircle, Clock } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api, AssignmentDto, CourseDto, SubmissionDto } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useLang } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SubmissionRow extends SubmissionDto { studentName?: string | null; }

export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { userId, isTeacher, isStudent } = useAuth();
  const { getToken } = useClerkAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<AssignmentDto | null>(null);
  const [course, setCourse] = useState<CourseDto | null>(null);
  const [mySubmission, setMySubmission] = useState<SubmissionDto | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const isCourseTeacher = isTeacher && course?.teacherId === userId;

  const load = async () => {
    if (!id || !userId) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    const a = await api.assignments.get(id).catch(() => null);
    if (!a) return;
    setAssignment(a);
    const c = await api.courses.get(a.courseId).catch(() => null);
    if (c) setCourse(c);

    if (isStudent) {
      const subs = await api.submissions.list({ assignmentId: id }, token).catch(() => []);
      const s = subs[0] ?? null;
      setMySubmission(s);
      if (s) setContent(s.content || "");
    }
    if (isTeacher) {
      const subs = await api.submissions.list({ assignmentId: id }, token).catch(() => []);
      const ids = Array.from(new Set(subs.map((r) => r.studentId)));
      const names: Record<string, string> = {};
      if (ids.length) {
        const profs = await api.profiles.list(ids).catch(() => []);
        profs.forEach((p) => { names[p.userId] = p.fullName || (lang === "ar" ? "طالب" : "Student"); });
      }
      setSubmissions(subs.map((r) => ({ ...r, studentName: names[r.studentId] })));
    }
  };

  useEffect(() => { load(); }, [id, userId, isTeacher, isStudent]);

  const submit = async () => {
    if (!userId || !id) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    setSaving(true);
    let fileUrl = mySubmission?.fileUrl ?? null;
    if (file) {
      try {
        const result = await api.files.upload(file, token);
        fileUrl = result.url;
      } catch {
        setSaving(false);
        toast({ title: lang === "ar" ? "تعذر رفع الملف" : "Upload failed", variant: "destructive" });
        return;
      }
    }
    try {
      if (mySubmission) {
        await api.submissions.grade(mySubmission.id, { grade: mySubmission.grade ?? 0 }, token);
      } else {
        const newSub = await api.submissions.create({ assignmentId: id, content: content || undefined, fileUrl: fileUrl || undefined }, token);
        setMySubmission(newSub);
      }
      setSaving(false);
      setFile(null);
      toast({ title: lang === "ar" ? "تم تسليم الواجب" : "Assignment submitted!" });
      load();
    } catch (err: unknown) {
      setSaving(false);
      toast({ title: lang === "ar" ? "خطأ" : "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  if (!assignment) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Back */}
        <Link to={course ? `/dashboard/courses/${course.id}` : "/dashboard/assignments"} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          {lang === "ar" ? "رجوع" : "Back"}
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{assignment.title}</h1>
          {course && <p className="text-muted-foreground">{course.title}</p>}
        </div>

        {/* Assignment card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-semibold text-foreground">{lang === "ar" ? "تفاصيل الواجب" : "Assignment Details"}</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {assignment.description || (lang === "ar" ? "لا يوجد وصف" : "No description")}
          </p>
          <div className="flex flex-wrap gap-3">
            {assignment.dueDate && (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {lang === "ar" ? "التسليم: " : "Due: "}{new Date(assignment.dueDate).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              {lang === "ar" ? `الدرجة الكاملة: ${assignment.maxGrade}` : `Max Grade: ${assignment.maxGrade}`}
            </span>
          </div>
        </div>

        {/* Student submission */}
        {isStudent && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
            <h2 className="font-semibold">{lang === "ar" ? "تسليمي" : "My Submission"}</h2>

            {mySubmission?.grade != null ? (
              <div className="p-4 rounded-xl border border-green-200 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="font-semibold text-green-700">
                    {lang === "ar" ? `الدرجة: ${mySubmission.grade} / ${assignment.maxGrade}` : `Grade: ${mySubmission.grade} / ${assignment.maxGrade}`}
                  </p>
                </div>
                {mySubmission.feedback && (
                  <p className="text-sm text-green-700 mt-1">
                    {lang === "ar" ? "ملاحظات المعلم: " : "Feedback: "}{mySubmission.feedback}
                  </p>
                )}
              </div>
            ) : mySubmission ? (
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm">
                <Clock className="h-4 w-4" />
                {lang === "ar" ? "تم التسليم — في انتظار التصحيح" : "Submitted — awaiting grading"}
              </div>
            ) : null}

            {mySubmission?.grade == null && (
              <div className="space-y-3">
                <div>
                  <Label>{lang === "ar" ? "إجابتك" : "Your Answer"}</Label>
                  <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} maxLength={5000} className="mt-1" />
                </div>
                <div>
                  <Label>{lang === "ar" ? "إرفاق ملف (اختياري)" : "Attach File (optional)"}</Label>
                  <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1" />
                </div>
                <Button onClick={submit} disabled={saving} className="gap-2">
                  <Upload className="h-4 w-4" />
                  {saving ? "..." : (mySubmission ? (lang === "ar" ? "تحديث التسليم" : "Update Submission") : (lang === "ar" ? "تسليم الواجب" : "Submit Assignment"))}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Teacher view */}
        {isCourseTeacher && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
            <h2 className="font-semibold">{lang === "ar" ? `تسليمات الطلاب (${submissions.length})` : `Student Submissions (${submissions.length})`}</h2>
            {submissions.length === 0 ? (
              <p className="text-muted-foreground text-sm">{lang === "ar" ? "لا توجد تسليمات بعد" : "No submissions yet"}</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((s) => (
                  <SubmissionGrader key={s.id} submission={s} maxGrade={assignment.maxGrade} onSaved={load} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function SubmissionGrader({ submission, maxGrade, onSaved }: { submission: SubmissionRow; maxGrade: number; onSaved: () => void }) {
  const { getToken } = useClerkAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [grade, setGrade] = useState<string>(submission.grade?.toString() ?? "");
  const [feedback, setFeedback] = useState<string>(submission.feedback ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const g = Number(grade);
    if (isNaN(g) || g < 0 || g > maxGrade) {
      toast({ title: lang === "ar" ? "درجة غير صحيحة" : "Invalid grade", description: `0 – ${maxGrade}`, variant: "destructive" });
      return;
    }
    const token = await getToken().catch(() => null);
    if (!token) return;
    setSaving(true);
    try {
      await api.submissions.grade(submission.id, { grade: g, feedback: feedback || undefined }, token);
      toast({ title: lang === "ar" ? "تم حفظ الدرجة" : "Grade saved!" });
      onSaved();
    } catch (err: unknown) {
      toast({ title: lang === "ar" ? "خطأ" : "Error", description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-secondary/20">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{submission.studentName || (lang === "ar" ? "طالب" : "Student")}</span>
        <span className="text-xs text-muted-foreground">{new Date(submission.submittedAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}</span>
      </div>
      {submission.content && <p className="text-sm whitespace-pre-wrap mb-3 text-foreground leading-relaxed">{submission.content}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">{lang === "ar" ? `الدرجة (من ${maxGrade})` : `Grade (0–${maxGrade})`}</Label>
          <Input type="number" min="0" max={maxGrade} value={grade} onChange={(e) => setGrade(e.target.value)} className="mt-1 h-8" />
        </div>
        <div className="md:col-span-2">
          <Label className="text-xs">{lang === "ar" ? "ملاحظات" : "Feedback"}</Label>
          <Input value={feedback} onChange={(e) => setFeedback(e.target.value)} maxLength={500} className="mt-1 h-8" />
        </div>
      </div>
      <Button size="sm" className="mt-3 gap-1.5" onClick={save} disabled={saving}>
        <Save className="h-3.5 w-3.5" />
        {saving ? "..." : t.save}
      </Button>
    </div>
  );
}
