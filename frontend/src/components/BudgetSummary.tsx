import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Target,
  Calculator,
  PieChart,
  BarChart3
} from "lucide-react";

interface BudgetBreakdown {
  campaignType: string;
  budget: number;
  expectedCpc: number;
  estimatedClicks: number;
  estimatedConversions: number;
  expectedRoas: number;
}

interface BudgetSummaryProps {
  budgetBreakdown: BudgetBreakdown[];
  totalBudget: number;
  overallRoas: number;
  conversionRate: number;
}

const BudgetSummary = ({ 
  budgetBreakdown, 
  totalBudget, 
  overallRoas, 
  conversionRate 
}: BudgetSummaryProps) => {
  // calculate totals - learned this pattern from a finance app
  const totalExpectedConversions = budgetBreakdown.reduce(
    (sum, item) => sum + item.estimatedConversions, 0
  );
  
  const totalExpectedClicks = budgetBreakdown.reduce(
    (sum, item) => sum + item.estimatedClicks, 0
  );

  // color coding for campaign types - helps with visual distinction
  const getCampaignColor = (campaignType: string) => {
    switch (campaignType.toLowerCase()) {
      case 'shopping': return 'text-pastel-blue';
      case 'search': return 'text-pastel-green';
      case 'performance max': return 'text-pastel-coral';
      default: return 'text-pastel-purple';
    }
  };

  const getCampaignIcon = (campaignType: string) => {
    switch (campaignType.toLowerCase()) {
      case 'shopping': return <Target className="w-4 h-4" />;
      case 'search': return <BarChart3 className="w-4 h-4" />;
      case 'performance max': return <TrendingUp className="w-4 h-4" />;
      default: return <PieChart className="w-4 h-4" />;
    }
  };

  return (
    <Card className="card-gradient card-hover scale-in">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-responsive-xl">
          <div className="p-2 sm:p-3 bg-gradient-primary rounded-xl shadow-lg">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </div>
          <span className="font-bold">Budget Summary & Projections</span>
        </CardTitle>
        <p className="text-muted-foreground text-responsive-sm mt-2 leading-relaxed">
          Expected performance metrics based on 2% conversion rate assumption with real-time optimization
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 bg-muted/20 rounded-xl border border-border/30">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-yellow" />
            </div>
            <p className="text-xs text-muted-foreground">Total Budget</p>
            <p className="text-lg sm:text-xl font-bold text-pastel-yellow">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-green" />
            </div>
            <p className="text-xs text-muted-foreground">Expected ROAS</p>
            <p className="text-lg sm:text-xl font-bold text-pastel-green">
              {overallRoas.toFixed(1)}x
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-blue" />
            </div>
            <p className="text-xs text-muted-foreground">Est. Conversions</p>
            <p className="text-lg sm:text-xl font-bold text-pastel-blue">
              {totalExpectedConversions.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-coral" />
            </div>
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
            <p className="text-lg sm:text-xl font-bold text-pastel-coral">
              {(conversionRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Campaign Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold text-responsive-base sm:text-lg flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span>Campaign Performance Breakdown</span>
          </h3>
          
          {budgetBreakdown.map((campaign, index) => (
            <div 
              key={index}
              className="p-4 sm:p-5 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.01] card-hover"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className={`p-2 bg-muted rounded-lg ${getCampaignColor(campaign.campaignType)}`}>
                    {getCampaignIcon(campaign.campaignType)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-responsive-sm sm:text-base">{campaign.campaignType}</h4>
                    <p className="text-responsive-xs sm:text-sm text-muted-foreground">
                      ${campaign.budget.toLocaleString()} monthly budget
                    </p>
                  </div>
                </div>
                
                <div className="text-left sm:text-right">
                  <p className="text-responsive-xs sm:text-sm font-medium text-pastel-green">
                    {campaign.expectedRoas.toFixed(1)}x ROAS
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${campaign.expectedCpc.toFixed(2)} avg CPC
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-responsive-xs sm:text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Expected Clicks</p>
                  <p className="font-semibold">{campaign.estimatedClicks.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground text-xs">Est. Conversions</p>
                  <p className="font-semibold">{campaign.estimatedConversions.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground text-xs">Budget Utilization</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress 
                      value={(campaign.budget / totalBudget) * 100} 
                      className="flex-1 h-2"
                    />
                    <span className="text-xs font-medium">
                      {((campaign.budget / totalBudget) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Insights */}
        <div className="bg-gradient-secondary/10 rounded-lg p-4 border border-secondary/30">
          <h4 className="font-semibold text-responsive-xs sm:text-sm mb-3 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span>Performance Insights</span>
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-responsive-xs sm:text-sm">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                • Total expected clicks: <span className="text-pastel-blue font-medium">
                  {totalExpectedClicks.toLocaleString()}
                </span>
              </p>
              <p className="text-muted-foreground">
                • Average cost per conversion: <span className="text-pastel-yellow font-medium">
                  ${(totalBudget / totalExpectedConversions).toFixed(2)}
                </span>
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">
                • Best performing campaign: <span className="text-pastel-green font-medium">
                  {budgetBreakdown.sort((a, b) => b.expectedRoas - a.expectedRoas)[0]?.campaignType}
                </span>
              </p>
              <p className="text-muted-foreground">
                • Monthly revenue projection: <span className="text-pastel-coral font-medium">
                  ${(totalBudget * overallRoas).toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;