import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 fade-in">
        <div className="flex justify-center">
          <div className="p-6 bg-gradient-card rounded-full border border-border">
            <AlertCircle className="w-16 h-16 text-pastel-coral" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gradient">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>
        </div>
        
        <Button
          asChild
          className="button-glow bg-gradient-primary hover:bg-gradient-secondary text-black font-semibold"
        >
          <a href="/" className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Return to SEM Dashboard</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
