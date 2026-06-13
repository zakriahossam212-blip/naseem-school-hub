/**
 * Features Data
 * Platform features and capabilities
 */

import { BookOpen, Users, GraduationCap, Clock, Target, Eye, Heart } from "lucide-react";
import { COLORS, STATS } from "@/constants";

export const FEATURES = [
  {
    icon: BookOpen,
    titleAr: "مناهج متطورة",
    titleEn: "Advanced Curriculum",
    descAr: "مقررات دراسية حديثة مصممة وفق أحدث المعايير التعليمية العالمية.",
    descEn: "Modern courses designed according to the latest global educational standards.",
    color: COLORS.textColors.blue,
    bg: COLORS.bgColors.blue,
    border: COLORS.borders.blue,
    glow: COLORS.glows.blue,
  },
  {
    icon: Clock,
    titleAr: "تعلم في أي وقت",
    titleEn: "Learn Anytime",
    descAr: "الوصول إلى المحتوى التعليمي على مدار الساعة من أي مكان.",
    descEn: "Access educational content around the clock from anywhere.",
    color: COLORS.textColors.green,
    bg: COLORS.bgColors.green,
    border: COLORS.borders.green,
    glow: COLORS.glows.green,
  },
  {
    icon: GraduationCap,
    titleAr: "لوحة تحكم المعلم",
    titleEn: "Teacher Dashboard",
    descAr: "أدوات متكاملة للمعلمين لإنشاء الدروس والواجبات ومتابعة الطلاب.",
    descEn: "Integrated tools for teachers to create lessons, assignments, and track student progress.",
    color: COLORS.textColors.orange,
    bg: COLORS.bgColors.orange,
    border: COLORS.borders.orange,
    glow: COLORS.glows.orange,
  },
  {
    icon: Users,
    titleAr: "بوابة أولياء الأمور",
    titleEn: "Parent Portal",
    descAr: "متابعة شاملة لأداء الأطفال ونتائجهم الدراسية بسهولة.",
    descEn: "Comprehensive tracking of children's performance and academic results with ease.",
    color: COLORS.textColors.purple,
    bg: COLORS.bgColors.purple,
    border: COLORS.borders.purple,
    glow: COLORS.glows.purple,
  },
  {
    icon: Heart,
    titleAr: "دعم شامل",
    titleEn: "Comprehensive Support",
    descAr: "فريق دعم متخصص جاهز لمساعدتك في أي وقت.",
    descEn: "Specialized support team ready to assist you anytime.",
    color: COLORS.textColors.amber,
    bg: COLORS.bgColors.yellow,
    border: COLORS.borders.yellow,
    glow: COLORS.glows.yellow,
  },
  {
    icon: Target,
    titleAr: "تحديات وجوائز",
    titleEn: "Challenges & Rewards",
    descAr: "نظام تحفيز شامل للطلاب مع جوائز وشهادات معترف بها.",
    descEn: "Comprehensive incentive system for students with recognized certificates and rewards.",
    color: COLORS.textColors.pink,
    bg: COLORS.bgColors.red,
    border: COLORS.borders.red,
    glow: COLORS.glows.red,
  },
];

export const HERO_STATS = [
  { icon: BookOpen, value: STATS.courses, labelAr: "مقرر متاح", labelEn: "Courses", color: COLORS.textColors.blue, bg: COLORS.bgColors.blue, border: COLORS.borders.blue },
  { icon: Users, value: STATS.students, labelAr: "طالب نشط", labelEn: "Students", color: COLORS.textColors.green, bg: COLORS.bgColors.green, border: COLORS.borders.green },
  { icon: GraduationCap, value: STATS.teachers, labelAr: "معلم متميز", labelEn: "Teachers", color: COLORS.textColors.orange, bg: COLORS.bgColors.orange, border: COLORS.borders.orange },
];
