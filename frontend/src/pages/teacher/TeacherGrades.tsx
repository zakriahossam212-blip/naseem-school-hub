import { useState, useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api, CourseDto, AssignmentDto, SubmissionDto } from "@/lib/apiClient";
import { GraduationCap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function TeacherGrades() {
  const { getToken } = useClerkAuth();
  const { userId } = useAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [gradeInput, setGradeInput] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!userId) return;
    api.courses.listByTeacher(userId).then(setCourses).catch(() => {});
  }, [userId]);

  const loadCourse = async (courseId: string) => {
    setSelected(courseId); setLoading(true);
    const token = await getToken().catch(() => null);
    const [aList] = await Promise.all([api.assignments.list(courseId, token ?? undefined).catch(() => [])]);
    setAssignments(aList);
    const subs: SubmissionDto[] = [];
    for (const a of aList) {
      if (token) {
        const s = await api.submissions.list({ assignmentId: a.id }, token).catch(() => []);
        subs.push(...s);
      }
    }
    setSubmissions(subs);
    setLoading(false);
  };

  const handleGrade = async (subId: string, grade: string) => {
    const token = await getToken().catch(() => null);
    if (!token) return;
    await api.submissions.grade(subId, { grade: Number(grade) }, token);
    setSubmissions((prev) => prev.map((s) => s.id === subId ? { ...s, grade: Number(grade), status: "graded" } : s));
    toast({ title: lang === "ar" ? "تم التصحيح" : "Graded!" });
  };

  const assignmentMap = Object.fromEntries(assignments.map((a) => [a.id, a]));

  return (
    <DashboardLayout title={lang === "ar" ? "تصحيح الواجبات" : "Grade Assignments"}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => loadCourse(c.id)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${selected === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:bg-accent"}`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : !selected ? (
          <div className="py-16 text-center">
            <GraduationCap className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === "ar" ? "اختر مقررًا لعرض الإجابات" : "Select a course to view submissions"}</p>
          </div>
        ) : submissions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t.noData}</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => {
              const assignment = assignmentMap[sub.assignmentId];
              return (
                <div key={sub.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-card animate-fade-in">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{assignment?.title ?? sub.assignmentId}</p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" ? "طالب: " : "Student: "}{sub.studentId.slice(0, 16)}...
                      {" · "}{lang === "ar" ? "الحالة: " : "Status: "}{sub.status}
                    </p>
                    {sub.content && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{sub.content}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">/ {assignment?.maxGrade ?? 100}</span>
                    <Input
                      type="number" className="w-20 h-8 text-sm"
                      value={gradeInput[sub.id] ?? (sub.grade?.toString() ?? "")}
                      onChange={(e) => setGradeInput((p) => ({ ...p, [sub.id]: e.target.value }))}
                      placeholder="0"
                    />
                    <Button size="sm" className="h-8 gap-1" onClick={() => handleGrade(sub.id, gradeInput[sub.id] ?? "0")}>
                      <CheckCircle className="h-3.5 w-3.5" />
                      {lang === "ar" ? "حفظ" : "Grade"}
                    </Button>
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
