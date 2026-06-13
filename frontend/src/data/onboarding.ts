/**
 * Onboarding Data
 * User role options and onboarding information
 */

import { GraduationCap, Users, UserCheck } from "lucide-react";

export const ROLE_OPTIONS = [
  {
    value: "student",
    icon: GraduationCap,
    labelAr: "طالب",
    labelEn: "Student",
    descAr: "أريد التعلم ومتابعة المقررات",
    descEn: "I want to learn and follow courses",
    color: "bg-blue-50 border-blue-200 text-blue-600",
  },
  {
    value: "teacher",
    icon: UserCheck,
    labelAr: "معلم",
    labelEn: "Teacher",
    descAr: "أريد تدريس وإنشاء المقررات",
    descEn: "I want to teach and create courses",
    color: "bg-green-50 border-green-200 text-green-600",
  },
  {
    value: "parent",
    icon: Users,
    labelAr: "ولي أمر",
    labelEn: "Parent",
    descAr: "أريد متابعة أداء أبنائي",
    descEn: "I want to track my children's performance",
    color: "bg-purple-50 border-purple-200 text-purple-600",
  },
] as const;
