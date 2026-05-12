import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: t.home },
    { href: "/courses", label: t.courses },
    { href: "/teachers", label: t.teachers },
    { href: "/about", label: t.about },
  ];

  const supportLinks = [
    { href: "/faq", label: lang === "ar" ? "الأسئلة الشائعة" : "FAQ" },
    { href: "/help", label: lang === "ar" ? "مركز المساعدة" : "Help Center" },
    { href: "/contact", label: t.contact },
    { href: "/privacy", label: lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy" },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm group-hover:blur-md transition-all" />
                <img src={logo} alt={t.schoolName} className="relative h-9 w-9 object-contain rounded-lg" />
              </div>
              <span className="text-base font-bold text-foreground">{t.schoolName}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {lang === "ar"
                ? "منصة تعليمية متكاملة تهدف إلى توفير تجربة تعلم حديثة ومتطورة للطلاب والمعلمين وأولياء الأمور."
                : "A comprehensive educational platform providing a modern learning experience for students, teachers, and parents."}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">{lang === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">{lang === "ar" ? "الدعم" : "Support"}</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">{lang === "ar" ? "تواصل معنا" : "Contact Us"}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>info@nasreldin.edu</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{lang === "ar" ? "القاهرة، مصر" : "Cairo, Egypt"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            © {year} {t.schoolName}. {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            {lang === "ar" ? "صُنع بـ" : "Made with"}
            <Heart className="h-3.5 w-3.5 text-destructive fill-destructive mx-0.5" />
            {lang === "ar" ? "للتعليم" : "for education"}
          </p>
        </div>
      </div>
    </footer>
  );
}
