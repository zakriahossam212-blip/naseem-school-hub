import { GraduationCap } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { FEATURES } from "@/data";

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
          {FEATURES.map((feature, i) => (
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
