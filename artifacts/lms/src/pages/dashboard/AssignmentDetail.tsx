import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Download, Upload, Save } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppCard, AppCardTitle } from "@/components/common/AppCard";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";

interface Assignment {
  id: string; courseId: string; title: string; description: string | null;
  dueDate: string | null; maxGrade: number; attachmentUrl: string | null;
}
interface Course { id: string; title: string; teacherId: string; }
interface Submission {
  id: string; assignmentId: string; studentId: string; content: string | null;
  fileUrl: string | null; grade: number | null; feedback: string | null;
  status: string; submittedAt: string; gradedAt: string | null;
}
interface SubmissionRow extends Submission { studentName?: string | null; }

export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isTeacher, isStudent } = useUserRole();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [mySubmission, setMySubmission] = useState<Submission | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const isCourseTeacher = isTeacher && course?.teacherId === user?.id;

  const load = async () => {
    if (!id || !user) return;
    const a = await api.assignments.get(id).catch(() => null);
    if (!a) return;
    setAssignment({ ...a, courseId: a.courseId, dueDate: a.dueDate, maxGrade: a.maxGrade, attachmentUrl: a.attachmentUrl });
    const c = await api.courses.get(a.courseId).catch(() => null);
    if (c) setCourse({ id: c.id, title: c.title, teacherId: c.teacherId });

    if (isStudent) {
      const subs = await api.submissions.list({ assignmentId: id, studentId: user.id });
      const s = subs[0] ?? null;
      setMySubmission(s);
      if (s) setContent(s.content || "");
    }
    if (isTeacher) {
      const subs = await api.submissions.list({ assignmentId: id });
      const ids = Array.from(new Set(subs.map((r) => r.studentId)));
      let names: Record<string, string> = {};
      if (ids.length) {
        const profs = await api.profiles.list(ids).catch(() => []);
        profs.forEach((p) => { names[p.userId] = p.fullName || "طالب"; });
      }
      setSubmissions(subs.map((r) => ({ ...r, studentName: names[r.studentId] || "طالب" })));
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id, user, isTeacher, isStudent]);

  const downloadFile = async (fileUrl: string) => {
    const url = fileUrl.startsWith("/api/") ? fileUrl : api.files.getUrl(fileUrl);
    window.open(url, "_blank");
  };

  const submit = async () => {
    if (!user || !id) return;
    setSaving(true);
    let fileUrl = mySubmission?.fileUrl ?? null;
    if (file) {
      try {
        const result = await api.files.upload(file);
        fileUrl = result.url;
      } catch {
        setSaving(false);
        toast({ title: "تعذر رفع الملف", variant: "destructive" });
        return;
      }
    }
    try {
      if (mySubmission) {
        await api.submissions.update(mySubmission.id, { content: content || undefined, fileUrl: fileUrl || undefined, status: "submitted" });
      } else {
        const newSub = await api.submissions.create({ assignmentId: id, studentId: user.id, content: content || undefined, fileUrl: fileUrl || undefined, status: "submitted" });
        setMySubmission(newSub);
      }
      setSaving(false);
      setFile(null);
      toast({ title: "تم تسليم الواجب" });
      load();
    } catch (err: any) {
      setSaving(false);
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  if (!assignment) {
    return <DashboardLayout><p className="text-muted-foreground">جاري التحميل...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <Link to={course ? `/dashboard/courses/${course.id}` : "/dashboard/assignments"} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
        <ChevronLeft className="h-4 w-4 rotate-180" /> رجوع
      </Link>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{assignment.title}</h1>
      <p className="text-muted-foreground mb-6">{course?.title}</p>

      <AppCard className="mb-6">
        <AppCardTitle>تفاصيل الواجب</AppCardTitle>
        <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{assignment.description || "لا يوجد وصف"}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {assignment.dueDate && <Badge variant="secondary">التسليم: {new Date(assignment.dueDate).toLocaleString("ar-EG")}</Badge>}
          <Badge variant="secondary">الدرجة الكلية: {assignment.maxGrade}</Badge>
        </div>
        {assignment.attachmentUrl && (
          <Button variant="outline" size="sm" className="mt-4" onClick={() => downloadFile(assignment.attachmentUrl!)}>
            <Download className="h-4 w-4 ml-1" /> تنزيل المرفق
          </Button>
        )}
      </AppCard>

      {isStudent && (
        <AppCard className="mb-6">
          <AppCardTitle>تسليمي</AppCardTitle>
          {mySubmission?.grade != null ? (
            <div className="mt-3 p-4 rounded-md border border-primary/30 bg-primary/5">
              <p className="font-semibold">الدرجة: {mySubmission.grade} / {assignment.maxGrade}</p>
              {mySubmission.feedback && <p className="text-sm text-muted-foreground mt-2">ملاحظات المعلم: {mySubmission.feedback}</p>}
            </div>
          ) : mySubmission ? (
            <Badge className="mt-2">تم التسليم — في انتظار التصحيح</Badge>
          ) : null}

          {(mySubmission?.grade == null) && (
            <div className="space-y-3 mt-4">
              <div className="space-y-2">
                <Label>إجابتك</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} maxLength={5000} />
              </div>
              <div className="space-y-2">
                <Label>إرفاق ملف (اختياري)</Label>
                <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                {mySubmission?.fileUrl && (
                  <Button variant="link" size="sm" onClick={() => downloadFile(mySubmission.fileUrl!)} className="px-0">
                    <Download className="h-3 w-3 ml-1" /> الملف الحالي
                  </Button>
                )}
              </div>
              <Button onClick={submit} disabled={saving}>
                <Upload className="h-4 w-4 ml-1" /> {mySubmission ? "تحديث التسليم" : "تسليم الواجب"}
              </Button>
            </div>
          )}
        </AppCard>
      )}

      {isCourseTeacher && (
        <AppCard>
          <AppCardTitle>تسليمات الطلاب ({submissions.length})</AppCardTitle>
          {submissions.length === 0 ? (
            <p className="text-muted-foreground mt-3">لا توجد تسليمات بعد</p>
          ) : (
            <div className="space-y-3 mt-4">
              {submissions.map((s) => (
                <SubmissionGrader
                  key={s.id}
                  submission={s}
                  maxGrade={assignment.maxGrade}
                  onDownload={downloadFile}
                  onSaved={load}
                />
              ))}
            </div>
          )}
        </AppCard>
      )}
    </DashboardLayout>
  );
}

function SubmissionGrader({
  submission, maxGrade, onDownload, onSaved,
}: {
  submission: SubmissionRow; maxGrade: number;
  onDownload: (p: string) => void; onSaved: () => void;
}) {
  const { user } = useAuth();
  const [grade, setGrade] = useState<string>(submission.grade?.toString() ?? "");
  const [feedback, setFeedback] = useState<string>(submission.feedback ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!user) return;
    const g = Number(grade);
    if (isNaN(g) || g < 0 || g > maxGrade) {
      toast({ title: "درجة غير صحيحة", description: `بين 0 و ${maxGrade}`, variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await api.submissions.update(submission.id, { grade: g, feedback: feedback || undefined, status: "graded", gradedBy: user.id });
      toast({ title: "تم حفظ الدرجة" });
      onSaved();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 rounded-md border border-border bg-secondary/30 shadow-depth-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{submission.studentName}</span>
        <span className="text-xs text-muted-foreground">{new Date(submission.submittedAt).toLocaleString("ar-EG")}</span>
      </div>
      {submission.content && <p className="text-sm whitespace-pre-wrap mb-2">{submission.content}</p>}
      {submission.fileUrl && (
        <Button variant="outline" size="sm" onClick={() => onDownload(submission.fileUrl!)} className="mb-3">
          <Download className="h-4 w-4 ml-1" /> تنزيل ملف الطالب
        </Button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">الدرجة (من {maxGrade})</Label>
          <Input type="number" min="0" max={maxGrade} value={grade} onChange={(e) => setGrade(e.target.value)} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">ملاحظات</Label>
          <Input value={feedback} onChange={(e) => setFeedback(e.target.value)} maxLength={500} />
        </div>
      </div>
      <Button size="sm" className="mt-3" onClick={save} disabled={saving}>
        <Save className="h-4 w-4 ml-1" /> حفظ
      </Button>
    </div>
  );
}
