import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { AppCard, AppCardTitle } from "@/components/common/AppCard";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Row {
  id: string;
  assignment_id: string;
  grade: number | null;
  feedback: string | null;
  status: string;
  assignment_title: string;
  max_grade: number;
  course_title: string;
}

export default function Grades() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: subs } = await supabase
        .from("submissions").select("*")
        .eq("student_id", user.id)
        .order("submitted_at", { ascending: false });
      const list = subs ?? [];
      const aIds = Array.from(new Set(list.map((s: any) => s.assignment_id)));
      let aMap: Record<string, any> = {};
      let cMap: Record<string, string> = {};
      if (aIds.length) {
        const { data: as } = await supabase.from("assignments").select("id,title,max_grade,course_id").in("id", aIds);
        (as ?? []).forEach((a: any) => { aMap[a.id] = a; });
        const cIds = Array.from(new Set((as ?? []).map((a: any) => a.course_id)));
        if (cIds.length) {
          const { data: cs } = await supabase.from("courses").select("id,title").in("id", cIds);
          (cs ?? []).forEach((c: any) => { cMap[c.id] = c.title; });
        }
      }
      setRows(list.map((s: any) => ({
        id: s.id, assignment_id: s.assignment_id,
        grade: s.grade, feedback: s.feedback, status: s.status,
        assignment_title: aMap[s.assignment_id]?.title ?? "",
        max_grade: aMap[s.assignment_id]?.max_grade ?? 100,
        course_title: cMap[aMap[s.assignment_id]?.course_id] ?? "",
      })));
      setLoading(false);
    })();
  }, [user]);

  const graded = rows.filter((r) => r.grade != null);
  const avg = graded.length
    ? (graded.reduce((sum, r) => sum + (Number(r.grade) / r.max_grade) * 100, 0) / graded.length).toFixed(1)
    : null;

  return (
    <DashboardLayout title="درجاتي">
      {avg && (
        <AppCard className="mb-6">
          <AppCardTitle>المعدل العام</AppCardTitle>
          <p className="text-3xl font-bold text-primary mt-2">{avg}%</p>
          <p className="text-sm text-muted-foreground mt-1">من {graded.length} واجب مصحّح</p>
        </AppCard>
      )}

      <AppCard>
        {loading ? (
          <p className="text-muted-foreground">جاري التحميل...</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center">لم تسلّم أي واجب بعد</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الواجب</TableHead>
                <TableHead>المقرر</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الدرجة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link to={`/dashboard/assignments/${r.assignment_id}`} className="hover:text-primary">
                      {r.assignment_title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.course_title}</TableCell>
                  <TableCell>
                    {r.grade != null ? (
                      <Badge>مصحّح</Badge>
                    ) : (
                      <Badge variant="secondary">قيد التصحيح</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {r.grade != null ? `${r.grade} / ${r.max_grade}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AppCard>
    </DashboardLayout>
  );
}
