import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useLang } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api, GradeDto, CourseDto } from "@/lib/apiClient";
import { ChevronLeft, GraduationCap, BookOpen, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function GradeBadge({ grade, maxGrade }: { grade: number | null; maxGrade: number }) {
  if (grade == null) return <span className="text-xs text-muted-foreground">—</span>;
  const pct = Math.round((grade / maxGrade) * 100);
  const color = pct >= 80 ? "text-green-600 bg-green-50" : pct >= 60 ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50";
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold", color)}>
      {grade}/{maxGrade} <span className="opacity-60">({pct}%)</span>
    </span>
  );
}

export default function ParentStudentDetail() {
  const { studentId } = useParams<{ studentId: string }>();
  const { getToken } = useClerkAuth();
  const { t, lang } = useLang();
  const [grades, setGrades] = useState<GradeDto[]>([]);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"grades" | "courses">("grades");

  useEffect(() => {
    if (!studentId) return;
    const run = async () => {
      const token = await getToken().catch(() => null);
      if (!token) { setLoading(false); return; }
      setLoading(true);
      const [g, c] = await Promise.all([
        api.parent.grades(studentId, token).catch(() => [] as GradeDto[]),
        api.parent.studentCourses(studentId, token).catch(() => [] as CourseDto[]),
      ]);
      setGrades(g);
      setCourses(c);
      setLoading(false);
    };
    run();
  }, [studentId]);

  const avg = grades.length ? Math.round(grades.filter((g) => g.grade != null).reduce((sum, g) => sum + (g.grade! / g.maxGrade) * 100, 0) / grades.filter((g) => g.grade != null).length) : null;

  return (
    <DashboardLayout title={lang === "ar" ? "أداء الطالب" : "Student Performance"}>
      <div className="space-y-6">
        {/* Back */}
        <Link to="/parent">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            {lang === "ar" ? "العودة" : "Back"}
          </Button>
        </Link>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{lang === "ar" ? "المقررات" : "Courses"}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{courses.length}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{lang === "ar" ? "الواجبات" : "Assignments"}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{grades.length}</p>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-card border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{lang === "ar" ? "المتوسط" : "Average"}</span>
              </div>
              <p className={cn("text-2xl font-bold", avg == null ? "text-muted-foreground" : avg >= 80 ? "text-green-600" : avg >= 60 ? "text-yellow-600" : "text-red-600")}>
                {avg != null ? `${avg}%` : "—"}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border pb-0">
          {(["grades", "courses"] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === tabKey ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tabKey === "grades" ? t.grades : t.courses}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : tab === "grades" ? (
          grades.length === 0 ? (
            <div className="py-16 text-center"><GraduationCap className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" /><p className="text-muted-foreground">{t.noData}</p></div>
          ) : (
            <div className="space-y-3">
              {grades.map((g, i) => (
                <div key={g.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-card animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{g.assignmentTitle}</p>
                    <p className="text-xs text-muted-foreground">{g.courseTitle}</p>
                    {g.feedback && <p className="text-sm text-muted-foreground mt-1 italic">{g.feedback}</p>}
                  </div>
                  <div className="text-left flex-shrink-0">
                    <GradeBadge grade={g.grade} maxGrade={g.maxGrade} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {g.status === "graded"
                        ? <span className="flex items-center gap-1 text-green-600"><CheckCircle className="h-3 w-3" />{lang === "ar" ? "تم التصحيح" : "Graded"}</span>
                        : <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lang === "ar" ? "قيد المراجعة" : "Pending"}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          courses.length === 0 ? (
            <div className="py-16 text-center"><BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" /><p className="text-muted-foreground">{t.noData}</p></div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map((c, i) => (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-4 shadow-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{c.title}</p>
                      {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
