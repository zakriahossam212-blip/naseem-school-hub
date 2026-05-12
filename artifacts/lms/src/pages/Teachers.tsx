import { BookOpen, Star } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { AppCard, AppCardHeader, AppCardTitle, AppCardDescription, AppCardContent } from "@/components/common/AppCard";
import t1 from "@/assets/teacher-1.jpg";
import t2 from "@/assets/teacher-2.jpg";
import t3 from "@/assets/teacher-3.jpg";
import t4 from "@/assets/teacher-4.jpg";
import t5 from "@/assets/teacher-5.jpg";
import t6 from "@/assets/teacher-6.jpg";

const teachers = [
  { name: "د. أحمد محمد", subject: "الرياضيات", experience: "15 سنة", rating: 4.9, courses: 8, image: t1 },
  { name: "أ. فاطمة علي", subject: "اللغة العربية", experience: "12 سنة", rating: 4.8, courses: 6, image: t2 },
  { name: "د. محمود حسن", subject: "العلوم", experience: "10 سنوات", rating: 4.7, courses: 5, image: t3 },
  { name: "أ. سارة أحمد", subject: "اللغة الإنجليزية", experience: "8 سنوات", rating: 4.9, courses: 7, image: t4 },
  { name: "د. عمر خالد", subject: "التاريخ", experience: "20 سنة", rating: 4.6, courses: 4, image: t5 },
  { name: "أ. نور الدين", subject: "الجغرافيا", experience: "6 سنوات", rating: 4.5, courses: 3, image: t6 },
];

const Teachers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 py-12">
        <div className="container">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-4">المعلمون</h1>
            <p className="text-muted-foreground max-w-2xl">
              تعرف على فريق المعلمين المتميزين الذين يقودون العملية التعليمية في مدرسة نصر الدين
            </p>
          </div>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher, index) => (
              <AppCard key={index} hover>
                <AppCardHeader className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 mx-auto mb-4 shadow-card">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      width={512}
                      height={512}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <AppCardTitle>{teacher.name}</AppCardTitle>
                  <AppCardDescription>{teacher.subject}</AppCardDescription>
                </AppCardHeader>
                <AppCardContent>
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span>{teacher.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{teacher.courses} مقررات</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    خبرة {teacher.experience}
                  </p>
                </AppCardContent>
              </AppCard>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Teachers;
