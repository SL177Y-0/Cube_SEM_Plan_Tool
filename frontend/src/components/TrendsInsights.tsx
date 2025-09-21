import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Brain, 
  Zap, 
  Target, 
  Globe, 
  Users, 
  BarChart3,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

// trend data structure - learned this from industry reports
interface Trend {
  trend: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  category: 'ai' | 'search' | 'advertising' | 'technology';
  adoption_rate: number;
  potential_roi: number;
}

interface BestPractice {
  practice: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expected_impact: number;
}

interface TrendsInsightsProps {
  trends: Trend[];
  bestPractices: BestPractice[];
  isLoading?: boolean;
}

const TrendsInsights: React.FC<TrendsInsightsProps> = ({ trends, bestPractices, isLoading = false }) => {
  // color coding for impact levels - helps with quick assessment
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-pastel-coral/20 text-pastel-coral border-pastel-coral/30';
      case 'medium': return 'bg-pastel-yellow/20 text-pastel-yellow border-pastel-yellow/30';
      case 'low': return 'bg-pastel-green/20 text-pastel-green border-pastel-green/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'search': return <Globe className="w-4 h-4" />;
      case 'advertising': return <Target className="w-4 h-4" />;
      case 'technology': return <Zap className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-pastel-green/20 text-pastel-green border-pastel-green/30';
      case 'medium': return 'bg-pastel-yellow/20 text-pastel-yellow border-pastel-yellow/30';
      case 'hard': return 'bg-pastel-coral/20 text-pastel-coral border-pastel-coral/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-gradient">
              <CardContent className="p-4 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="p-2 sm:p-3 bg-gradient-primary rounded-xl shadow-lg">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </div>
          <h2 className="text-responsive-xl sm:text-3xl font-bold text-gradient">2025 SEM Trends & Insights</h2>
        </div>
        <p className="text-responsive-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
          Stay ahead of the competition with the latest search engine marketing trends, 
          AI-powered insights, and actionable best practices for maximum ROAS.
        </p>
      </div>

      {/* Key Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {trends.map((trend, index) => (
          <Card key={index} className="card-gradient card-hover">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="p-2 bg-background/50 rounded-lg">
                    {getCategoryIcon(trend.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-responsive-base sm:text-lg truncate">{trend.trend}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge className={`${getImpactColor(trend.impact)} text-xs`}>
                        {trend.impact} impact
                      </Badge>
                      <Badge variant="secondary" className="bg-pastel-blue/20 text-pastel-blue text-xs">
                        {trend.adoption_rate}% adoption
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl sm:text-2xl font-bold text-gradient">{trend.potential_roi}x</div>
                  <div className="text-xs text-muted-foreground">Potential ROI</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-responsive-xs sm:text-sm leading-relaxed">{trend.description}</p>
              <div className="bg-background/30 rounded-lg p-3 sm:p-4 border border-border/30">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-pastel-yellow mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-responsive-xs sm:text-sm font-medium mb-1">Recommendation:</p>
                    <p className="text-responsive-xs sm:text-sm text-muted-foreground">{trend.recommendation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Best Practices */}
      <Card className="card-gradient card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-responsive-base sm:text-lg">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-green" />
            <span>Best Practices for 2025</span>
          </CardTitle>
          <CardDescription className="text-responsive-xs sm:text-sm">
            Proven strategies to maximize your SEM performance and stay competitive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bestPractices.map((practice, index) => (
              <div key={index} className="p-3 sm:p-4 bg-background/30 rounded-lg border border-border/30 hover:border-border/50 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-pastel-blue/20 rounded">
                      {getCategoryIcon(practice.category)}
                    </div>
                    <Badge className={`${getDifficultyColor(practice.difficulty)} text-xs`}>
                      {practice.difficulty}
                    </Badge>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-responsive-xs sm:text-sm font-bold text-gradient">+{practice.expected_impact}%</div>
                    <div className="text-xs text-muted-foreground">impact</div>
                  </div>
                </div>
                <h4 className="font-medium mb-2 text-responsive-xs sm:text-sm">{practice.practice}</h4>
                <p className="text-responsive-xs sm:text-sm text-muted-foreground">{practice.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="card-gradient card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-responsive-base sm:text-lg">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-coral" />
            <span>Immediate Action Items</span>
          </CardTitle>
          <CardDescription className="text-responsive-xs sm:text-sm">
            Priority actions to implement these trends in your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-3 sm:p-4 bg-background/30 rounded-lg border border-border/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-pastel-blue/20 rounded-lg">
                    <Brain className="w-4 h-4 text-pastel-blue" />
                  </div>
                  <h4 className="font-medium text-responsive-sm">AI-Powered Optimization</h4>
                </div>
                <ul className="space-y-2 text-responsive-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-pastel-green flex-shrink-0" />
                    <span>Enable AI Max for Search campaigns</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-pastel-green flex-shrink-0" />
                    <span>Implement semantic search keywords</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-pastel-green flex-shrink-0" />
                    <span>Optimize for AI Overviews</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 sm:p-4 bg-background/30 rounded-lg border border-border/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-pastel-green/20 rounded-lg">
                    <Users className="w-4 h-4 text-pastel-green" />
                  </div>
                  <h4 className="font-medium text-responsive-sm">Performance Max Enhancement</h4>
                </div>
                <ul className="space-y-2 text-responsive-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-pastel-green flex-shrink-0" />
                    <span>Create diverse asset groups</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-pastel-green flex-shrink-0" />
                    <span>Implement audience signals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-pastel-green flex-shrink-0" />
                    <span>Use video assets for better performance</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium mb-1 text-responsive-sm">Ready to implement these trends?</h4>
                  <p className="text-responsive-xs sm:text-sm text-muted-foreground">
                    Generate your AI-powered SEM plan with the latest 2025 optimizations
                  </p>
                </div>
                <Button className="button-glow bg-gradient-primary hover:bg-gradient-primary/90 text-black touch-target w-full sm:w-auto">
                  <span className="text-responsive-xs sm:text-sm">Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-pastel-blue/20 rounded-lg">
                <Info className="w-4 h-4 text-pastel-blue" />
              </div>
              <h4 className="font-medium text-responsive-sm">Market Insights</h4>
            </div>
            <div className="space-y-3 text-responsive-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Search volume growth</span>
                <span className="font-medium text-pastel-green">+12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average CPC increase</span>
                <span className="font-medium text-pastel-coral">+8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI adoption rate</span>
                <span className="font-medium text-pastel-blue">+45%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-pastel-green/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-pastel-green" />
              </div>
              <h4 className="font-medium text-responsive-sm">Opportunities</h4>
            </div>
            <div className="space-y-3 text-responsive-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zero-click searches</span>
                <span className="font-medium text-pastel-yellow">60%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Voice search growth</span>
                <span className="font-medium text-pastel-blue">+25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mobile-first indexing</span>
                <span className="font-medium text-pastel-coral">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient card-hover sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-pastel-coral/20 rounded-lg">
                <Zap className="w-4 h-4 text-pastel-coral" />
              </div>
              <h4 className="font-medium text-responsive-sm">Performance</h4>
            </div>
            <div className="space-y-3 text-responsive-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average ROAS</span>
                <span className="font-medium text-pastel-green">4.2x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conversion rate</span>
                <span className="font-medium text-pastel-blue">2.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CTR improvement</span>
                <span className="font-medium text-pastel-yellow">+15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrendsInsights;