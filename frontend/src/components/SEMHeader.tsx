import { Target, TrendingUp, Sparkles } from "lucide-react";

// header component - keeping it clean and functional
const SEMHeader = () => {
  return (
    <header className="border-b border-border bg-gradient-card backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="fade-in">
              <h1 className="text-3xl font-bold text-gradient tracking-tight">
                SEM Plan Generator
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                AI-Powered Campaign Planning & Optimization
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-pastel-pink transition-colors cursor-pointer group">
              <Target className="w-4 h-4 text-pastel-pink group-hover:scale-110 transition-transform" />
              <span className="font-medium">Keyword Research</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-pastel-green transition-colors cursor-pointer group">
              <TrendingUp className="w-4 h-4 text-pastel-green group-hover:scale-110 transition-transform" />
              <span className="font-medium">ROAS Optimization</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-pastel-yellow transition-colors cursor-pointer group">
              <Sparkles className="w-4 h-4 text-pastel-yellow group-hover:scale-110 transition-transform" />
              <span className="font-medium">Performance Max</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SEMHeader;