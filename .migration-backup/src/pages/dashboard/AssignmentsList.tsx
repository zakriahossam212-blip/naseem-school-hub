import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronLeft, Calendar } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { AppCard, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AssignmentRow {
  id: string; title: string; description: string | null;
  due_date: string | null; max_grade: number; course_id: string;
  course_title?: string;
}

export default function AssignmentsList() {
  const { user } = useAuth();
  const [items, setItems] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: a } = await supabase
        .from("assignments").select("*")
        .order("due_date", { ascending: true, nullsFirst: false });
      const rows = (a ?? []) as AssignmentRow[];
      const courseIds = Array.from(new Set(rows.map((r) => r.course_id)));
      const titles: Record<string, string> = {};
      if (courseIds.length) {
        const { data: cs } = await supabase.from("courses").select("id,title").in("id", courseIds);
        (cs ?? []).forEach((c: any) => { titles[c.id] = c.title; });
      }
      setItems(rows.map((r) => ({ ...r, course_title: titles[r.course_id] })));
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
              <Badge variant="secondary" className="mb-2">{a.course_title}</Badge>
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
