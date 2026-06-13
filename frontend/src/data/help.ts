/**
 * Help & Support Data
 * Help topics and support information
 */

import { BookOpen, FileQuestion, Mail, Phone } from "lucide-react";

export const HELP_TOPICS = [
  {
    icon: BookOpen,
    titleAr: "دليل البدء",
    titleEn: "Getting Started Guide",
    descAr: "تعرف على كيفية استخدام المنصة والبدء في التعلم",
    descEn: "Learn how to use the platform and start learning",
    link: "/faq",
  },
  {
    icon: FileQuestion,
    titleAr: "الأسئلة الشائعة",
    titleEn: "Frequently Asked Questions",
    descAr: "إجابات على أكثر الأسئلة شيوعاً حول المنصة",
    descEn: "Answers to the most common questions about the platform",
    link: "/faq",
  },
  {
    icon: Mail,
    titleAr: "اتصل بنا",
    titleEn: "Contact Us",
    descAr: "تواصل مع فريق الدعم الخاص بنا",
    descEn: "Get in touch with our support team",
    link: "/contact",
  },
  {
    icon: Phone,
    titleAr: "الدعم الفني",
    titleEn: "Technical Support",
    descAr: "احصل على مساعدة فنية سريعة",
    descEn: "Get quick technical assistance",
    link: "/contact",
  },
];
