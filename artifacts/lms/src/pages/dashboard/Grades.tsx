import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { AppCard, AppCardTitle } from "@/components/common/AppCard";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

interface Row {
  id: string;
  assignmentId: string;
  grade: number | null;
  feedback: string | null;
  status: string;
  assignmentTitle: string;
  maxGrade: number;
  courseTitle: string;
}

export default function Grades() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const subs = await api.submissions.list({ studentId: user.id }).catch(() => []);
      const aIds = Array.from(new Set(subs.map((s) => s.assignmentId)));
      let aMap: Record<string, { title: string; maxGrade: number; courseId: string }> = {};
      let cMap: Record<string, string> = {};
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
        courseTitle: cMap[aMap[s.assignmentId]?.courseId] ?? "",
      })));
      setLoading(false);
    })();
  }, [user]);

  const graded = rows.filter((r) => r.grade != null);
  const avg = graded.length
    ? (graded.reduce((sum, r) => sum + (Number(r.grade) / r.maxGrade) * 100, 0) / graded.length).toFixed(1)
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
                    <Link to={`/dashboard/assignments/${r.assignmentId}`} className="hover:text-primary">
                      {r.assignmentTitle}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.courseTitle}</TableCell>
                  <TableCell>
                    {r.grade != null ? (
                      <Badge>مصحّح</Badge>
                    ) : (
                      <Badge variant="secondary">قيد التصحيح</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {r.grade != null ? `${r.grade} / ${r.maxGrade}` : "—"}
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
