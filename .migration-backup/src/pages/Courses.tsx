import { Users, Clock, Search } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription, AppCardContent, AppCardFooter } from "@/components/common/AppCard";
import mathImg from "@/assets/course-math.jpg";
import arabicImg from "@/assets/course-arabic.jpg";
import scienceImg from "@/assets/course-science.jpg";
import englishImg from "@/assets/course-english.jpg";
import historyImg from "@/assets/course-history.jpg";
import geographyImg from "@/assets/course-geography.jpg";

const allCourses = [
  { title: "الرياضيات", description: "أساسيات الرياضيات والجبر والهندسة للمراحل المختلفة.", students: 120, duration: "12 أسبوع", level: "متوسط", image: mathImg },
  { title: "اللغة العربية", description: "قواعد اللغة العربية والنحو والصرف والأدب.", students: 150, duration: "16 أسبوع", level: "جميع المستويات", image: arabicImg },
  { title: "العلوم", description: "الفيزياء والكيمياء والأحياء بأسلوب تفاعلي وممتع.", students: 95, duration: "14 أسبوع", level: "متقدم", image: scienceImg },
  { title: "اللغة الإنجليزية", description: "تعلم اللغة الإنجليزية من المستوى المبتدئ إلى المتقدم.", students: 180, duration: "20 أسبوع", level: "مبتدئ", image: englishImg },
  { title: "التاريخ", description: "دراسة التاريخ العربي والإسلامي والحضارات القديمة.", students: 75, duration: "10 أسبوع", level: "متوسط", image: historyImg },
  { title: "الجغرافيا", description: "استكشاف العالم من خلال دراسة الجغرافيا الطبيعية والبشرية.", students: 60, duration: "8 أسبوع", level: "مبتدئ", image: geographyImg },
];

const Courses = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 py-12">
        <div className="container">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-4">المقررات الدراسية</h1>
            <p className="text-muted-foreground max-w-2xl">
              اكتشف مجموعة متنوعة من المقررات التعليمية المصممة لتناسب جميع المراحل الدراسية
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن مقرر..."
                className="pr-10"
              />
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course, index) => (
              <AppCard key={index} hover>
                <AppCardHeader>
                  <div className="w-full h-40 rounded-lg overflow-hidden border border-border mb-4 shadow-depth-sm">
                    <img
                      src={course.image}
                      alt={course.title}
                      width={800}
                      height={512}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {course.level}
                    </span>
                  </div>
                  <AppCardTitle>{course.title}</AppCardTitle>
                  <AppCardDescription>{course.description}</AppCardDescription>
                </AppCardHeader>
                <AppCardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students} طالب</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </AppCardContent>
                <AppCardFooter>
                  <Button className="w-full">
                    التسجيل في المقرر
                  </Button>
                </AppCardFooter>
              </AppCard>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
