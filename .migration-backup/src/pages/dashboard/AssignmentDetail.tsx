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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";

interface Assignment {
  id: string; course_id: string; title: string; description: string | null;
  due_date: string | null; max_grade: number; attachment_url: string | null;
}
interface Course { id: string; title: string; teacher_id: string; }
interface Submission {
  id: string; assignment_id: string; student_id: string; content: string | null;
  file_url: string | null; grade: number | null; feedback: string | null;
  status: string; submitted_at: string; graded_at: string | null;
}
interface SubmissionRow extends Submission { student_name?: string | null; }

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

  const isCourseTeacher = isTeacher && course?.teacher_id === user?.id;

  const load = async () => {
    if (!id || !user) return;
    const { data: a } = await supabase.from("assignments").select("*").eq("id", id).maybeSingle();
    setAssignment(a as Assignment | null);
    if (a) {
      const { data: c } = await supabase.from("courses").select("*").eq("id", a.course_id).maybeSingle();
      setCourse(c as Course | null);
    }
    if (isStudent) {
      const { data: s } = await supabase
        .from("submissions").select("*")
        .eq("assignment_id", id).eq("student_id", user.id).maybeSingle();
      setMySubmission(s as Submission | null);
      if (s) setContent(s.content || "");
    }
    if (isTeacher) {
      const { data: subs } = await supabase
        .from("submissions").select("*")
        .eq("assignment_id", id)
        .order("submitted_at", { ascending: false });
      const rows = (subs ?? []) as Submission[];
      const ids = Array.from(new Set(rows.map((r) => r.student_id)));
      let names: Record<string, string> = {};
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles").select("user_id, full_name").in("user_id", ids);
        (profs ?? []).forEach((p: any) => { names[p.user_id] = p.full_name; });
      }
      setSubmissions(rows.map((r) => ({ ...r, student_name: names[r.student_id] || "طالب" })));
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id, user, isTeacher, isStudent]);

  const downloadFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("assignments").createSignedUrl(path, 60);
    if (error || !data) {
      toast({ title: "تعذر تنزيل الملف", variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const submit = async () => {
    if (!user || !id) return;
    setSaving(true);
    let file_url = mySubmission?.file_url ?? null;
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("assignments").upload(path, file);
      if (upErr) { setSaving(false); toast({ title: "تعذر رفع الملف", description: upErr.message, variant: "destructive" }); return; }
      file_url = path;
    }
    if (mySubmission) {
      const { error } = await supabase.from("submissions")
        .update({ content: content || null, file_url, status: "submitted", submitted_at: new Date().toISOString() })
        .eq("id", mySubmission.id);
      if (error) { setSaving(false); toast({ title: "خطأ", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("submissions").insert({
        assignment_id: id, student_id: user.id,
        content: content || null, file_url, status: "submitted",
      });
      if (error) { setSaving(false); toast({ title: "خطأ", description: error.message, variant: "destructive" }); return; }
    }
    setSaving(false);
    setFile(null);
    toast({ title: "تم تسليم الواجب" });
    load();
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
          {assignment.due_date && <Badge variant="secondary">التسليم: {new Date(assignment.due_date).toLocaleString("ar-EG")}</Badge>}
          <Badge variant="secondary">الدرجة الكلية: {assignment.max_grade}</Badge>
        </div>
        {assignment.attachment_url && (
          <Button variant="outline" size="sm" className="mt-4" onClick={() => downloadFile(assignment.attachment_url!)}>
            <Download className="h-4 w-4 ml-1" /> تنزيل المرفق
          </Button>
        )}
      </AppCard>

      {isStudent && (
        <AppCard className="mb-6">
          <AppCardTitle>تسليمي</AppCardTitle>
          {mySubmission?.grade != null ? (
            <div className="mt-3 p-4 rounded-md border border-primary/30 bg-primary/5">
              <p className="font-semibold">الدرجة: {mySubmission.grade} / {assignment.max_grade}</p>
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
                {mySubmission?.file_url && (
                  <Button variant="link" size="sm" onClick={() => downloadFile(mySubmission.file_url!)} className="px-0">
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
                  maxGrade={assignment.max_grade}
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
    const { error } = await supabase.from("submissions").update({
      grade: g, feedback: feedback || null, status: "graded",
      graded_at: new Date().toISOString(), graded_by: user.id,
    }).eq("id", submission.id);
    setSaving(false);
    if (error) { toast({ title: "خطأ", description: error.message, variant: "destructive" }); return; }
    toast({ title: "تم حفظ الدرجة" });
    onSaved();
  };

  return (
    <div className="p-4 rounded-md border border-border bg-secondary/30 shadow-depth-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{submission.student_name}</span>
        <span className="text-xs text-muted-foreground">{new Date(submission.submitted_at).toLocaleString("ar-EG")}</span>
      </div>
      {submission.content && <p className="text-sm whitespace-pre-wrap mb-2">{submission.content}</p>}
      {submission.file_url && (
        <Button variant="outline" size="sm" onClick={() => onDownload(submission.file_url!)} className="mb-3">
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
