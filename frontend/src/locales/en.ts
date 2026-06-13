/**
 * English Translations
 * All English UI text strings
 */

export const en = {
  // Navigation & Basic
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

  // Common UI
  loading: "Loading...",
  noData: "No data available",
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  add: "Add",
  submit: "Submit",
  close: "Close",
  error: "Error",
  success: "Success",

  // Dashboard Sections
  myStudents: "My Students",
  myGrades: "My Grades",
  myCourses: "My Courses",
  messages: "Messages",
  studentDashboard: "Student Dashboard",
  parentDashboard: "Parent Dashboard",

  // Hero Section
  heroTitle: "Welcome to",
  heroSubtitle: "Nasr El-Din School",
  heroDesc: "An integrated educational platform connecting students and teachers in a modern learning environment.",
  startLearning: "Start Learning Now",
  learnMore: "Learn More",

  // Features Section
  features: "Why Nasr El-Din School?",
  featuresDesc: "We offer a distinctive educational experience combining quality and ease",

  // Stats
  students: "Enrolled Students",
  coursesCount: "Courses",
  teachersCount: "Expert Teachers",

  // Schedule
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

  // Onboarding Roles
  studentRole: "Student",
  studentRoleDesc: "I want to learn and follow courses",
  teacherRole: "Teacher",
  teacherRoleDesc: "I want to teach and create courses",
  parentRole: "Parent",
  parentRoleDesc: "I want to track my children's performance",

  // Toast Messages
  toastSaved: "Saved!",
  toastDeleted: "Deleted!",
  toastUpdated: "Updated!",
  toastCreated: "Added!",
  toastGraded: "Graded!",
  toastError: "Error",
  toastLoading: "Processing...",

  // About Page
  missionTitle: "Our Mission",
  missionDesc: "Providing high-quality education that empowers students to achieve their full potential in a stimulating and innovative learning environment.",
  visionTitle: "Our Vision",
  visionDesc: "To be the leading educational institution in the region, and a model for academic and educational excellence.",
  valuesTitle: "Our Values",
  valuesDesc: "Integrity, excellence, innovation, mutual respect, and commitment to continuous improvement.",

  // Contact Page
  phoneLabel: "Phone",
  emailLabel: "Email",
  addressLabel: "Address",
  hoursLabel: "Working Hours",
  responseTime: "We respond within 24 hours",
  officeHours: "8:00 AM - 4:00 PM",
  workDays: "Sunday - Thursday",
} as const;

export type EnTranslation = typeof en;
