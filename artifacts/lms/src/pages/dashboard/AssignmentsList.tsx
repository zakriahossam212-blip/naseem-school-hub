import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronLeft, Calendar } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { AppCard, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

interface AssignmentRow {
  id: string; title: string; description: string | null;
  dueDate: string | null; maxGrade: number; courseId: string;
  courseTitle?: string;
}

export default function AssignmentsList() {
  const { user } = useAuth();
  const [items, setItems] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
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
  }, [user]);

  return (
    <DashboardLayout title="الواجبات">
      {loading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : items.length === 0 ? (
        <AppCard><div className="py-10 text-center">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لا توجد واجبات متاحة</p>
        </div></AppCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((a) => (
            <AppCard key={a.id} hover>
              <Badge variant="secondary" className="mb-2">{a.courseTitle}</Badge>
              <AppCardTitle>{a.title}</AppCardTitle>
              <AppCardDescription>{a.description || "بدون وصف"}</AppCardDescription>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {a.dueDate && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(a.dueDate).toLocaleDateString("ar-EG")}
                  </span>
                )}
                <span>الدرجة: {a.maxGrade}</span>
              </div>
              <Link to={`/dashboard/assignments/${a.id}`}>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  فتح <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
              </Link>
            </AppCard>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
