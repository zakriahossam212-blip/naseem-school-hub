import { HelpCircle, ChevronDown } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppCard } from "@/components/common/AppCard";

const faqs = [
  {
    question: "كيف يمكنني التسجيل في مدرسة نصر الدين؟",
    answer: "يمكنك التسجيل بسهولة من خلال الضغط على زر 'إنشاء حساب' في الصفحة الرئيسية، ثم إدخال بياناتك الشخصية والبريد الإلكتروني وكلمة المرور. بعد التسجيل، يمكنك الوصول إلى جميع المقررات المتاحة.",
  },
  {
    question: "هل المقررات مجانية؟",
    answer: "نعم، جميع المقررات الأساسية متاحة مجاناً للطلاب المسجلين. قد تتوفر بعض المقررات المتقدمة مقابل رسوم رمزية.",
  },
  {
    question: "كيف يمكنني التواصل مع المعلمين؟",
    answer: "يمكنك التواصل مع المعلمين من خلال نظام الرسائل الداخلي في لوحة التحكم الخاصة بك، أو من خلال قسم التعليقات في كل درس.",
  },
  {
    question: "هل يمكنني الوصول للمحتوى من الهاتف المحمول؟",
    answer: "نعم، منصتنا متوافقة تماماً مع جميع الأجهزة بما فيها الهواتف المحمولة والأجهزة اللوحية. يمكنك التعلم في أي وقت ومن أي مكان.",
  },
  {
    question: "كيف أحصل على شهادة إتمام المقرر؟",
    answer: "بعد إكمال جميع الدروس والاختبارات بنجاح، ستحصل تلقائياً على شهادة إتمام يمكنك تحميلها وطباعتها.",
  },
  {
    question: "ماذا أفعل إذا نسيت كلمة المرور؟",
    answer: "يمكنك استخدام خيار 'نسيت كلمة المرور' في صفحة تسجيل الدخول، وسيتم إرسال رابط لإعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
  },
  {
    question: "هل يوجد دعم فني متاح؟",
    answer: "نعم، فريق الدعم الفني متاح من الأحد إلى الخميس من الساعة 8 صباحاً حتى 4 مساءً. يمكنك التواصل معنا عبر صفحة 'تواصل معنا' أو البريد الإلكتروني.",
  },
  {
    question: "هل يمكن لأولياء الأمور متابعة تقدم أبنائهم؟",
    answer: "نعم، نوفر بوابة خاصة لأولياء الأمور تمكنهم من متابعة تقدم أبنائهم والتواصل مع المعلمين والاطلاع على الدرجات والحضور.",
  },
];

const FAQ = () => {
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
            <h1 className="text-3xl font-bold text-foreground mb-4">الأسئلة الشائعة</h1>
            <p className="text-muted-foreground">
              إليك إجابات على أكثر الأسئلة شيوعاً. إذا لم تجد إجابة سؤالك، لا تتردد في التواصل معنا
            </p>
          </div>

          {/* FAQ Accordion */}
          <AppCard>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-right hover:no-underline">
                    <span className="text-foreground font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
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
