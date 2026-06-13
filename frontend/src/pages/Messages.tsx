import { useState, useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api, MessageDto, ProfileDto } from "@/lib/apiClient";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
  const { getToken } = useClerkAuth();
  const { userId } = useAuth();
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [inbox, setInbox] = useState<MessageDto[]>([]);
  const [selected, setSelected] = useState<MessageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [toUserId, setToUserId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    const token = await getToken().catch(() => null);
    if (!token) { setLoading(false); return; }
    setLoading(true);
    api.messages.inbox(token).then(setInbox).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [userId]);

  const markRead = async (msg: MessageDto) => {
    setSelected(msg);
    if (!msg.isRead) {
      const token = await getToken().catch(() => null);
      if (token) {
        await api.messages.markRead(msg.id, token).catch(() => {});
        setInbox((prev) => prev.map((m) => m.id === msg.id ? { ...m, isRead: true } : m));
      }
    }
  };

  const sendMessage = async () => {
    if (!toUserId.trim() || !subject.trim() || !body.trim()) return;
    const token = await getToken().catch(() => null);
    if (!token) return;
    setSending(true);
    try {
      await api.messages.send({ toUserId: toUserId.trim(), subject: subject.trim(), body: body.trim() }, token);
      toast({ title: lang === "ar" ? "تم الإرسال" : "Sent!", description: lang === "ar" ? "تم إرسال الرسالة بنجاح" : "Your message was sent successfully." });
      setComposing(false);
      setToUserId(""); setSubject(""); setBody("");
    } catch {
      toast({ title: lang === "ar" ? "خطأ" : "Error", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const unread = inbox.filter((m) => !m.isRead).length;

  return (
    <DashboardLayout title={t.messages}>
      <div className="grid lg:grid-cols-3 gap-4 min-h-[60vh]">
        {/* Inbox list */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">{lang === "ar" ? "الوارد" : "Inbox"}</span>
              {unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {unread}
                </span>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={() => setComposing(true)} className="gap-1 text-xs">
              <Send className="h-3 w-3" />
              {lang === "ar" ? "رسالة جديدة" : "Compose"}
            </Button>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">{t.loading}</div>
            ) : inbox.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">{t.noData}</div>
            ) : inbox.map((msg) => (
              <button
                key={msg.id}
                onClick={() => markRead(msg)}
                className={cn(
                  "w-full text-right p-4 border-b border-border transition-colors hover:bg-accent",
                  selected?.id === msg.id && "bg-primary/5",
                  !msg.isRead && "bg-secondary/30",
                )}
              >
                <div className="flex items-start gap-2">
                  {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm truncate", !msg.isRead ? "font-semibold text-foreground" : "text-muted-foreground")}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(msg.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message detail or compose */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          {composing ? (
            <div className="space-y-4 animate-fade-in">
              <h2 className="font-semibold">{lang === "ar" ? "رسالة جديدة" : "New Message"}</h2>
              <div>
                <Label>{lang === "ar" ? "معرّف المستلم" : "Recipient ID"}</Label>
                <Input value={toUserId} onChange={(e) => setToUserId(e.target.value)} placeholder="user_..." className="mt-1" />
              </div>
              <div>
                <Label>{lang === "ar" ? "الموضوع" : "Subject"}</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>{lang === "ar" ? "الرسالة" : "Message"}</Label>
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="mt-1" />
              </div>
              <div className="flex gap-2">
                <Button onClick={sendMessage} disabled={sending} className="gap-2">
                  <Send className="h-4 w-4" />
                  {lang === "ar" ? "إرسال" : "Send"}
                </Button>
                <Button variant="outline" onClick={() => setComposing(false)}>{t.cancel}</Button>
              </div>
            </div>
          ) : selected ? (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-foreground">{selected.subject}</h2>
                {selected.isRead && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(selected.createdAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
              </div>
              <div className="p-4 bg-secondary/30 rounded-xl text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {selected.body}
              </div>
              <Button variant="outline" size="sm" onClick={() => { setComposing(true); setToUserId(selected.fromUserId); }}>
                {lang === "ar" ? "رد" : "Reply"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">{lang === "ar" ? "اختر رسالة لعرضها" : "Select a message to view"}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
