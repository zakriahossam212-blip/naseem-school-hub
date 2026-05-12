import { ArrowLeft, BookOpen, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-school.jpg";

export function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border shadow-depth-sm mb-6">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              منصة تعليمية معتمدة
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            مرحباً بكم في
            <span className="text-primary block mt-2">مدرسة نصر الدين</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
            منصة تعليمية متكاملة تجمع بين الطلاب والمعلمين في بيئة تعليمية حديثة ومتطورة.
            نقدم لكم تجربة تعلم فريدة مع أفضل المناهج التعليمية.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              ابدأ التعلم الآن
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              تعرف علينا
            </Button>
          </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute -inset-2 bg-primary/10 rounded-2xl blur-2xl" aria-hidden />
            <img
              src={heroImg}
              alt="طلاب في فصل دراسي بمدرسة نصر الدين"
              width={1536}
              height={1024}
              className="relative rounded-2xl border border-border shadow-card-hover w-full h-auto object-cover"
            />
          </div>
        </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16">
            <div className="p-4 rounded-lg bg-card border border-border shadow-card">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">+50</div>
              <div className="text-sm text-muted-foreground">مقرر دراسي</div>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border shadow-card">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">+500</div>
              <div className="text-sm text-muted-foreground">طالب مسجل</div>
            </div>
            <div className="col-span-2 md:col-span-1 p-4 rounded-lg bg-card border border-border shadow-card">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">+30</div>
              <div className="text-sm text-muted-foreground">معلم متميز</div>
            </div>
          </div>
      </div>
    </section>
  );
}
