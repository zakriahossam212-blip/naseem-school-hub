import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CoursesDashboard from "./pages/dashboard/CoursesDashboard";
import CourseDetail from "./pages/dashboard/CourseDetail";
import AssignmentsList from "./pages/dashboard/AssignmentsList";
import AssignmentDetail from "./pages/dashboard/AssignmentDetail";
import Grades from "./pages/dashboard/Grades";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/courses" element={<CoursesDashboard />} />
            <Route path="/dashboard/courses/:id" element={<CourseDetail />} />
            <Route path="/dashboard/assignments" element={<AssignmentsList />} />
            <Route path="/dashboard/assignments/:id" element={<AssignmentDetail />} />
            <Route path="/dashboard/grades" element={<Grades />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
