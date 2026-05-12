import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock, Search, Star, Check, UserPlus, BookOpen, Filter } from "lucide-react";
import { useAuth as useClerkAuth } from "@clerk/react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { api, CourseDto } from "@/lib/apiClient";
import mathImg from "@/assets/course-math.jpg";
import arabicImg from "@/assets/course-arabic.jpg";
import scienceImg from "@/assets/course-science.jpg";
import englishImg from "@/assets/course-english.jpg";
import historyImg from "@/assets/course-history.jpg";
import geographyImg from "@/assets/course-geography.jpg";

const getCourseImage = (title: string) => {
  if (title.includes("رياض") || title.toLowerCase().includes("math")) return mathImg;
  if (title.includes("عربية") || title.toLowerCase().includes("arabic")) return arabicImg;
  if (title.includes("علوم") || title.toLowerCase().includes("science")) return scienceImg;
  if (title.includes("إنجليزية") || title.toLowerCase().includes("english")) return englishImg;
  if (title.includes("تاريخ") || title.toLowerCase().includes("history")) return historyImg;
  if (title.includes("جغرافيا") || title.toLowerCase().includes("geography")) return geographyImg;
  return mathImg;
};

const getCourseGradient = (title: string) => {
  if (title.includes("رياض") || title.toLowerCase().includes("math")) return "from-blue-600/90 to-blue-800/95";
  if (title.includes("عربية") || title.toLowerCase().includes("arabic")) return "from-emerald-600/90 to-emerald-800/95";
  if (title.includes("علوم") || title.toLowerCase().includes("science")) return "from-purple-600/90 to-purple-800/95";
  if (title.includes("إنجليزية") || title.toLowerCase().includes("english")) return "from-orange-500/90 to-orange-700/95";
  if (title.includes("تاريخ") || title.toLowerCase().includes("history")) return "from-amber-600/90 to-amber-800/95";
  if (title.includes("جغرافيا") || title.toLowerCase().includes("geography")) return "from-teal-600/90 to-teal-800/95";
  return "from-primary/80 to-primary/95";
};

const getCourseIcon = (title: string) => {
  if (title.includes("رياض")) return "🔢";
  if (title.includes("عربية")) return "📖";
  if (title.includes("علوم")) return "🔬";
  if (title.includes("إنجليزية")) return "🗣";
  if (title.includes("تاريخ")) return "🏛";
  if (title.includes("جغرافيا")) return "🌍";
  return "📚";
};

const getDuration = (title: string) => {
  if (title.includes("رياض")) return "12 أسبوع";
  if (title.includes("عربية")) return "16 أسبوع";
  if (title.includes("علوم")) return "14 أسبوع";
  if (title.includes("إنجليزية")) return "20 أسبوع";
  if (title.includes("تاريخ")) return "10 أسبوع";
  if (title.includes("جغرافيا")) return "8 أسبوع";
  return "12 أسبوع";
};

const getStudents = (index: number) => [120, 150, 95, 180, 75, 60][index % 6];
const getRating = (index: number) => [4.8, 4.9, 4.7, 4.9, 4.6, 4.5][index % 6];
const getLevel = (title: string) => {
  if (title.includes("رياض")) return "متوسط";
  if (title.includes("عربية")) return "جميع المستويات";
  if (title.includes("علوم")) return "متقدم";
  if (title.includes("إنجليزية")) return "مبتدئ";
  return "متوسط";
};

const Courses = () => {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { userId } = useAuth();
  const { getToken, isSignedIn } = useClerkAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { lang } = useLang();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = isSignedIn ? await getToken().catch(() => null) : null;
        const data = await api.courses.list(token ?? undefined);
        setCourses(data);
        if (token) {
          const ids = await api.courses.enrollments(token).catch(() => []);
          setEnrolled(new Set(ids));
        }
      } catch {
        setCourses([]);
      }
      setLoading(false);
    };
    load();
  }, [isSignedIn, userId]);

  const handleEnroll = async (courseId: string) => {
    if (!isSignedIn) {
      navigate("/auth");
      return;
    }
    const token = await getToken().catch(() => null);
    if (!token) { navigate("/auth"); return; }
    setEnrollingId(courseId);
    try {
      await api.courses.enroll(courseId, token);
      setEnrolled((prev) => new Set([...prev, courseId]));
      toast({ title: lang === "ar" ? "✅ تم التسجيل في المقرر!" : "Enrolled successfully!" });
    } catch (err: unknown) {
      const msg = (err as Error).message;
      if (msg === "Already enrolled") {
        toast({ title: lang === "ar" ? "أنت مسجل بالفعل" : "Already enrolled", description: lang === "ar" ? "يمكنك متابعة المقرر من لوحة التحكم" : "Continue from your dashboard" });
        setEnrolled((prev) => new Set([...prev, courseId]));
      } else {
        toast({ title: lang === "ar" ? "تعذر التسجيل" : "Enrollment failed", description: msg, variant: "destructive" });
      }
    }
    setEnrollingId(null);
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="container relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            {lang === "ar" ? "المقررات الدراسية" : "Study Courses"}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {lang === "ar" ? "اكتشف مقرراتنا التعليمية" : "Explore Our Courses"}
          </h1>
          <p className="text-white/80 max-w-xl text-lg">
            {lang === "ar" ? "مجموعة متنوعة من المقررات المصممة لتناسب جميع المراحل والمستويات" : "A variety of courses designed for all levels and grades"}
          </p>
          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { value: `${courses.length}+`, label: lang === "ar" ? "مقرر متاح" : "Courses" },
              { value: "500+", label: lang === "ar" ? "طالب مسجل" : "Students" },
              { value: "30+", label: lang === "ar" ? "معلم متميز" : "Teachers" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-white/70 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="container">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={lang === "ar" ? "ابحث عن مقرر..." : "Search courses..."}
                className="pr-10 h-11 bg-card border-border rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 h-11 rounded-xl">
              <Filter className="h-4 w-4" />
              {lang === "ar" ? "تصفية" : "Filter"}
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-52 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-10 bg-muted rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{lang === "ar" ? "لا توجد مقررات" : "No courses found"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, index) => {
                const isEnrolled = enrolled.has(course.id);
                const isEnrolling = enrollingId === course.id;
                const img = getCourseImage(course.title);
                const gradient = getCourseGradient(course.title);
                const icon = getCourseIcon(course.title);
                const level = getLevel(course.title);
                const duration = getDuration(course.title);
                const students = getStudents(index);
                const rating = getRating(index);

                return (
                  <div
                    key={course.id}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in flex flex-col"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={img}
                        alt={course.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                      {/* Level badge */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-foreground shadow-sm">
                        {level}
                      </div>
                      {/* Icon badge */}
                      <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-lg shadow-sm">
                        {icon}
                      </div>
                      {isEnrolled && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-semibold shadow-sm">
                          <Check className="h-3 w-3" />
                          {lang === "ar" ? "مسجّل" : "Enrolled"}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
                        {course.description || (lang === "ar" ? "مقرر دراسي متكامل" : "A comprehensive study course")}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {students}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {duration}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-amber-500 font-medium">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                          {rating}
                        </span>
                      </div>

                      {/* CTA */}
                      {isEnrolled ? (
                        <Button
                          className="w-full rounded-xl gap-2 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                          variant="ghost"
                          onClick={() => navigate("/dashboard/courses")}
                        >
                          <Check className="h-4 w-4" />
                          {lang === "ar" ? "متابعة المقرر" : "Continue Course"}
                        </Button>
                      ) : (
                        <Button
                          className="w-full rounded-xl gap-2 shadow-sm"
                          onClick={() => handleEnroll(course.id)}
                          disabled={isEnrolling}
                        >
                          {isEnrolling ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserPlus className="h-4 w-4" />
                          )}
                          {lang === "ar" ? "التسجيل في المقرر" : "Enroll Now"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
