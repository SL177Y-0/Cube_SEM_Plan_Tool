import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEMInputForm from "@/components/SEMInputForm";
import KeywordResults from "@/components/KeywordResults";
import PMaxThemes from "@/components/PMaxThemes";
import BudgetSummary from "@/components/BudgetSummary";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { api, KeywordItem, AdGroup as ApiAdGroup } from "@/services/api";

const Index = () => {
  const [status, setStatus] = useState<'idle'|'generating'|'finished'>('idle');
  const [adGroups, setAdGroups] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [budget, setBudget] = useState({ totalBudget: 0, overallRoas: 0, conversionRate: 0, breakdown: [] as any[] });
  const [lastInputs, setLastInputs] = useState<{ brandUrl?: string; competitorUrl?: string }>({});

  const isGenerating = status === 'generating';

  const handleFormSubmit = async (data: any) => {
    try {
      setStatus('generating');
      setLastInputs({ brandUrl: data.brandUrl, competitorUrl: data.competitorUrl });

      const seed_keywords = data.seedKeywords
        ? data.seedKeywords.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

      const locations = data.serviceLocations
        ? data.serviceLocations.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

      const gen: any = await api.generateKeywords({
        seed_keywords,
        locations,
        brand_url: data.brandUrl,
        competitor_url: data.competitorUrl
      });
      const keywords: KeywordItem[] = gen.keywords || [];

      const filt: any = await api.filterKeywords({
        keywords,
        min_search_volume: Number(data.minSearchVolume) || 500,
      });

      const filtered = filt.keywords || [];

      const grouped: any = await api.groupKeywords({ keywords: filtered });
      const groups = grouped.ad_groups || [];
      setAdGroups(groups);

      const pmax: any = await api.generatePMaxThemes({ keywords: filtered });
      setThemes(pmax.themes || []);

      const budgets = {
        search: Number(data.searchBudget) || 0,
        shopping: Number(data.shoppingBudget) || 0,
        pmax: Number(data.pmaxBudget) || 0,
      };
      const bids: any = await api.calculateBids({ ad_groups: groups as unknown as ApiAdGroup[], budgets, conversion_rate: Number(data.conversionRate) / 100 });
      setBudget({
        totalBudget: bids.total_budget || 0,
        overallRoas: bids.expected_roas || 0,
        conversionRate: Number(data.conversionRate)/100 || 0,
        breakdown: (bids.bid_recommendations || []).map((r: any) => ({
          campaignType: r.ad_group_name,
          budget: budgets.search + budgets.shopping + budgets.pmax > 0 ? (budgets.search + budgets.shopping + budgets.pmax) / (adGroups.length || 1) : 0,
          expectedCpc: r.target_cpc,
          estimatedClicks: r.estimated_clicks,
          estimatedConversions: r.estimated_conversions,
          expectedRoas: bids.expected_roas,
        })),
      });

      setStatus('finished');
    } catch (e) {
      setStatus('idle');
      console.error(e);
    }
  };

  const handleReset = () => {
    setAdGroups([]);
    setThemes([]);
    setBudget({ totalBudget: 0, overallRoas: 0, conversionRate: 0, breakdown: [] });
    setLastInputs({});
    setStatus('idle');
  };

  const getFavicon = (url?: string) => {
    try {
      if (!url) return '';
      const u = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-3xl font-bold text-gradient">SEM Tool</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-md bg-pastel-blue/20 text-pastel-blue border border-pastel-blue/30">Search</span>
            <span className="text-xs px-2 py-1 rounded-md bg-pastel-green/20 text-pastel-green border border-pastel-green/30">Shopping</span>
            <span className="text-xs px-2 py-1 rounded-md bg-pastel-coral/20 text-pastel-coral border border-pastel-coral/30">PMax</span>
          </div>
        </div>

        {status === 'idle' && (
          <div className="form-stage w-full">
            <div aria-hidden className="form-backdrop" />
            <SEMInputForm onSubmit={handleFormSubmit} isLoading={isGenerating} />
          </div>
        )}

        {isGenerating && (
          <div className="max-w-4xl mx-auto">
            <Card className="card-gradient">
              <CardContent className="p-10 sm:p-12 text-center">
                <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-pastel-blue border-t-transparent rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-2 sm:mb-4">Generating Plan</h3>
                <p className="text-slate-300 text-sm sm:text-base">Collecting keyword ideas and computing groups & bids...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {status === 'finished' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gradient">SEM Campaign Plan</h2>
              <div className="flex items-center space-x-3">
                {getFavicon(lastInputs.brandUrl) && (
                  <img src={getFavicon(lastInputs.brandUrl)} alt="brand" className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
                )}
                {getFavicon(lastInputs.competitorUrl) && (
                  <img src={getFavicon(lastInputs.competitorUrl)} alt="competitor" className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
                )}
                <Button onClick={handleReset} variant="outline">New Plan</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <KeywordResults adGroups={adGroups.map((g: any) => ({
                  name: g.name,
                  theme: g.theme,
                  suggestedCpc: (g.cpc_range?.low + g.cpc_range?.high) / 2 || 0,
                  estimatedClicks: g.estimated_clicks,
                  keywords: g.keywords.map((k: any) => ({
                    keyword: k.keyword,
                    searchVolume: k.avg_monthly_searches,
                    competition: k.competition || 'Unknown',
                    cpcLow: k.top_of_page_bid_low || 0,
                    cpcHigh: k.top_of_page_bid_high || 0,
                    matchType: 'phrase'
                  }))
                }))} />
                <PMaxThemes themes={themes.map((t: any) => ({
                  title: t.title,
                  category: t.category,
                  description: t.description,
                  keywords: t.keywords || [],
                  targetAudience: t.target_audience || 'General',
                  estimatedImpressions: t.estimated_impressions || 0,
                  expectedCtr: t.expected_ctr || 0,
                }))} />
              </div>
              <div className="space-y-6">
                <BudgetSummary 
                  budgetBreakdown={budget.breakdown}
                  totalBudget={budget.totalBudget}
                  overallRoas={budget.overallRoas}
                  conversionRate={budget.conversionRate}
                />
                <AnalyticsDashboard data={{
                  totalImpressions: 0,
                  totalClicks: 0,
                  totalConversions: 0,
                  totalSpend: budget.totalBudget,
                  averageCtr: 0,
                  averageCpc: 0,
                  averageCpa: 0,
                  roas: budget.overallRoas,
                  conversionRate: budget.conversionRate,
                  trends: { impressions: 0, clicks: 0, conversions: 0, spend: 0 },
                  topPerformingKeywords: [],
                  campaignPerformance: [],
                  audienceInsights: { topLocations: [], topDevices: [], topTimeSlots: [] }
                }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
