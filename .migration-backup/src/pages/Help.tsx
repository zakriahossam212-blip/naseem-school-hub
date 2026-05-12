import { BookOpen, MessageSquare, FileQuestion, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";
import { Button } from "@/components/ui/button";

const helpTopics = [
  {
    icon: BookOpen,
    title: "دليل البدء",
    description: "تعرف على كيفية استخدام المنصة والبدء في التعلم",
    link: "/faq",
  },
  {
    icon: FileQuestion,
    title: "الأسئلة الشائعة",
    description: "إجابات على أكثر الأسئلة شيوعاً حول المنصة",
    link: "/faq",
  },
  {
    icon: MessageSquare,
    title: "تواصل معنا",
    description: "لديك سؤال محدد؟ تواصل مع فريق الدعم",
    link: "/contact",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    description: "راسلنا على info@nasreldin-school.com",
    link: "mailto:info@nasreldin-school.com",
  },
];

const Help = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">مركز المساعدة</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              نحن هنا لمساعدتك. اختر من الخيارات أدناه أو تواصل معنا مباشرة
            </p>
          </div>

          {/* Help Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {helpTopics.map((topic, index) => (
              <Link key={index} to={topic.link}>
                <AppCard hover className="h-full">
                  <AppCardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <topic.icon className="h-6 w-6 text-primary" />
                    </div>
                    <AppCardTitle>{topic.title}</AppCardTitle>
                    <AppCardDescription>{topic.description}</AppCardDescription>
                  </AppCardHeader>
                </AppCard>
              </Link>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="bg-card rounded-lg border border-border p-8 shadow-card text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">
              لا تزال بحاجة للمساعدة؟
            </h2>
            <p className="text-muted-foreground mb-6">
              فريقنا جاهز للإجابة على جميع استفساراتك
            </p>
            <Link to="/contact">
              <Button>
                <MessageSquare className="h-4 w-4 ml-2" />
                تواصل مع الدعم
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
