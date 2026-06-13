import { HelpCircle } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/contexts/LanguageContext";
import { FAQS } from "@/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppCard } from "@/components/common/AppCard";

const FAQ = () => {
  const { lang } = useLang();
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {lang === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "ar"
                ? "إليك إجابات على أكثر الأسئلة شيوعاً. إذا لم تجد إجابة سؤالك، لا تتردد في التواصل معنا"
                : "Here are answers to the most common questions. If you don't find your answer, feel free to contact us"}
            </p>
          </div>

          {/* FAQ Accordion */}
          <AppCard>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-right hover:no-underline">
                    <span className="text-foreground font-medium">
                      {lang === "ar" ? faq.questionAr : faq.questionEn}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {lang === "ar" ? faq.answerAr : faq.answerEn}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AppCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
