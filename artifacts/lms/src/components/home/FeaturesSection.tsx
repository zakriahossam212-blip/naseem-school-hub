import { BookOpen, Clock, Shield, Headphones, GraduationCap, Users, Calendar, MessageSquare } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const features = [
  {
    icon: BookOpen,
    titleAr: "مناهج متطورة", titleEn: "Advanced Curriculum",
    descAr: "مقررات دراسية حديثة مصممة وفق أحدث المعايير التعليمية العالمية.",
    descEn: "Modern courses designed according to the latest global educational standards.",
    color: "bg-blue-50 border-blue-200 text-blue-600",
  },
  {
    icon: Clock,
    titleAr: "تعلم في أي وقت", titleEn: "Learn Anytime",
    descAr: "الوصول إلى المحتوى التعليمي على مدار الساعة من أي مكان.",
    descEn: "Access educational content around the clock from anywhere.",
    color: "bg-green-50 border-green-200 text-green-600",
  },
  {
    icon: GraduationCap,
    titleAr: "لوحة تحكم المعلم", titleEn: "Teacher Dashboard",
    descAr: "أدوات متكاملة للمعلمين لإنشاء الدروس والواجبات ومتابعة الطلاب.",
    descEn: "Comprehensive tools for teachers to create lessons, assignments, and track students.",
    color: "bg-primary/10 border-primary/20 text-primary",
  },
  {
    icon: Users,
    titleAr: "بوابة أولياء الأمور", titleEn: "Parent Portal",
    descAr: "متابعة أداء الأبناء والتواصل المباشر مع المعلمين بكل سهولة.",
    descEn: "Track children's performance and communicate directly with teachers easily.",
    color: "bg-purple-50 border-purple-200 text-purple-600",
  },
  {
    icon: Calendar,
    titleAr: "الجدول الدراسي", titleEn: "Class Schedule",
    descAr: "نظام جدول متكامل للحصص والامتحانات والفعاليات الدراسية.",
    descEn: "Comprehensive scheduling for classes, exams, and academic events.",
    color: "bg-orange-50 border-orange-200 text-orange-600",
  },
  {
    icon: Shield,
    titleAr: "بيئة آمنة", titleEn: "Safe Environment",
    descAr: "منصة آمنة ومحمية توفر بيئة تعليمية مناسبة للجميع.",
    descEn: "A secure and protected platform providing a safe learning environment for all.",
    color: "bg-red-50 border-red-200 text-red-600",
  },
  {
    icon: MessageSquare,
    titleAr: "تواصل مباشر", titleEn: "Direct Communication",
    descAr: "نظام رسائل داخلي يربط الطلاب والمعلمين وأولياء الأمور.",
    descEn: "Internal messaging system connecting students, teachers, and parents.",
    color: "bg-pink-50 border-pink-200 text-pink-600",
  },
  {
    icon: Headphones,
    titleAr: "دعم متواصل", titleEn: "Continuous Support",
    descAr: "فريق دعم متخصص لمساعدة الطلاب والمعلمين في أي وقت.",
    descEn: "Specialized support team to help students and teachers at any time.",
    color: "bg-teal-50 border-teal-200 text-teal-600",
  },
];

export function FeaturesSection() {
  const { t, lang } = useLang();
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <GraduationCap className="h-4 w-4" />
            {lang === "ar" ? "مميزاتنا" : "Our Features"}
          </div>
          <h2 className="section-title">{t.features}</h2>
          <p className="section-desc">{t.featuresDesc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card group animate-fade-in"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-base">
                {lang === "ar" ? feature.titleAr : feature.titleEn}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lang === "ar" ? feature.descAr : feature.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
