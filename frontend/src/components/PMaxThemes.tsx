import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Target, 
  Users, 
  Calendar,
  TrendingUp,
  Copy
} from "lucide-react";

interface PMaxTheme {
  title: string;
  category: string;
  description: string;
  keywords: string[];
  targetAudience: string;
  estimatedImpressions: number;
  expectedCtr: number;
}

interface PMaxThemesProps {
  themes: PMaxTheme[];
}

const PMaxThemes = ({ themes }: PMaxThemesProps) => {
  // icon mapping for different theme categories
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'product': return <Target className="w-4 h-4" />;
      case 'demographic': return <Users className="w-4 h-4" />;
      case 'seasonal': return <Calendar className="w-4 h-4" />;
      case 'use-case': return <TrendingUp className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // color coding for theme categories - learned this from design system docs
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'product': return 'bg-pastel-blue text-black';
      case 'demographic': return 'bg-pastel-green text-black';
      case 'seasonal': return 'bg-pastel-yellow text-black';
      case 'use-case': return 'bg-pastel-coral text-black';
      default: return 'bg-pastel-purple text-black';
    }
  };

  // copy keywords to clipboard - useful for campaign setup
  const copyThemeKeywords = (keywords: string[]) => {
    navigator.clipboard.writeText(keywords.join(', '));
  };

  return (
    <Card className="card-gradient card-hover scale-in">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-responsive-xl">
          <div className="p-2 sm:p-3 bg-gradient-secondary rounded-xl shadow-lg">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </div>
          <span className="font-bold">Performance Max Themes</span>
        </CardTitle>
        <p className="text-muted-foreground text-responsive-sm mt-2 leading-relaxed">
          Asset group themes optimized for maximum performance and ROAS with AI-powered targeting
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {themes.map((theme, index) => (
            <div 
              key={index}
              className="group p-4 sm:p-6 bg-gradient-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-pastel hover:scale-[1.02] card-hover"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 space-y-3 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-2 bg-muted rounded-lg text-foreground">
                    {getCategoryIcon(theme.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-responsive-base sm:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                      {theme.title}
                    </h3>
                    <Badge className={`${getCategoryColor(theme.category)} text-xs mt-1`}>
                      {theme.category}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyThemeKeywords(theme.keywords)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity touch-target self-end sm:self-auto"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-muted-foreground text-responsive-xs sm:text-sm mb-4 leading-relaxed">
                {theme.description}
              </p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Target Keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {theme.keywords.map((keyword, keywordIndex) => (
                      <Badge 
                        key={keywordIndex}
                        variant="secondary"
                        className="text-xs bg-muted hover:bg-primary/20 transition-colors"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 border-t border-border/50">
                  <div className="text-center sm:text-left">
                    <p className="text-xs text-muted-foreground">Target Audience</p>
                    <p className="text-responsive-xs sm:text-sm font-medium text-pastel-blue">
                      {theme.targetAudience}
                    </p>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <p className="text-xs text-muted-foreground">Est. Impressions/Month</p>
                    <p className="text-responsive-xs sm:text-sm font-medium text-pastel-green">
                      {theme.estimatedImpressions.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <p className="text-xs text-muted-foreground">Expected CTR</p>
                    <p className="text-responsive-xs sm:text-sm font-medium text-pastel-yellow">
                      {(theme.expectedCtr * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PMaxThemes;