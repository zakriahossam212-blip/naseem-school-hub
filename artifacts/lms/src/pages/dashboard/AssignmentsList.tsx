import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronLeft, Calendar, Clock } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { api, AssignmentDto } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Row extends AssignmentDto { courseTitle?: string; }

function DueBadge({ dueDate }: { dueDate: string | null }) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const overdue = days < 0;
  const urgent = days >= 0 && days <= 2;
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium",
      overdue ? "bg-red-100 text-red-700" : urgent ? "bg-orange-100 text-orange-700" : "bg-secondary text-muted-foreground",
    )}>
      <Calendar className="h-3 w-3" />
      {due.toLocaleDateString("ar-EG")}
    </span>
  );
}

export default function AssignmentsList() {
  const { userId } = useAuth();
  const { t, lang } = useLang();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const rows = await api.assignments.list().catch(() => []);
      const courseIds = Array.from(new Set(rows.map((r) => r.courseId)));
      const titles: Record<string, string> = {};
      if (courseIds.length) {
        const courses = await Promise.all(courseIds.map((cid) => api.courses.get(cid).catch(() => null)));
        courses.forEach((c) => { if (c) titles[c.id] = c.title; });
      }
      setItems(rows.map((r) => ({ ...r, courseTitle: titles[r.courseId] })));
      setLoading(false);
    })();
  }, [userId]);

  return (
    <DashboardLayout title={t.assignments}>
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === "ar" ? "لا توجد واجبات متاحة" : "No assignments available"}</p>
          </div>
        ) : items.map((a, i) => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4 shadow-card hover-lift animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{a.title}</h3>
                <DueBadge dueDate={a.dueDate} />
              </div>
              {a.courseTitle && (
                <span className="inline-block text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full mb-2">{a.courseTitle}</span>
              )}
              {a.description && <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-muted-foreground">{lang === "ar" ? `الدرجة: ${a.maxGrade}` : `Max Grade: ${a.maxGrade}`}</span>
              </div>
            </div>
            <Link to={`/dashboard/assignments/${a.id}`} className="flex-shrink-0">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                {lang === "ar" ? "فتح" : "Open"}
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
