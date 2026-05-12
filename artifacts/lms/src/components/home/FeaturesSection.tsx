import { BookOpen, Clock, Shield, Headphones, GraduationCap, Users, Calendar, MessageSquare } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const features = [
  {
    icon: BookOpen,
    titleAr: "مناهج متطورة", titleEn: "Advanced Curriculum",
    descAr: "مقررات دراسية حديثة مصممة وفق أحدث المعايير التعليمية العالمية.",
    descEn: "Modern courses designed according to the latest global educational standards.",
    color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", glow: "group-hover:shadow-blue-100",
  },
  {
    icon: Clock,
    titleAr: "تعلم في أي وقت", titleEn: "Learn Anytime",
    descAr: "الوصول إلى المحتوى التعليمي على مدار الساعة من أي مكان.",
    descEn: "Access educational content around the clock from anywhere.",
    color: "text-green-600", bg: "bg-green-50", border: "border-green-200", glow: "group-hover:shadow-green-100",
  },
  {
    icon: GraduationCap,
    titleAr: "لوحة تحكم المعلم", titleEn: "Teacher Dashboard",
    descAr: "أدوات متكاملة للمعلمين لإنشاء الدروس والواجبات ومتابعة الطلاب.",
    descEn: "Comprehensive tools for teachers to create lessons, assignments and track students.",
    color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", glow: "group-hover:shadow-primary/10",
  },
  {
    icon: Users,
    titleAr: "بوابة أولياء الأمور", titleEn: "Parent Portal",
    descAr: "متابعة أداء الأبناء والتواصل المباشر مع المعلمين بكل سهولة.",
    descEn: "Track children's performance and communicate directly with teachers easily.",
    color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", glow: "group-hover:shadow-purple-100",
  },
  {
    icon: Calendar,
    titleAr: "الجدول الدراسي", titleEn: "Class Schedule",
    descAr: "نظام جدول متكامل للحصص والامتحانات والفعاليات الدراسية.",
    descEn: "Comprehensive scheduling for classes, exams, and academic events.",
    color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", glow: "group-hover:shadow-orange-100",
  },
  {
    icon: Shield,
    titleAr: "بيئة آمنة", titleEn: "Safe Environment",
    descAr: "منصة آمنة ومحمية توفر بيئة تعليمية مناسبة للجميع.",
    descEn: "A secure and protected platform providing a safe learning environment for all.",
    color: "text-red-600", bg: "bg-red-50", border: "border-red-200", glow: "group-hover:shadow-red-100",
  },
  {
    icon: MessageSquare,
    titleAr: "تواصل مباشر", titleEn: "Direct Communication",
    descAr: "نظام رسائل داخلي يربط الطلاب والمعلمين وأولياء الأمور.",
    descEn: "Internal messaging system connecting students, teachers, and parents.",
    color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200", glow: "group-hover:shadow-pink-100",
  },
  {
    icon: Headphones,
    titleAr: "دعم متواصل", titleEn: "Continuous Support",
    descAr: "فريق دعم متخصص لمساعدة الطلاب والمعلمين في أي وقت.",
    descEn: "Specialized support team to help students and teachers at any time.",
    color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", glow: "group-hover:shadow-teal-100",
  },
];

export function FeaturesSection() {
  const { t, lang } = useLang();
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />

      <div className="container relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
            <GraduationCap className="h-4 w-4" />
            {lang === "ar" ? "مميزاتنا" : "Our Features"}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t.features}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t.featuresDesc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in cursor-default overflow-hidden`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Subtle hover background */}
              <div className={`absolute inset-0 ${feature.bg} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />

              <div className={`relative w-12 h-12 rounded-xl border ${feature.bg} ${feature.border} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className={`relative font-semibold text-foreground mb-2 text-base group-hover:${feature.color} transition-colors`}>
                {lang === "ar" ? feature.titleAr : feature.titleEn}
              </h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">
                {lang === "ar" ? feature.descAr : feature.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
