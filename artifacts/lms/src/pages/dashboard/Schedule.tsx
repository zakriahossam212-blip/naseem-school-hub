import { useState, useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api, ScheduleEntryDto } from "@/lib/apiClient";
import { Calendar, Plus, Clock, MapPin, BookOpen, Trash2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const DAY_ORDER = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const TYPE_COLORS: Record<string, string> = {
  lesson: "bg-blue-50 border-blue-200 text-blue-700",
  exam: "bg-red-50 border-red-200 text-red-700",
  event: "bg-green-50 border-green-200 text-green-700",
};

export default function SchedulePage() {
  const { getToken } = useClerkAuth();
  const { isTeacher } = useAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [entries, setEntries] = useState<ScheduleEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "lesson" as "lesson" | "exam" | "event", dayOfWeek: "sunday", startTime: "", endTime: "", location: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.schedule.list().then(setEntries).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title.trim()) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    setSaving(true);
    try {
      const entry = await api.schedule.create({ ...form }, token);
      setEntries((prev) => [...prev, entry]);
      setShowForm(false);
      setForm({ title: "", type: "lesson", dayOfWeek: "sunday", startTime: "", endTime: "", location: "", notes: "" });
      toast({ title: lang === "ar" ? "تمت الإضافة" : "Added!" });
    } catch { toast({ title: lang === "ar" ? "خطأ" : "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    const token = await getToken().catch(() => null);
    if (!token) return;
    await api.schedule.delete(id, token).catch(() => {});
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const byDay = DAY_ORDER.map((day) => ({
    day,
    label: t[day as keyof typeof t] as string,
    entries: entries.filter((e) => e.dayOfWeek === day),
  })).filter((d) => d.entries.length > 0);

  const upcomingSpecific = entries.filter((e) => e.specificDate).sort((a, b) => new Date(a.specificDate!).getTime() - new Date(b.specificDate!).getTime());

  return (
    <DashboardLayout title={t.schedule}>
      <div className="space-y-6">
        {isTeacher && (
          <div className="flex justify-end">
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              {lang === "ar" ? "إضافة موعد" : "Add Entry"}
            </Button>
          </div>
        )}

        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in shadow-depth-sm">
            <h3 className="font-semibold mb-4">{lang === "ar" ? "إضافة موعد جديد" : "New Schedule Entry"}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>{lang === "ar" ? "العنوان" : "Title"} *</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>{lang === "ar" ? "النوع" : "Type"}</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "lesson" | "exam" | "event" }))}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="lesson">{t.lessonType}</option>
                  <option value="exam">{t.examType}</option>
                  <option value="event">{t.eventType}</option>
                </select>
              </div>
              <div>
                <Label>{lang === "ar" ? "اليوم" : "Day"}</Label>
                <select
                  value={form.dayOfWeek}
                  onChange={(e) => setForm((f) => ({ ...f, dayOfWeek: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {DAY_ORDER.map((d) => <option key={d} value={d}>{t[d as keyof typeof t] as string}</option>)}
                </select>
              </div>
              <div>
                <Label>{lang === "ar" ? "المكان" : "Location"}</Label>
                <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>{lang === "ar" ? "من" : "Start Time"}</Label>
                <Input type="time" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>{lang === "ar" ? "إلى" : "End Time"}</Label>
                <Input type="time" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={save} disabled={saving}>{saving ? "..." : t.save}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{t.cancel}</Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">{t.noData}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Weekly schedule */}
            {byDay.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {lang === "ar" ? "الجدول الأسبوعي" : "Weekly Schedule"}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {byDay.map(({ day, label, entries: dayEntries }) => (
                    <div key={day} className="bg-card border border-border rounded-2xl overflow-hidden shadow-depth-sm">
                      <div className="bg-primary/8 px-4 py-2.5 border-b border-border">
                        <p className="font-semibold text-sm text-primary">{label}</p>
                      </div>
                      <div className="p-3 space-y-2">
                        {dayEntries.map((entry) => (
                          <div key={entry.id} className={cn("rounded-xl border px-3 py-2.5 flex items-start gap-2", TYPE_COLORS[entry.type] || "bg-secondary border-border text-foreground")}>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{entry.title}</p>
                              {(entry.startTime || entry.endTime) && (
                                <p className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                                  <Clock className="h-3 w-3" />
                                  {entry.startTime} {entry.endTime ? `– ${entry.endTime}` : ""}
                                </p>
                              )}
                              {entry.location && (
                                <p className="text-xs opacity-70 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />{entry.location}
                                </p>
                              )}
                            </div>
                            {isTeacher && (
                              <button onClick={() => remove(entry.id)} className="opacity-40 hover:opacity-100 transition-opacity">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming specific dates (exams/events) */}
            {upcomingSpecific.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  {lang === "ar" ? "مواعيد قادمة" : "Upcoming Dates"}
                </h2>
                <div className="space-y-2">
                  {upcomingSpecific.map((entry) => (
                    <div key={entry.id} className={cn("flex items-center gap-4 p-4 rounded-xl border", TYPE_COLORS[entry.type] || "bg-secondary border-border")}>
                      <div className="flex-1">
                        <p className="font-medium">{entry.title}</p>
                        <p className="text-sm opacity-70">
                          {new Date(entry.specificDate!).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { dateStyle: "full" })}
                          {entry.startTime ? ` – ${entry.startTime}` : ""}
                        </p>
                      </div>
                      {isTeacher && (
                        <button onClick={() => remove(entry.id)} className="opacity-40 hover:opacity-100">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
