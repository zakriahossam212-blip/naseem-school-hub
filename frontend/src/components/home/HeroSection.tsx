import { Link } from "react-router-dom";
import { ArrowLeft, Play, Sparkles, GraduationCap, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import { HERO_STATS } from "@/data";
import heroImg from "@/assets/hero-school.jpg";

export function HeroSection() {
  const { t, lang } = useLang();
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Dot-grid background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/6 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Content ── */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              {lang === "ar" ? "منصة تعليمية معتمدة" : "Certified Educational Platform"}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5 animate-slide-up" style={{ animationDelay: "100ms" }}>
              {t.heroTitle}
              <span className="block mt-2 bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent">{t.heroSubtitle}</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: "200ms" }}>
              {t.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <Link to="/auth">
                <Button size="lg" className="gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 px-8">
                  {t.startLearning}
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <Play className="h-4 w-4 fill-current" />
                  {t.learnMore}
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
              {[
                { icon: GraduationCap, label: lang === "ar" ? "شهادات معتمدة" : "Certified" },
                { icon: Users, label: lang === "ar" ? "مجتمع نشط" : "Active Community" },
                { icon: Award, label: lang === "ar" ? "معلمون متميزون" : "Expert Teachers" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <b.icon className="h-3.5 w-3.5 text-primary" />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Image ── */}
          <div className="relative order-1 lg:order-2 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 to-primary/5 rounded-3xl blur-2xl" aria-hidden />
            <div className="relative">
              <img
                src={heroImg}
                alt={lang === "ar" ? "طلاب في فصل دراسي بمدرسة نصر الدين" : "Students at Nasr El-Din School"}
                width={1536}
                height={1024}
                className="relative rounded-2xl border border-border shadow-2xl w-full h-auto object-cover aspect-[4/3]"
                loading="eager"
              />

              {/* Floating card — bottom right */}
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl p-3 shadow-xl hidden sm:flex items-center gap-2.5 animate-float">
                <div className="w-9 h-9 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">+500</p>
                  <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "طالب نشط" : "Active students"}</p>
                </div>
              </div>

              {/* Floating card — top left */}
              <div className="absolute -top-4 -left-4 bg-card border border-border rounded-xl p-3 shadow-xl hidden sm:flex items-center gap-2.5 animate-float" style={{ animationDelay: "1s" }}>
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">+50</p>
                  <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "مقرر متاح" : "Courses available"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-4 mt-14">
          {HERO_STATS.map((stat, i) => (
            <div
              key={i}
              className="relative bg-card border border-border rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-in overflow-hidden group"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`relative inline-flex items-center justify-center w-11 h-11 rounded-xl border mb-3 ${stat.border} ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className={`relative text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="relative text-xs text-muted-foreground font-medium">{lang === "ar" ? stat.labelAr : stat.labelEn}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
