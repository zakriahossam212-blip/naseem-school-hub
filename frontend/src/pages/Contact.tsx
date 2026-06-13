import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_DETAILS } from "@/data";
import { useLang } from "@/contexts/LanguageContext";

const Contact = () => {
  const { lang } = useLang();
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
      title: lang === "ar" ? "تم إرسال الرسالة!" : "Message Sent!",
      description: lang === "ar" ? "سنتواصل معك في أقرب وقت ممكن" : "We'll contact you as soon as possible",
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
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "ar"
                ? "نحن هنا للإجابة على استفساراتكم ومساعدتكم. لا تترددوا في التواصل معنا"
                : "We're here to answer your questions and help you. Feel free to contact us"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <AppCard>
              <AppCardHeader>
                <AppCardTitle className="text-xl">
                  {lang === "ar" ? "أرسل رسالة" : "Send a Message"}
                </AppCardTitle>
                <AppCardDescription>
                  {lang === "ar"
                    ? "املأ النموذج التالي وسنرد عليك في أقرب وقت"
                    : "Fill out the form below and we'll get back to you soon"}
                </AppCardDescription>
              </AppCardHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{lang === "ar" ? "الاسم" : "Name"}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === "ar" ? "أدخل اسمك" : "Enter your name"}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
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
                  <Label htmlFor="subject">{lang === "ar" ? "الموضوع" : "Subject"}</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={lang === "ar" ? "موضوع الرسالة" : "Message subject"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{lang === "ar" ? "الرسالة" : "Message"}</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={lang === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="h-4 w-4 ml-2" />
                  {loading ? (lang === "ar" ? "جاري الإرسال..." : "Sending...") : (lang === "ar" ? "إرسال الرسالة" : "Send Message")}
                </Button>
              </form>
            </AppCard>

            {/* Contact Info */}
            <div className="space-y-6">
              {CONTACT_DETAILS.map((item, index) => (
                <AppCard key={index} hover>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {lang === "ar" ? item.titleAr : item.titleEn}
                      </h3>
                      <p className="text-foreground mt-1">{item.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {lang === "ar" ? item.descriptionAr : item.descriptionEn}
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
