import { BookOpen, Star, Users, Award } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/contexts/LanguageContext";
import t1 from "@/assets/teacher-1.jpg";
import t2 from "@/assets/teacher-2.jpg";
import t3 from "@/assets/teacher-3.jpg";
import t4 from "@/assets/teacher-4.jpg";
import t5 from "@/assets/teacher-5.jpg";
import t6 from "@/assets/teacher-6.jpg";

const teachers = [
  { name: "د. أحمد محمد", nameEn: "Dr. Ahmed Mohamed", subject: "الرياضيات", subjectEn: "Mathematics", experience: "15 سنة", experienceEn: "15 years", rating: 4.9, courses: 8, students: 320, image: t1, color: "from-blue-500 to-blue-700" },
  { name: "أ. فاطمة علي", nameEn: "Ms. Fatima Ali", subject: "اللغة العربية", subjectEn: "Arabic Language", experience: "12 سنة", experienceEn: "12 years", rating: 4.8, courses: 6, students: 280, image: t2, color: "from-emerald-500 to-emerald-700" },
  { name: "د. محمود حسن", nameEn: "Dr. Mahmoud Hassan", subject: "العلوم", subjectEn: "Science", experience: "10 سنوات", experienceEn: "10 years", rating: 4.7, courses: 5, students: 210, image: t3, color: "from-purple-500 to-purple-700" },
  { name: "أ. سارة أحمد", nameEn: "Ms. Sara Ahmed", subject: "اللغة الإنجليزية", subjectEn: "English Language", experience: "8 سنوات", experienceEn: "8 years", rating: 4.9, courses: 7, students: 350, image: t4, color: "from-orange-500 to-orange-700" },
  { name: "د. عمر خالد", nameEn: "Dr. Omar Khalid", subject: "التاريخ", subjectEn: "History", experience: "20 سنة", experienceEn: "20 years", rating: 4.6, courses: 4, students: 175, image: t5, color: "from-amber-500 to-amber-700" },
  { name: "أ. نور الدين", nameEn: "Mr. Nour El-Din", subject: "الجغرافيا", subjectEn: "Geography", experience: "6 سنوات", experienceEn: "6 years", rating: 4.5, courses: 3, students: 130, image: t6, color: "from-teal-500 to-teal-700" },
];

const Teachers = () => {
  const { lang } = useLang();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-medium mb-4">
            <Award className="h-4 w-4" />
            {lang === "ar" ? "كادر التدريس" : "Teaching Staff"}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {lang === "ar" ? "معلمونا المتميزون" : "Our Distinguished Teachers"}
          </h1>
          <p className="text-white/80 max-w-xl text-lg">
            {lang === "ar" ? "فريق من أمهر المعلمين ذوي الخبرة والكفاءة العالية" : "A team of highly skilled and experienced educators"}
          </p>
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { value: "30+", label: lang === "ar" ? "معلم متميز" : "Teachers" },
              { value: "1,500+", label: lang === "ar" ? "طالب" : "Students Taught" },
              { value: "4.7", label: lang === "ar" ? "متوسط التقييم" : "Avg Rating" },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher, index) => (
              <div
                key={index}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {/* Gradient header */}
                <div className={`relative h-24 bg-gradient-to-br ${teacher.color} flex items-end px-6 pb-0`}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  {/* Avatar */}
                  <div className="relative -mb-10 w-20 h-20 rounded-2xl border-4 border-card overflow-hidden shadow-lg">
                    <img src={teacher.image} alt={teacher.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="pt-12 px-6 pb-6">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                        {lang === "ar" ? teacher.name : teacher.nameEn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lang === "ar" ? teacher.subject : teacher.subjectEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-amber-700">{teacher.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{teacher.courses} {lang === "ar" ? "مقرر" : "courses"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{teacher.students} {lang === "ar" ? "طالب" : "students"}</span>
                    </div>
                  </div>

                  <div className="mt-3 px-3 py-2 rounded-xl bg-muted/60 text-xs text-muted-foreground text-center">
                    {lang === "ar" ? `خبرة ${teacher.experience} في التدريس` : `${teacher.experienceEn} of teaching experience`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Teachers;
