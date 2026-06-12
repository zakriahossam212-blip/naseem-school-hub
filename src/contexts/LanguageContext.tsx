import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const ar = {
  schoolName: "مدرسة نصر الدين",
  home: "الرئيسية",
  courses: "المقررات",
  teachers: "المعلمون",
  about: "عن المدرسة",
  contact: "تواصل معنا",
  signIn: "تسجيل الدخول",
  signUp: "إنشاء حساب",
  dashboard: "لوحة التحكم",
  signOut: "تسجيل الخروج",
  assignments: "الواجبات",
  grades: "الدرجات",
  schedule: "الجدول الدراسي",
  lessons: "الدروس",
  teacherPanel: "لوحة المعلم",
  parentPortal: "بوابة أولياء الأمور",
  loading: "جاري التحميل...",
  noData: "لا توجد بيانات",
  save: "حفظ",
  cancel: "إلغاء",
  delete: "حذف",
  edit: "تعديل",
  add: "إضافة",
  submit: "إرسال",
  close: "إغلاق",
  myStudents: "طلابي",
  myGrades: "درجاتي",
  myCourses: "مقرراتي",
  messages: "الرسائل",
  studentDashboard: "لوحة الطالب",
  parentDashboard: "لوحة ولي الأمر",
  heroTitle: "مرحباً بكم في",
  heroSubtitle: "مدرسة نصر الدين",
  heroDesc: "منصة تعليمية متكاملة تجمع بين الطلاب والمعلمين في بيئة تعليمية حديثة ومتطورة.",
  startLearning: "ابدأ التعلم الآن",
  learnMore: "تعرف علينا",
  features: "لماذا مدرسة نصر الدين؟",
  featuresDesc: "نقدم لكم تجربة تعليمية متميزة تجمع بين الجودة والسهولة",
  students: "طالب مسجل",
  coursesCount: "مقرر دراسي",
  teachersCount: "معلم متميز",
  examType: "امتحان",
  lessonType: "درس",
  eventType: "فعالية",
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
};

const en: typeof ar = {
  schoolName: "Nasr El-Din School",
  home: "Home",
  courses: "Courses",
  teachers: "Teachers",
  about: "About",
  contact: "Contact",
  signIn: "Sign In",
  signUp: "Sign Up",
  dashboard: "Dashboard",
  signOut: "Sign Out",
  assignments: "Assignments",
  grades: "Grades",
  schedule: "Schedule",
  lessons: "Lessons",
  teacherPanel: "Teacher Panel",
  parentPortal: "Parent Portal",
  loading: "Loading...",
  noData: "No data available",
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  add: "Add",
  submit: "Submit",
  close: "Close",
  myStudents: "My Students",
  myGrades: "My Grades",
  myCourses: "My Courses",
  messages: "Messages",
  studentDashboard: "Student Dashboard",
  parentDashboard: "Parent Dashboard",
  heroTitle: "Welcome to",
  heroSubtitle: "Nasr El-Din School",
  heroDesc: "An integrated educational platform connecting students and teachers in a modern learning environment.",
  startLearning: "Start Learning Now",
  learnMore: "Learn More",
  features: "Why Nasr El-Din School?",
  featuresDesc: "We offer a distinctive educational experience combining quality and ease",
  students: "Enrolled Students",
  coursesCount: "Courses",
  teachersCount: "Expert Teachers",
  examType: "Exam",
  lessonType: "Lesson",
  eventType: "Event",
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

type Lang = "ar" | "en";
type Translations = typeof ar;

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LangCtx>({
  lang: "ar",
  toggle: () => {},
  t: ar,
  isRtl: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => {
    const next: Lang = lang === "ar" ? "en" : "ar";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t: lang === "ar" ? ar : en, isRtl: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
