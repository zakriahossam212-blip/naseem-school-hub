/**
 * Helper Functions
 * Utility functions for data formatting, grade calculations, and translations
 */

/**
 * Get text based on language preference
 * Replaces: lang === "ar" ? arText : enText
 */
export const getText = (lang: "ar" | "en", arText: string, enText: string): string => {
  return lang === "ar" ? arText : enText;
};

/**
 * Get value from bilingual object
 * For objects with "...Ar" and "...En" properties
 */
export const getBilingualValue = <T extends Record<string, any>>(
  obj: T,
  lang: "ar" | "en",
  key: string
): any => {
  if (lang === "ar") {
    return obj[`${key}Ar` as keyof T] ?? obj[key as keyof T];
  } else {
    return obj[`${key}En` as keyof T] ?? obj[key as keyof T];
  }
};

/**
 * Get grade color based on percentage
 * Used for displaying grades with colors
 */
export const getGradeColor = (
  percentage: number,
  passThreshold: number = 60,
  goodThreshold: number = 80
): string => {
  if (percentage >= goodThreshold) {
    return "text-green-600 bg-green-50";
  } else if (percentage >= passThreshold) {
    return "text-yellow-600 bg-yellow-50";
  } else {
    return "text-red-600 bg-red-50";
  }
};

/**
 * Format number to percentage
 * Used for displaying grade percentages
 */
export const toPercentage = (value: number, maxValue: number): number => {
  return Math.round((value / maxValue) * 100);
};

/**
 * Get day name based on index
 * 0 = Sunday, 6 = Saturday
 */
export const getDayName = (
  dayIndex: number,
  lang: "ar" | "en",
  days: { [key: string]: string }
): string => {
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayKey = dayNames[dayIndex] ?? "sunday";
  return days[dayKey] ?? "";
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string, lang: "ar" | "en"): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (lang === "ar") {
    return dateObj.toLocaleDateString("ar-EG");
  } else {
    return dateObj.toLocaleDateString("en-US");
  }
};

/**
 * Check if grade is passing
 */
export const isPassingGrade = (grade: number, maxGrade: number = 100, threshold: number = 60): boolean => {
  return (grade / maxGrade) * 100 >= threshold;
};

/**
 * Sort teachers by rating (highest first)
 */
export const sortTeachersByRating = (teachers: any[]): any[] => {
  return [...teachers].sort((a, b) => b.rating - a.rating);
};

/**
 * Filter teachers by subject
 */
export const filterTeachersBySubject = (teachers: any[], subject: string, lang: "ar" | "en"): any[] => {
  const searchKey = lang === "ar" ? "subject" : "subjectEn";
  return teachers.filter((t) => t[searchKey]?.toLowerCase().includes(subject.toLowerCase()));
};
