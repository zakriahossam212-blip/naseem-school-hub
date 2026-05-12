import { ArrowLeft, Users, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription, AppCardContent, AppCardFooter } from "@/components/common/AppCard";
import { useLang } from "@/contexts/LanguageContext";
import mathImg from "@/assets/course-math.jpg";
import arabicImg from "@/assets/course-arabic.jpg";
import scienceImg from "@/assets/course-science.jpg";
import englishImg from "@/assets/course-english.jpg";

const courses = [
  {
    title: "الرياضيات",
    titleEn: "Mathematics",
    description: "أساسيات الرياضيات والجبر والهندسة للمراحل المختلفة.",
    descriptionEn: "Mathematics fundamentals, algebra and geometry for all levels.",
    students: 120,
    duration: "12 أسبوع",
    durationEn: "12 weeks",
    image: mathImg,
    color: "bg-blue-50 border-blue-200 text-blue-600",
    icon: "🔢",
  },
  {
    title: "اللغة العربية",
    titleEn: "Arabic Language",
    description: "قواعد اللغة العربية والنحو والصرف والأدب.",
    descriptionEn: "Arabic grammar, syntax, morphology and literature.",
    students: 150,
    duration: "16 أسبوع",
    durationEn: "16 weeks",
    image: arabicImg,
    color: "bg-emerald-50 border-emerald-200 text-emerald-600",
    icon: "📖",
  },
  {
    title: "العلوم",
    titleEn: "Science",
    description: "الفيزياء والكيمياء والأحياء بأسلوب تفاعلي وممتع.",
    descriptionEn: "Physics, chemistry and biology in an interactive way.",
    students: 95,
    duration: "14 أسبوع",
    durationEn: "14 weeks",
    image: scienceImg,
    color: "bg-purple-50 border-purple-200 text-purple-600",
    icon: "🔬",
  },
  {
    title: "اللغة الإنجليزية",
    titleEn: "English Language",
    description: "تعلم اللغة الإنجليزية من المستوى المبتدئ إلى المتقدم.",
    descriptionEn: "Learn English from beginner to advanced level.",
    students: 180,
    duration: "20 أسبوع",
    durationEn: "20 weeks",
    image: englishImg,
    color: "bg-orange-50 border-orange-200 text-orange-600",
    icon: "🗣",
  },
];

export function CoursesSection() {
  const { lang } = useLang();
  return (
    <section className="py-16 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="section-badge mb-3 inline-flex">
              <BookOpen className="h-3.5 w-3.5" />
              {lang === "ar" ? "المقررات" : "Courses"}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {lang === "ar" ? "المقررات الدراسية" : "Study Courses"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {lang === "ar" ? "اكتشف مجموعة متنوعة من المقررات التعليمية" : "Discover a variety of educational courses"}
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent/60 hover:border-primary/30 transition-all duration-200 flex-shrink-0"
          >
            {lang === "ar" ? "عرض الكل" : "View All"}
            <ArrowLeft className="h-4 w-4 text-primary" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.map((course, index) => (
            <AppCard key={index} hover className="overflow-hidden group">
              {/* Image */}
              <div className="relative w-full h-36 overflow-hidden">
                <img
                  src={course.image}
                  alt={lang === "ar" ? course.title : course.titleEn}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className={`absolute top-3 ${lang === "ar" ? "right-3" : "left-3"} w-8 h-8 rounded-xl ${course.color} border flex items-center justify-center text-base`}>
                  {course.icon}
                </div>
              </div>

              <AppCardHeader className="pt-4 pb-2">
                <AppCardTitle className="text-base">{lang === "ar" ? course.title : course.titleEn}</AppCardTitle>
                <AppCardDescription className="text-xs leading-relaxed">
                  {lang === "ar" ? course.description : course.descriptionEn}
                </AppCardDescription>
              </AppCardHeader>

              <AppCardContent className="pb-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{course.students} {lang === "ar" ? "طالب" : "students"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{lang === "ar" ? course.duration : course.durationEn}</span>
                  </div>
                </div>
              </AppCardContent>

              <AppCardFooter className="pt-2">
                <Link
                  to="/courses"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/8 border border-primary/20 text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  {lang === "ar" ? "عرض المقرر" : "View Course"}
                </Link>
              </AppCardFooter>
            </AppCard>
          ))}
        </div>
      </div>
    </section>
  );
}
