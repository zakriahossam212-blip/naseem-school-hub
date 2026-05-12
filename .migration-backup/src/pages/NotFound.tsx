import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          الصفحة غير موجودة
        </h1>
        <p className="text-muted-foreground mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button>
              <Home className="h-4 w-4 ml-2" />
              الصفحة الرئيسية
            </Button>
          </Link>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowRight className="h-4 w-4 ml-2" />
            الرجوع للخلف
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
