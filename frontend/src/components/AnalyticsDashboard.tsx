import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  Users, 
  Eye, 
  MousePointer,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Brain,
  Globe
} from 'lucide-react';

// analytics data structure - keeping it comprehensive
interface AnalyticsData {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  averageCtr: number;
  averageCpc: number;
  averageCpa: number;
  roas: number;
  conversionRate: number;
  trends: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  };
  topPerformingKeywords: Array<{
    keyword: string;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
  }>;
  campaignPerformance: Array<{
    campaign: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    roas: number;
  }>;
  audienceInsights: {
    topLocations: Array<{ location: string; percentage: number }>;
    topDevices: Array<{ device: string; percentage: number }>;
    topTimeSlots: Array<{ time: string; percentage: number }>;
  };
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  isLoading?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data, isLoading = false }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="card-gradient">
              <CardContent className="p-4 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 sm:h-8 bg-muted rounded w-1/2"></div>
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
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <p className="text-responsive-xs sm:text-sm font-medium text-muted-foreground">Total Impressions</p>
                <p className="text-xl sm:text-2xl font-bold text-gradient">{formatNumber(data.totalImpressions)}</p>
                <div className="flex items-center mt-1">
                  {data.trends.impressions > 0 ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-pastel-green mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-pastel-coral mr-1" />
                  )}
                  <span className={`text-responsive-xs sm:text-sm ${data.trends.impressions > 0 ? 'text-pastel-green' : 'text-pastel-coral'}`}>
                    {Math.abs(data.trends.impressions)}%
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-pastel-blue/20 rounded-lg">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-pastel-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <p className="text-responsive-xs sm:text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-xl sm:text-2xl font-bold text-gradient">{formatNumber(data.totalClicks)}</p>
                <div className="flex items-center mt-1">
                  {data.trends.clicks > 0 ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-pastel-green mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-pastel-coral mr-1" />
                  )}
                  <span className={`text-responsive-xs sm:text-sm ${data.trends.clicks > 0 ? 'text-pastel-green' : 'text-pastel-coral'}`}>
                    {Math.abs(data.trends.clicks)}%
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-pastel-green/20 rounded-lg">
                <MousePointer className="w-5 h-5 sm:w-6 sm:h-6 text-pastel-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <p className="text-responsive-xs sm:text-sm font-medium text-muted-foreground">Total Conversions</p>
                <p className="text-xl sm:text-2xl font-bold text-gradient">{formatNumber(data.totalConversions)}</p>
                <div className="flex items-center mt-1">
                  {data.trends.conversions > 0 ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-pastel-green mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-pastel-coral mr-1" />
                  )}
                  <span className={`text-responsive-xs sm:text-sm ${data.trends.conversions > 0 ? 'text-pastel-green' : 'text-pastel-coral'}`}>
                    {Math.abs(data.trends.conversions)}%
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-pastel-yellow/20 rounded-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-pastel-yellow" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <p className="text-responsive-xs sm:text-sm font-medium text-muted-foreground">ROAS</p>
                <p className="text-xl sm:text-2xl font-bold text-gradient">{data.roas.toFixed(1)}x</p>
                <div className="flex items-center mt-1">
                  <span className="text-responsive-xs sm:text-sm text-pastel-green">
                    {formatCurrency(data.totalSpend)} spent
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-pastel-coral/20 rounded-lg">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-pastel-coral" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <p className="text-responsive-xs sm:text-sm font-medium text-muted-foreground">CTR</p>
                <p className="text-xl sm:text-2xl font-bold text-gradient">{formatPercentage(data.averageCtr)}</p>
                <p className="text-xs text-muted-foreground mt-1">Click-through rate</p>
              </div>
              <div className="p-2 sm:p-3 bg-pastel-purple/20 rounded-lg">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-pastel-purple" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <p className="text-responsive-xs sm:text-sm font-medium text-muted-foreground">Avg CPC</p>
                <p className="text-xl sm:text-2xl font-bold text-gradient">{formatCurrency(data.averageCpc)}</p>
                <p className="text-xs text-muted-foreground mt-1">Cost per click</p>
              </div>
              <div className="p-2 sm:p-3 bg-pastel-blue/20 rounded-lg">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-pastel-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <p className="text-responsive-xs sm:text-sm font-medium text-muted-foreground">Avg CPA</p>
                <p className="text-xl sm:text-2xl font-bold text-gradient">{formatCurrency(data.averageCpa)}</p>
                <p className="text-xs text-muted-foreground mt-1">Cost per acquisition</p>
              </div>
              <div className="p-2 sm:p-3 bg-pastel-green/20 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-pastel-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <p className="text-responsive-xs sm:text-sm font-medium text-muted-foreground">Conv. Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-gradient">{formatPercentage(data.conversionRate)}</p>
                <p className="text-xs text-muted-foreground mt-1">Conversion rate</p>
              </div>
              <div className="p-2 sm:p-3 bg-pastel-yellow/20 rounded-lg">
                <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-pastel-yellow" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Keywords */}
      <Card className="card-gradient card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-responsive-base sm:text-lg">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-blue" />
            <span>Top Performing Keywords</span>
          </CardTitle>
          <CardDescription className="text-responsive-xs sm:text-sm">
            Keywords with the highest performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topPerformingKeywords.map((keyword, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-background/30 rounded-lg border border-border/30 space-y-3 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <Badge variant="secondary" className="bg-pastel-blue/20 text-pastel-blue text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-responsive-sm break-words">{keyword.keyword}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-2 text-responsive-xs sm:text-sm text-muted-foreground">
                    <div>Impressions: {formatNumber(keyword.impressions)}</div>
                    <div>Clicks: {formatNumber(keyword.clicks)}</div>
                    <div>CTR: {formatPercentage(keyword.ctr)}</div>
                    <div>CPC: {formatCurrency(keyword.cpc)}</div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-lg font-bold text-gradient">{keyword.conversions}</div>
                  <div className="text-xs text-muted-foreground">conversions</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="card-gradient card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-responsive-base sm:text-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-green" />
              <span>Campaign Performance</span>
            </CardTitle>
            <CardDescription className="text-responsive-xs sm:text-sm">
              Performance breakdown by campaign type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.campaignPerformance.map((campaign, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                    <span className="font-medium text-responsive-sm">{campaign.campaign}</span>
                    <Badge variant="secondary" className="bg-pastel-green/20 text-pastel-green text-xs">
                      {campaign.roas.toFixed(1)}x ROAS
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 text-responsive-xs sm:text-sm text-muted-foreground">
                    <div>Spend: {formatCurrency(campaign.spend)}</div>
                    <div>Conversions: {campaign.conversions}</div>
                  </div>
                  <Progress value={(campaign.conversions / Math.max(...data.campaignPerformance.map(c => c.conversions))) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-responsive-base sm:text-lg">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-coral" />
              <span>Audience Insights</span>
            </CardTitle>
            <CardDescription className="text-responsive-xs sm:text-sm">
              Top performing locations and devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 text-responsive-sm">Top Locations</h4>
                <div className="space-y-2">
                  {data.audienceInsights.topLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-responsive-xs sm:text-sm">{location.location}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={location.percentage} className="w-16 sm:w-20 h-2" />
                        <span className="text-responsive-xs sm:text-sm text-muted-foreground w-10 sm:w-12 text-right">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-responsive-sm">Device Distribution</h4>
                <div className="space-y-2">
                  {data.audienceInsights.topDevices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-responsive-xs sm:text-sm">{device.device}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={device.percentage} className="w-16 sm:w-20 h-2" />
                        <span className="text-responsive-xs sm:text-sm text-muted-foreground w-10 sm:w-12 text-right">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;