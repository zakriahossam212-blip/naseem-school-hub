import { Target, Eye, Heart, CheckCircle } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";
import schoolImg from "@/assets/about-school.jpg";

const values = [
  {
    icon: Target,
    title: "رسالتنا",
    description: "تقديم تعليم عالي الجودة يمكّن الطلاب من تحقيق إمكاناتهم الكاملة في بيئة تعليمية محفزة ومبتكرة.",
  },
  {
    icon: Eye,
    title: "رؤيتنا",
    description: "أن نكون المؤسسة التعليمية الرائدة في المنطقة، ونموذجًا للتميز الأكاديمي والتربوي.",
  },
  {
    icon: Heart,
    title: "قيمنا",
    description: "النزاهة، التميز، الابتكار، الاحترام المتبادل، والالتزام بالتطوير المستمر.",
  },
];

const achievements = [
  "أكثر من 20 عامًا من الخبرة في مجال التعليم",
  "نسبة نجاح تتجاوز 98% في الامتحانات الوطنية",
  "شراكات مع مؤسسات تعليمية دولية",
  "برامج تطوير مهني مستمرة للمعلمين",
  "بنية تحتية تقنية متطورة",
  "أنشطة لا صفية متنوعة",
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 py-12">
        <div className="container">
          {/* School Image */}
          <div className="relative max-w-5xl mx-auto mb-12 rounded-2xl overflow-hidden border border-border shadow-card-hover">
            <img
              src={schoolImg}
              alt="مبنى مدرسة نصر الدين"
              width={1280}
              height={896}
              loading="lazy"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          {/* Page Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              عن مدرسة نصر الدين
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              مدرسة نصر الدين هي مؤسسة تعليمية رائدة تأسست بهدف توفير تعليم متميز يجمع بين الأصالة والمعاصرة.
              نحن ملتزمون بتطوير جيل قادر على مواجهة تحديات المستقبل.
            </p>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {values.map((item, index) => (
              <AppCard key={index} className="text-center">
                <AppCardHeader>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 mb-4 mx-auto">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <AppCardTitle className="text-xl">{item.title}</AppCardTitle>
                  <AppCardDescription className="text-base leading-relaxed">
                    {item.description}
                  </AppCardDescription>
                </AppCardHeader>
              </AppCard>
            ))}
          </div>

          {/* Achievements */}
          <div className="bg-card rounded-lg border border-border p-8 shadow-card">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              إنجازاتنا
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-card-foreground">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
