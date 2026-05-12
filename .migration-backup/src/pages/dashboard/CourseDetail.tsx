import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, FileText, ChevronLeft, Calendar } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AppCard, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";

interface Course { id: string; title: string; description: string | null; teacher_id: string; }
interface Assignment { id: string; title: string; description: string | null; due_date: string | null; max_grade: number; }

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isTeacher } = useUserRole();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxGrade, setMaxGrade] = useState("100");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    const { data: c } = await supabase.from("courses").select("*").eq("id", id).maybeSingle();
    setCourse(c as Course | null);
    const { data: a } = await supabase
      .from("assignments")
      .select("*")
      .eq("course_id", id)
      .order("created_at", { ascending: false });
    setAssignments((a ?? []) as Assignment[]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const isCourseTeacher = isTeacher && course?.teacher_id === user?.id;

  const create = async () => {
    if (!user || !id || !title.trim()) return;
    setSaving(true);
    let attachment_url: string | null = null;
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("assignments").upload(path, file);
      if (upErr) {
        setSaving(false);
        toast({ title: "تعذر رفع الملف", description: upErr.message, variant: "destructive" });
        return;
      }
      attachment_url = path;
    }
    const { error } = await supabase.from("assignments").insert({
      course_id: id,
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      max_grade: Number(maxGrade) || 100,
      attachment_url,
      created_by: user.id,
    });
    setSaving(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم إنشاء الواجب" });
    setTitle(""); setDescription(""); setDueDate(""); setMaxGrade("100"); setFile(null);
    setOpen(false);
    load();
  };

  if (!course) {
    return <DashboardLayout><p className="text-muted-foreground">جاري التحميل...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to="/dashboard/courses" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
          <ChevronLeft className="h-4 w-4 rotate-180" /> العودة للمقررات
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
        {course.description && <p className="text-muted-foreground mt-2">{course.description}</p>}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">الواجبات</h2>
        {isCourseTeacher && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 ml-1" /> واجب جديد</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>إنشاء واجب</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2"><Label>العنوان</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} /></div>
                <div className="space-y-2"><Label>الوصف</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>تاريخ التسليم</Label>
                    <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
                  <div className="space-y-2"><Label>الدرجة الكلية</Label>
                    <Input type="number" min="1" value={maxGrade} onChange={(e) => setMaxGrade(e.target.value)} /></div>
                </div>
                <div className="space-y-2"><Label>ملف مرفق (اختياري)</Label>
                  <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
              </div>
              <DialogFooter>
                <Button onClick={create} disabled={saving || !title.trim()}>حفظ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {assignments.length === 0 ? (
        <AppCard><div className="py-10 text-center">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لا توجد واجبات بعد</p>
        </div></AppCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((a) => (
            <AppCard key={a.id} hover>
              <AppCardTitle>{a.title}</AppCardTitle>
              <AppCardDescription>{a.description || "بدون وصف"}</AppCardDescription>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {a.due_date && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(a.due_date).toLocaleDateString("ar-EG")}
                  </span>
                )}
                <span>الدرجة: {a.max_grade}</span>
              </div>
              <Link to={`/dashboard/assignments/${a.id}`}>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  عرض الواجب <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
              </Link>
            </AppCard>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
