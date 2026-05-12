import { ArrowLeft, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription, AppCardContent, AppCardFooter } from "@/components/common/AppCard";
import mathImg from "@/assets/course-math.jpg";
import arabicImg from "@/assets/course-arabic.jpg";
import scienceImg from "@/assets/course-science.jpg";
import englishImg from "@/assets/course-english.jpg";

const courses = [
  {
    title: "الرياضيات",
    description: "أساسيات الرياضيات والجبر والهندسة للمراحل المختلفة.",
    students: 120,
    duration: "12 أسبوع",
    image: mathImg,
  },
  {
    title: "اللغة العربية",
    description: "قواعد اللغة العربية والنحو والصرف والأدب.",
    students: 150,
    duration: "16 أسبوع",
    image: arabicImg,
  },
  {
    title: "العلوم",
    description: "الفيزياء والكيمياء والأحياء بأسلوب تفاعلي وممتع.",
    students: 95,
    duration: "14 أسبوع",
    image: scienceImg,
  },
  {
    title: "اللغة الإنجليزية",
    description: "تعلم اللغة الإنجليزية من المستوى المبتدئ إلى المتقدم.",
    students: 180,
    duration: "20 أسبوع",
    image: englishImg,
  },
];

export function CoursesSection() {
  return (
    <section className="py-16">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              المقررات الدراسية
            </h2>
            <p className="text-muted-foreground">
              اكتشف مجموعة متنوعة من المقررات التعليمية
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            عرض الكل
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <AppCard key={index} hover>
              <AppCardHeader>
                <div className="w-full h-32 rounded-lg overflow-hidden border border-border mb-4 shadow-depth-sm">
                  <img
                    src={course.image}
                    alt={course.title}
                    width={800}
                    height={512}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
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
                <Button variant="outline" size="sm" className="w-full">
                  عرض المقرر
                </Button>
              </AppCardFooter>
            </AppCard>
          ))}
        </div>
      </div>
    </section>
  );
}
