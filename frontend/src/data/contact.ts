/**
 * Contact & Location Data
 * Contact details and information
 */

import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const CONTACT_DETAILS = [
  {
    icon: Phone,
    titleAr: "الهاتف",
    titleEn: "Phone",
    value: "+20 123 456 7890",
    descriptionAr: "متاحون من 8 صباحاً - 4 مساءً",
    descriptionEn: "Available from 8 AM - 4 PM",
  },
  {
    icon: Mail,
    titleAr: "البريد الإلكتروني",
    titleEn: "Email",
    value: "info@nasreldin-school.com",
    descriptionAr: "نرد خلال 24 ساعة",
    descriptionEn: "We respond within 24 hours",
  },
  {
    icon: MapPin,
    titleAr: "العنوان",
    titleEn: "Address",
    value: "Cairo, Egypt",
    descriptionAr: "شارع التعليم، المنطقة التعليمية",
    descriptionEn: "Education Street, Educational District",
  },
  {
    icon: Clock,
    titleAr: "ساعات العمل",
    titleEn: "Working Hours",
    value: "Sunday - Thursday",
    descriptionAr: "8:00 ص - 4:00 م",
    descriptionEn: "8:00 AM - 4:00 PM",
  },
];
