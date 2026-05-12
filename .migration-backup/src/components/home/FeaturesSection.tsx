import { BookOpen, Clock, Shield, Headphones } from "lucide-react";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";

const features = [
  {
    icon: BookOpen,
    title: "مناهج متطورة",
    description: "مقررات دراسية حديثة مصممة وفق أحدث المعايير التعليمية العالمية.",
  },
  {
    icon: Clock,
    title: "تعلم في أي وقت",
    description: "الوصول إلى المحتوى التعليمي على مدار الساعة من أي مكان.",
  },
  {
    icon: Shield,
    title: "بيئة آمنة",
    description: "منصة آمنة ومحمية توفر بيئة تعليمية مناسبة للجميع.",
  },
  {
    icon: Headphones,
    title: "دعم متواصل",
    description: "فريق دعم متخصص لمساعدة الطلاب والمعلمين في أي وقت.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            لماذا مدرسة نصر الدين؟
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            نقدم لكم تجربة تعليمية متميزة تجمع بين الجودة والسهولة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <AppCard key={index} hover className="text-center">
              <AppCardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 mb-4 mx-auto">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <AppCardTitle>{feature.title}</AppCardTitle>
                <AppCardDescription>{feature.description}</AppCardDescription>
              </AppCardHeader>
            </AppCard>
          ))}
        </div>
      </div>
    </section>
  );
}
