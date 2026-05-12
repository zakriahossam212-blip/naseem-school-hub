import { ClerkProvider } from "@clerk/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Suspense, lazy } from "react";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const Courses = lazy(() => import("./pages/Courses"));
const Teachers = lazy(() => import("./pages/Teachers"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Help = lazy(() => import("./pages/Help"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CoursesDashboard = lazy(() => import("./pages/dashboard/CoursesDashboard"));
const CourseDetail = lazy(() => import("./pages/dashboard/CourseDetail"));
const AssignmentsList = lazy(() => import("./pages/dashboard/AssignmentsList"));
const AssignmentDetail = lazy(() => import("./pages/dashboard/AssignmentDetail"));
const Grades = lazy(() => import("./pages/dashboard/Grades"));
const SchedulePage = lazy(() => import("./pages/dashboard/Schedule"));
const TeacherCourses = lazy(() => import("./pages/teacher/TeacherCourses"));
const TeacherLessons = lazy(() => import("./pages/teacher/TeacherLessons"));
const TeacherAssignments = lazy(() => import("./pages/teacher/TeacherAssignments"));
const TeacherGrades = lazy(() => import("./pages/teacher/TeacherGrades"));
const ParentPortal = lazy(() => import("./pages/parent/ParentPortal"));
const ParentStudentDetail = lazy(() => import("./pages/parent/ParentStudentDetail"));
const Messages = lazy(() => import("./pages/Messages"));
const AdminSetup = lazy(() => import("./pages/AdminSetup"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Suspense fallback={<Spinner />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/teachers" element={<Teachers />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/messages" element={<Messages />} />

                    {/* Student / shared dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/courses" element={<CoursesDashboard />} />
                    <Route path="/dashboard/courses/:id" element={<CourseDetail />} />
                    <Route path="/dashboard/assignments" element={<AssignmentsList />} />
                    <Route path="/dashboard/assignments/:id" element={<AssignmentDetail />} />
                    <Route path="/dashboard/grades" element={<Grades />} />
                    <Route path="/dashboard/schedule" element={<SchedulePage />} />

                    {/* Teacher panel */}
                    <Route path="/teacher/courses" element={<TeacherCourses />} />
                    <Route path="/teacher/courses/:id/lessons" element={<TeacherLessons />} />
                    <Route path="/teacher/courses/:id/assignments" element={<TeacherAssignments />} />
                    <Route path="/teacher/grades" element={<TeacherGrades />} />

                    {/* Parent portal */}
                    <Route path="/parent" element={<ParentPortal />} />
                    <Route path="/parent/students/:studentId" element={<ParentStudentDetail />} />

                    <Route path="/admin-setup" element={<AdminSetup />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
