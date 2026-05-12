import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const quickLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/courses", label: "المقررات" },
  { href: "/teachers", label: "المعلمون" },
  { href: "/about", label: "عن المدرسة" },
];

const supportLinks = [
  { href: "/help", label: "مركز المساعدة" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/privacy", label: "سياسة الخصوصية" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="شعار مدرسة نصر الدين" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="text-lg font-bold text-foreground">
                مدرسة نصر الدين
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة تعليمية متكاملة تهدف إلى توفير تجربة تعلم حديثة ومتطورة للطلاب والمعلمين.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">الدعم</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@nasreldin-school.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} مدرسة نصر الدين. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
