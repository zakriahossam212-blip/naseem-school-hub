import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth as useClerkAuth } from "@clerk/react";
import { GraduationCap, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Row {
  id: string; assignmentId: string; grade: number | null;
  feedback: string | null; status: string;
  assignmentTitle: string; maxGrade: number; courseTitle: string;
}

function GradeBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
      <div className={cn("h-1.5 rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Grades() {
  const { userId } = useAuth();
  const { getToken } = useClerkAuth();
  const { t, lang } = useLang();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const token = await getToken().catch(() => null);
      if (!token) { setLoading(false); return; }
      const subs = await api.submissions.list({}, token).catch(() => []);
      const aIds = Array.from(new Set(subs.map((s) => s.assignmentId)));
      const aMap: Record<string, { title: string; maxGrade: number; courseId: string }> = {};
      const cMap: Record<string, string> = {};
      if (aIds.length) {
        const assignments = await Promise.all(aIds.map((aid) => api.assignments.get(aid).catch(() => null)));
        assignments.forEach((a) => { if (a) aMap[a.id] = { title: a.title, maxGrade: a.maxGrade, courseId: a.courseId }; });
        const cIds = Array.from(new Set(assignments.filter(Boolean).map((a) => a!.courseId)));
        if (cIds.length) {
          const courses = await Promise.all(cIds.map((cid) => api.courses.get(cid).catch(() => null)));
          courses.forEach((c) => { if (c) cMap[c.id] = c.title; });
        }
      }
      setRows(subs.map((s) => ({
        id: s.id, assignmentId: s.assignmentId,
        grade: s.grade, feedback: s.feedback, status: s.status,
        assignmentTitle: aMap[s.assignmentId]?.title ?? "",
        maxGrade: aMap[s.assignmentId]?.maxGrade ?? 100,
        courseTitle: cMap[aMap[s.assignmentId]?.courseId ?? ""] ?? "",
      })));
      setLoading(false);
    })();
  }, [userId]);

  const graded = rows.filter((r) => r.grade != null);
  const avg = graded.length
    ? Math.round(graded.reduce((sum, r) => sum + (r.grade! / r.maxGrade) * 100, 0) / graded.length)
    : null;

  return (
    <DashboardLayout title={t.myGrades}>
      <div className="space-y-6">
        {/* Summary cards */}
        {avg != null && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">{lang === "ar" ? "المتوسط" : "Average"}</span></div>
              <p className={cn("text-2xl font-bold", avg >= 80 ? "text-green-600" : avg >= 60 ? "text-yellow-600" : "text-red-600")}>{avg}%</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-xs text-muted-foreground">{lang === "ar" ? "مصحّح" : "Graded"}</span></div>
              <p className="text-2xl font-bold text-foreground">{graded.length}</p>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-card border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{lang === "ar" ? "قيد التصحيح" : "Pending"}</span></div>
              <p className="text-2xl font-bold text-foreground">{rows.length - graded.length}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center">
            <GraduationCap className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === "ar" ? "لم تسلّم أي واجب بعد" : "No assignments submitted yet"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((r, i) => {
              const pct = r.grade != null ? Math.round((r.grade / r.maxGrade) * 100) : null;
              return (
                <div key={r.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4 shadow-card animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex-1 min-w-0">
                    <Link to={`/dashboard/assignments/${r.assignmentId}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                      {r.assignmentTitle}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.courseTitle}</p>
                    {r.feedback && <p className="text-sm text-muted-foreground mt-2 italic border-r-2 border-primary/30 pr-3">{r.feedback}</p>}
                  </div>
                  <div className="text-left flex-shrink-0 min-w-[80px]">
                    {r.grade != null ? (
                      <>
                        <p className={cn("text-lg font-bold", pct! >= 80 ? "text-green-600" : pct! >= 60 ? "text-yellow-600" : "text-red-600")}>
                          {r.grade}<span className="text-xs text-muted-foreground font-normal">/{r.maxGrade}</span>
                        </p>
                        <GradeBar value={r.grade} max={r.maxGrade} />
                        <p className={cn("text-xs mt-1", pct! >= 80 ? "text-green-600" : pct! >= 60 ? "text-yellow-600" : "text-red-600")}>{pct}%</p>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" />
                        {lang === "ar" ? "قيد التصحيح" : "Pending"}
                      </span>
                    )}
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
