import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CoursesSection } from "@/components/home/CoursesSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
