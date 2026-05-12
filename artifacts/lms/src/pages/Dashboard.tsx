import { Link } from "react-router-dom";
import { BookOpen, FileText, GraduationCap, ChevronLeft, Calendar, BookMarked, Users, MessageSquare, ClipboardList, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface QuickCard { title: string; desc: string; icon: React.ElementType; href: string; color: string; }

export default function Dashboard() {
  const { fullName, isTeacher, isParent, isAdmin } = useAuth();
  const { t, lang } = useLang();

  const studentCards: QuickCard[] = [
    { title: t.courses, desc: lang === "ar" ? "تصفح المقررات المتاحة" : "Browse available courses", icon: BookOpen, href: "/dashboard/courses", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { title: t.assignments, desc: lang === "ar" ? "تسليم ومتابعة الواجبات" : "Submit and track assignments", icon: FileText, href: "/dashboard/assignments", color: "bg-orange-50 text-orange-600 border-orange-200" },
    { title: t.grades, desc: lang === "ar" ? "درجاتك وملاحظات المعلمين" : "Your grades and feedback", icon: GraduationCap, href: "/dashboard/grades", color: "bg-green-50 text-green-600 border-green-200" },
    { title: t.schedule, desc: lang === "ar" ? "جدول الحصص والامتحانات" : "Class and exam schedule", icon: Calendar, href: "/dashboard/schedule", color: "bg-purple-50 text-purple-600 border-purple-200" },
    { title: t.messages, desc: lang === "ar" ? "التواصل مع المعلمين" : "Communicate with teachers", icon: MessageSquare, href: "/messages", color: "bg-pink-50 text-pink-600 border-pink-200" },
  ];

  const teacherCards: QuickCard[] = [
    { title: t.myCourses, desc: lang === "ar" ? "إدارة مقرراتك والدروس" : "Manage your courses and lessons", icon: BookMarked, href: "/teacher/courses", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { title: lang === "ar" ? "تصحيح الواجبات" : "Grade Assignments", desc: lang === "ar" ? "تصحيح ومنح الدرجات" : "Review and grade submissions", icon: ClipboardList, href: "/teacher/grades", color: "bg-orange-50 text-orange-600 border-orange-200" },
    { title: t.schedule, desc: lang === "ar" ? "إدارة جدول الحصص" : "Manage class schedule", icon: Calendar, href: "/dashboard/schedule", color: "bg-purple-50 text-purple-600 border-purple-200" },
    { title: t.messages, desc: lang === "ar" ? "التواصل مع الطلاب وأولياء الأمور" : "Communicate with students and parents", icon: MessageSquare, href: "/messages", color: "bg-pink-50 text-pink-600 border-pink-200" },
  ];

  const parentCards: QuickCard[] = [
    { title: t.myStudents, desc: lang === "ar" ? "متابعة أداء أبنائك" : "Track your children's performance", icon: Users, href: "/parent", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { title: t.schedule, desc: lang === "ar" ? "جدول المواعيد والامتحانات" : "Class and exam schedule", icon: Calendar, href: "/dashboard/schedule", color: "bg-purple-50 text-purple-600 border-purple-200" },
    { title: t.messages, desc: lang === "ar" ? "تواصل مع المعلمين" : "Contact teachers", icon: MessageSquare, href: "/messages", color: "bg-pink-50 text-pink-600 border-pink-200" },
  ];

  const cards = isTeacher ? teacherCards : isParent ? parentCards : studentCards;
  const greeting = fullName?.split(" ")[0] || (lang === "ar" ? "بكم" : "there");
  const roleDesc = isTeacher
    ? (lang === "ar" ? "إدارة المقررات والواجبات والتصحيح" : "Manage courses, assignments and grading")
    : isParent
    ? (lang === "ar" ? "متابعة أداء أبنائك الدراسي" : "Track your children's academic performance")
    : (lang === "ar" ? "متابعة دراستك وواجباتك ودرجاتك" : "Track your studies, assignments and grades");

  return (
    <DashboardLayout>
      {/* Welcome banner */}
      <div className="bg-gradient-to-l from-primary/5 via-primary/8 to-primary/12 border border-primary/20 rounded-2xl p-6 mb-8 animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            {lang === "ar" ? `مرحباً، ${greeting}!` : `Welcome, ${greeting}!`}
          </h1>
          <p className="text-muted-foreground">{roleDesc}</p>
        </div>
      </div>

      {/* Quick access grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <Link
            key={card.href}
            to={card.href}
            className="group bg-card border border-border rounded-2xl p-5 shadow-card hover-lift animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center mb-4", card.color)}>
              <card.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{card.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
              {lang === "ar" ? "فتح" : "Open"}
              <ChevronLeft className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
