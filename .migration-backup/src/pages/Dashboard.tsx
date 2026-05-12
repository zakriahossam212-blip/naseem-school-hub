import { Link } from "react-router-dom";
import { BookOpen, FileText, GraduationCap, ChevronLeft } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { AppCard, AppCardTitle, AppCardDescription } from "@/components/common/AppCard";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

const Dashboard = () => {
  const { user } = useAuth();
  const { primaryRole } = useUserRole();

  const items = [
    { title: "المقررات", description: primaryRole === "teacher" ? "إدارة مقرراتك" : "تصفح وتسجيل المقررات", icon: BookOpen, href: "/dashboard/courses" },
    { title: "الواجبات", description: primaryRole === "teacher" ? "إنشاء وتصحيح الواجبات" : "تسليم الواجبات ومتابعتها", icon: FileText, href: "/dashboard/assignments" },
    ...(primaryRole === "student"
      ? [{ title: "درجاتي", description: "عرض الدرجات والملاحظات", icon: GraduationCap, href: "/dashboard/grades" }]
      : []),
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          مرحباً، {user?.user_metadata?.full_name || "بكم"}! 👋
        </h1>
        <p className="text-muted-foreground">
          {primaryRole === "teacher" ? "إدارة المقررات والواجبات والتصحيح" : "متابعة دراستك وواجباتك ودرجاتك"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link key={item.href} to={item.href}>
            <AppCard hover className="h-full cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <AppCardTitle>{item.title}</AppCardTitle>
              <AppCardDescription>{item.description}</AppCardDescription>
              <span className="inline-flex items-center gap-1 text-sm text-primary mt-4">
                فتح <ChevronLeft className="h-4 w-4" />
              </span>
            </AppCard>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
