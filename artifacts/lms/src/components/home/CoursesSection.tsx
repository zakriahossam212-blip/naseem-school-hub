import { ArrowLeft, Users, Clock, Star, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import mathImg from "@/assets/course-math.jpg";
import arabicImg from "@/assets/course-arabic.jpg";
import scienceImg from "@/assets/course-science.jpg";
import englishImg from "@/assets/course-english.jpg";

const courses = [
  {
    title: "الرياضيات", titleEn: "Mathematics",
    description: "أساسيات الرياضيات والجبر والهندسة للمراحل المختلفة.", descriptionEn: "Algebra, geometry and more for all levels.",
    students: 120, duration: "12 أسبوع", durationEn: "12 weeks", rating: 4.8,
    image: mathImg, icon: "🔢", gradient: "from-blue-600/80 to-blue-900/90", level: "متوسط", levelEn: "Intermediate",
  },
  {
    title: "اللغة العربية", titleEn: "Arabic Language",
    description: "قواعد اللغة العربية والنحو والصرف والأدب.", descriptionEn: "Arabic grammar, syntax and literature.",
    students: 150, duration: "16 أسبوع", durationEn: "16 weeks", rating: 4.9,
    image: arabicImg, icon: "📖", gradient: "from-emerald-600/80 to-emerald-900/90", level: "جميع المستويات", levelEn: "All Levels",
  },
  {
    title: "العلوم", titleEn: "Science",
    description: "الفيزياء والكيمياء والأحياء بأسلوب تفاعلي وممتع.", descriptionEn: "Physics, chemistry and biology interactively.",
    students: 95, duration: "14 أسبوع", durationEn: "14 weeks", rating: 4.7,
    image: scienceImg, icon: "🔬", gradient: "from-purple-600/80 to-purple-900/90", level: "متقدم", levelEn: "Advanced",
  },
  {
    title: "اللغة الإنجليزية", titleEn: "English Language",
    description: "تعلم اللغة الإنجليزية من المستوى المبتدئ إلى المتقدم.", descriptionEn: "From beginner to advanced level.",
    students: 180, duration: "20 أسبوع", durationEn: "20 weeks", rating: 4.9,
    image: englishImg, icon: "🗣", gradient: "from-orange-500/80 to-orange-800/90", level: "مبتدئ", levelEn: "Beginner",
  },
];

export function CoursesSection() {
  const { lang } = useLang();
  return (
    <section className="py-20 bg-background">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <BookOpen className="h-3.5 w-3.5" />
              {lang === "ar" ? "المقررات المميزة" : "Featured Courses"}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {lang === "ar" ? "ابدأ رحلتك التعليمية" : "Start Your Learning Journey"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {lang === "ar" ? "اختر من بين مقرراتنا المتنوعة التي تناسب مستواك" : "Choose from our diverse courses that fit your level"}
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0 shadow-sm"
          >
            {lang === "ar" ? "عرض الكل" : "View All"}
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.map((course, index) => (
            <Link
              key={index}
              to="/courses"
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={course.image}
                  alt={lang === "ar" ? course.title : course.titleEn}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${course.gradient} opacity-60 group-hover:opacity-40 transition-opacity`} />

                {/* Level pill */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-xs font-semibold text-foreground shadow-sm">
                  {lang === "ar" ? course.level : course.levelEn}
                </div>

                {/* Icon */}
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center text-lg shadow-sm">
                  {course.icon}
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {course.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors">
                  {lang === "ar" ? course.title : course.titleEn}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2 flex-1">
                  {lang === "ar" ? course.description : course.descriptionEn}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lang === "ar" ? course.duration : course.durationEn}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
