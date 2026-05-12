import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Users, Award, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import heroImg from "@/assets/hero-school.jpg";

const stats = [
  { icon: BookOpen, valueKey: "coursesCount" as const, value: "+50", color: "text-blue-500" },
  { icon: Users, valueKey: "students" as const, value: "+500", color: "text-green-500" },
  { icon: Award, valueKey: "teachersCount" as const, value: "+30", color: "text-primary" },
];

export function HeroSection() {
  const { t, lang } = useLang();
  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              {lang === "ar" ? "منصة تعليمية معتمدة" : "Certified Educational Platform"}
            </div>

            {/* Heading */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              {t.heroTitle}
              <span className="gradient-text block mt-1">{t.heroSubtitle}</span>
            </h1>

            {/* Description */}
            <p
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              {t.heroDesc}
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link to="/auth">
                <Button size="lg" className="gap-2 w-full sm:w-auto shadow-depth-md hover:shadow-depth-lg transition-all pulse-glow">
                  {t.startLearning}
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <Play className="h-4 w-4" />
                  {t.learnMore}
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2 animate-fade-in-left" style={{ animationDelay: "150ms" }}>
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 to-primary/5 rounded-3xl blur-2xl" aria-hidden />
            <div className="relative">
              <img
                src={heroImg}
                alt={lang === "ar" ? "طلاب في فصل دراسي بمدرسة نصر الدين" : "Students in a classroom at Nasr El-Din School"}
                width={1536}
                height={1024}
                className="relative rounded-2xl border border-border shadow-depth-lg w-full h-auto object-cover"
                loading="eager"
              />
              {/* Floating cards */}
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl p-3 shadow-depth-md animate-float hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">+500</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "طالب نشط" : "Active students"}</p>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-card border border-border rounded-xl p-3 shadow-depth-md animate-float hidden sm:flex items-center gap-2" style={{ animationDelay: "1s" }}>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">+50</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "مقرر متاح" : "Courses available"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-5 text-center shadow-card hover-lift animate-fade-in"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-current/10 mb-3 ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{t[stat.valueKey]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
