import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";
import { Button } from "@/components/ui/button";
import { HELP_TOPICS } from "@/data";
import { useLang } from "@/contexts/LanguageContext";

const Help = () => {
  const { lang } = useLang();
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {lang === "ar" ? "مركز المساعدة" : "Help Center"}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {lang === "ar"
                ? "نحن هنا لمساعدتك. اختر من الخيارات أدناه أو تواصل معنا مباشرة"
                : "We're here to help you. Choose from the options below or contact us directly"}
            </p>
          </div>

          {/* Help Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {HELP_TOPICS.map((topic, index) => (
              <Link key={index} to={topic.link}>
                <AppCard hover className="h-full">
                  <AppCardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <topic.icon className="h-6 w-6 text-primary" />
                    </div>
                    <AppCardTitle>
                      {lang === "ar" ? topic.titleAr : topic.titleEn}
                    </AppCardTitle>
                    <AppCardDescription>
                      {lang === "ar" ? topic.descAr : topic.descEn}
                    </AppCardDescription>
                  </AppCardHeader>
                </AppCard>
              </Link>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="bg-card rounded-lg border border-border p-8 shadow-card text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">
              {lang === "ar" ? "لا تزال بحاجة للمساعدة؟" : "Still Need Help?"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === "ar"
                ? "فريقنا جاهز للإجابة على جميع استفساراتك"
                : "Our team is ready to answer all your questions"}
            </p>
            <Link to="/contact">
              <Button>
                <MessageSquare className="h-4 w-4 ml-2" />
                {lang === "ar" ? "تواصل مع الدعم" : "Contact Support"}
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
