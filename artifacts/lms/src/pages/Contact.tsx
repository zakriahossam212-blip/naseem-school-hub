import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Phone,
    title: "الهاتف",
    value: "+20 123 456 7890",
    description: "متاحون من 8 صباحاً - 4 مساءً",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    value: "info@nasreldin-school.com",
    description: "نرد خلال 24 ساعة",
  },
  {
    icon: MapPin,
    title: "العنوان",
    value: "القاهرة، مصر",
    description: "شارع التعليم، المنطقة التعليمية",
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    value: "الأحد - الخميس",
    description: "8:00 ص - 4:00 م",
  },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "تم إرسال الرسالة!",
      description: "سنتواصل معك في أقرب وقت ممكن",
    });

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 py-12">
        <div className="container">
          {/* Page Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">تواصل معنا</h1>
            <p className="text-muted-foreground">
              نحن هنا للإجابة على استفساراتكم ومساعدتكم. لا تترددوا في التواصل معنا
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <AppCard>
              <AppCardHeader>
                <AppCardTitle className="text-xl">أرسل رسالة</AppCardTitle>
                <AppCardDescription>
                  املأ النموذج التالي وسنرد عليك في أقرب وقت
                </AppCardDescription>
              </AppCardHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">الموضوع</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="موضوع الرسالة"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="h-4 w-4 ml-2" />
                  {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            </AppCard>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <AppCard key={index} hover>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-foreground mt-1">{item.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </AppCard>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
