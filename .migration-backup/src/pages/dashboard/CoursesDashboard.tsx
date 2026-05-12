import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, ChevronLeft, UserPlus, Check } from "lucide-react";
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

interface Course {
  id: string;
  title: string;
  description: string | null;
  teacher_id: string;
}

export default function CoursesDashboard() {
  const { user } = useAuth();
  const { isTeacher, isStudent } = useUserRole();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    let query = supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (isTeacher && user) query = query.eq("teacher_id", user.id);
    const { data } = await query;
    setCourses((data ?? []) as Course[]);
    if (user) {
      const { data: enr } = await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("student_id", user.id);
      setEnrolled(new Set((enr ?? []).map((e) => e.course_id)));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isTeacher]);

  const handleCreate = async () => {
    if (!user || !title.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("courses").insert({
      title: title.trim(),
      description: description.trim() || null,
      teacher_id: user.id,
    });
    setSaving(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم إنشاء المقرر بنجاح" });
    setTitle("");
    setDescription("");
    setOpen(false);
    load();
  };

  const enroll = async (courseId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("course_enrollments")
      .insert({ course_id: courseId, student_id: user.id });
    if (error) {
      toast({ title: "تعذر التسجيل", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم التسجيل في المقرر" });
    load();
  };

  return (
    <DashboardLayout title="المقررات">
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          {isTeacher ? "إدارة مقرراتك التي تدرّسها" : "تصفح المقررات المتاحة"}
        </p>
        {isTeacher && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-1" /> مقرر جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء مقرر جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>عنوان المقرر</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label>الوصف</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={saving || !title.trim()}>
                  حفظ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : courses.length === 0 ? (
        <AppCard>
          <div className="py-10 text-center">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">لا توجد مقررات بعد</p>
          </div>
        </AppCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => {
            const isEnrolled = enrolled.has(c.id);
            return (
              <AppCard key={c.id} hover>
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <AppCardTitle>{c.title}</AppCardTitle>
                <AppCardDescription>{c.description || "بدون وصف"}</AppCardDescription>
                <div className="mt-4 flex items-center gap-2">
                  <Link to={`/dashboard/courses/${c.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      التفاصيل <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                  </Link>
                  {isStudent && !isEnrolled && (
                    <Button size="sm" onClick={() => enroll(c.id)}>
                      <UserPlus className="h-4 w-4 ml-1" /> تسجيل
                    </Button>
                  )}
                  {isStudent && isEnrolled && (
                    <Button size="sm" variant="secondary" disabled>
                      <Check className="h-4 w-4 ml-1" /> مسجّل
                    </Button>
                  )}
                </div>
              </AppCard>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
