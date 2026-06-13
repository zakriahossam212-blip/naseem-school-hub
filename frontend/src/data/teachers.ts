/**
 * Teachers Data
 * Static teacher profiles and information
 */

import { COLORS } from "@/constants";
import t1 from "@/assets/teacher-1.jpg";
import t2 from "@/assets/teacher-2.jpg";
import t3 from "@/assets/teacher-3.jpg";
import t4 from "@/assets/teacher-4.jpg";
import t5 from "@/assets/teacher-5.jpg";
import t6 from "@/assets/teacher-6.jpg";

export const TEACHERS = [
  {
    name: "د. أحمد محمد",
    nameEn: "Dr. Ahmed Mohamed",
    subject: "الرياضيات",
    subjectEn: "Mathematics",
    experience: "15 سنة",
    experienceEn: "15 years",
    rating: 4.9,
    courses: 8,
    students: 320,
    image: t1,
    color: COLORS.gradients.blue,
  },
  {
    name: "أ. فاطمة علي",
    nameEn: "Ms. Fatima Ali",
    subject: "اللغة العربية",
    subjectEn: "Arabic Language",
    experience: "12 سنة",
    experienceEn: "12 years",
    rating: 4.8,
    courses: 6,
    students: 280,
    image: t2,
    color: COLORS.gradients.emerald,
  },
  {
    name: "د. محمود حسن",
    nameEn: "Dr. Mahmoud Hassan",
    subject: "العلوم",
    subjectEn: "Science",
    experience: "10 سنوات",
    experienceEn: "10 years",
    rating: 4.7,
    courses: 5,
    students: 210,
    image: t3,
    color: COLORS.gradients.purple,
  },
  {
    name: "أ. سارة أحمد",
    nameEn: "Ms. Sara Ahmed",
    subject: "اللغة الإنجليزية",
    subjectEn: "English Language",
    experience: "8 سنوات",
    experienceEn: "8 years",
    rating: 4.9,
    courses: 7,
    students: 350,
    image: t4,
    color: COLORS.gradients.orange,
  },
  {
    name: "د. عمر خالد",
    nameEn: "Dr. Omar Khalid",
    subject: "التاريخ",
    subjectEn: "History",
    experience: "20 سنة",
    experienceEn: "20 years",
    rating: 4.6,
    courses: 4,
    students: 175,
    image: t5,
    color: COLORS.gradients.amber,
  },
  {
    name: "أ. نور الدين",
    nameEn: "Mr. Nour El-Din",
    subject: "الجغرافيا",
    subjectEn: "Geography",
    experience: "6 سنوات",
    experienceEn: "6 years",
    rating: 4.5,
    courses: 3,
    students: 130,
    image: t6,
    color: COLORS.gradients.teal,
  },
] as const;
