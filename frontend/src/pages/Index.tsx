import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEMInputForm from "@/components/SEMInputForm";
import KeywordResults from "@/components/KeywordResults";
import PMaxThemes from "@/components/PMaxThemes";
import BudgetSummary from "@/components/BudgetSummary";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import ShoppingPlan from "@/components/ShoppingPlan";
import InsightsPanel from "@/components/InsightsPanel";
import { api, KeywordItem, AdGroup as ApiAdGroup } from "@/services/api";

const Index = () => {
  const [status, setStatus] = useState<'idle'|'generating'|'finished'>('idle');
  const [adGroups, setAdGroups] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [budget, setBudget] = useState({ totalBudget: 0, overallRoas: 0, conversionRate: 0, breakdown: [] as any[] });
  const [lastInputs, setLastInputs] = useState<{ brandUrl?: string; competitorUrl?: string }>({});
  const [analytics, setAnalytics] = useState<any>(null);

  // helpers for export/save
  const download = (filename: string, content: string, type = 'text/csv') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toCsv = (rows: any[], headers: string[]) => {
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g,'""')}"`;
    const head = headers.join(',');
    const body = rows.map(r => headers.map(h => escape(r[h])).join(',')).join('\n');
    return head + '\n' + body;
  };

  const handleSave = () => {
    const payload = { adGroups, themes, budget, inputs: lastInputs };
    localStorage.setItem('sem_plan_last', JSON.stringify(payload));
  };

  const handleLoad = () => {
    const raw = localStorage.getItem('sem_plan_last');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setAdGroups(parsed.adGroups || []);
      setThemes(parsed.themes || []);
      setBudget(parsed.budget || { totalBudget: 0, overallRoas: 0, conversionRate: 0, breakdown: [] });
      setLastInputs(parsed.inputs || {});
      // recompute analytics
      const totImpr = (parsed.themes || []).reduce((s: number, t: any) => s + (t.estimated_impressions || t.estimatedImpressions || 0), 0);
      const totClicks = (parsed.adGroups || []).reduce((s: number, g: any) => s + (g.estimated_clicks || 0), 0);
      const totConv = (parsed.adGroups || []).reduce((s: number, g: any) => s + (g.estimated_conversions || 0), 0);
      setAnalytics({
        totalImpressions: totImpr,
        totalClicks: totClicks,
        totalConversions: totConv,
        totalSpend: parsed.budget?.totalBudget || 0,
        averageCtr: totImpr ? (totClicks / totImpr) : 0,
        averageCpc: totClicks ? ((parsed.budget?.totalBudget || 0) / totClicks) : 0,
        averageCpa: totConv ? ((parsed.budget?.totalBudget || 0) / totConv) : 0,
        roas: parsed.budget?.overallRoas || 0,
        conversionRate: parsed.budget?.conversionRate || 0,
        trends: { impressions: totImpr, clicks: totClicks, conversions: totConv, spend: parsed.budget?.totalBudget || 0 },
        topPerformingKeywords: [],
        campaignPerformance: [],
        audienceInsights: { topLocations: [], topDevices: [], topTimeSlots: [] }
      });
      setStatus('finished');
    } catch {}
  };

  const handleExportCsv = () => {
    const rows = adGroups.flatMap((g: any) => g.keywords.map((k: any) => ({
      group: g.name,
      keyword: k.keyword,
      volume: k.avg_monthly_searches,
      competition: k.competition || 'Unknown',
      cpc_low: k.top_of_page_bid_low || 0,
      cpc_high: k.top_of_page_bid_high || 0,
    })));
    const csv = toCsv(rows, ['group','keyword','volume','competition','cpc_low','cpc_high']);
    download('sem_plan_keywords.csv', csv);
  };

  const handleExportJson = () => {
    download('sem_plan.json', JSON.stringify({ adGroups, themes, budget, inputs: lastInputs }, null, 2), 'application/json');
  };

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
        min_search_volume: Number(data.minSearchVolume) || 100,
      });

      let filtered = filt.keywords || [];
      if ((!filtered || filtered.length === 0) && keywords.length > 0) {
        filtered = keywords;
      }

      const grouped: any = await api.groupKeywords({ keywords: filtered });
      let groups = grouped.ad_groups || [];
      if ((!groups || groups.length === 0) && filtered.length > 0) {
        groups = [
          {
            name: "General Terms",
            theme: "Auto-grouped keywords",
            keywords: filtered,
            suggested_match_types: { exact: [], phrase: [], bmm: [] },
            cpc_range: { low: 1.0, high: 3.0 },
            estimated_clicks: Math.max(200, Math.min(2000, filtered.length * 10)),
            estimated_conversions: Math.max(5, Math.round(filtered.length * 0.2)),
            target_cpa: 50,
          },
        ] as unknown as ApiAdGroup[];
      }
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
          budget: budgets.search + budgets.shopping + budgets.pmax > 0 ? (budgets.search + budgets.shopping + budgets.pmax) / (groups.length || 1) : 0,
          expectedCpc: r.target_cpc,
          estimatedClicks: r.estimated_clicks,
          estimatedConversions: r.estimated_conversions,
          expectedRoas: bids.expected_roas,
        })),
      });

      // compute analytics from groups/themes/budget
      const totalImpressions = (pmax.themes || []).reduce((s: number, t: any) => s + (t.estimated_impressions || 0), 0);
      const totalClicks = groups.reduce((s: number, g: any) => s + (g.estimated_clicks || 0), 0);
      const totalConversions = groups.reduce((s: number, g: any) => s + (g.estimated_conversions || 0), 0);
      const totalSpend = (bids.total_budget || 0);
      setAnalytics({
        totalImpressions,
        totalClicks,
        totalConversions,
        totalSpend,
        averageCtr: totalImpressions ? (totalClicks / totalImpressions) : 0,
        averageCpc: totalClicks ? (totalSpend / totalClicks) : 0,
        averageCpa: totalConversions ? (totalSpend / totalConversions) : 0,
        roas: bids.expected_roas || 0,
        conversionRate: Number(data.conversionRate)/100 || 0,
        trends: { impressions: totalImpressions, clicks: totalClicks, conversions: totalConversions, spend: totalSpend },
        topPerformingKeywords: [],
        campaignPerformance: [],
        audienceInsights: { topLocations: [], topDevices: [], topTimeSlots: [] }
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
    <div className="min-h-screen">
      <div className="container-responsive section-spacing">
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
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {getFavicon(lastInputs.brandUrl) && (
                  <img src={getFavicon(lastInputs.brandUrl)} alt="brand" className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
                )}
                {getFavicon(lastInputs.competitorUrl) && (
                  <img src={getFavicon(lastInputs.competitorUrl)} alt="competitor" className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
                )}
                <Button size="sm" variant="outline" onClick={handleSave}>Save</Button>
                <Button size="sm" variant="outline" onClick={handleLoad}>Load</Button>
                <Button size="sm" variant="outline" onClick={handleExportCsv}>CSV</Button>
                <Button size="sm" variant="outline" onClick={handleExportJson}>JSON</Button>
                <Button size="sm" onClick={handleReset} variant="outline">New</Button>
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

                {/* Simple Shopping plan derived from keywords with purchase intent tokens */}
                <ShoppingPlan groups={(function(){
                  const purchaseTokens = ["buy","price","deal","discount","coupon","best","shop","for sale","free shipping"];
                  const shoppingKeywords = adGroups.flatMap((g: any) => g.keywords).filter((k: any) => {
                    const t = (k.keyword || '').toLowerCase();
                    return purchaseTokens.some(pt => t.includes(pt));
                  }).slice(0, 40);
                  if (shoppingKeywords.length === 0) return [];
                  return [{
                    title: "Product-focused Terms",
                    items: shoppingKeywords.map((k: any) => ({
                      keyword: k.keyword,
                      estimatedImpressions: Math.max(200, Math.round((k.avg_monthly_searches || 0) * 0.6)),
                      suggestedCpc: Math.max(0.5, (k.top_of_page_bid_low || 1))
                    }))
                  }];
                })()} />

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
                <AnalyticsDashboard data={analytics || {
                  totalImpressions: 0,
                  totalClicks: 0,
                  totalConversions: 0,
                  totalSpend: budget.totalBudget,
                  averageCtr: 0,
                  averageCpc: 0,
                  averageCpa: 0,
                  roas: budget.overallRoas,
                  conversionRate: budget.conversionRate * 100,
                  trends: { impressions: 0, clicks: 0, conversions: 0, spend: 0 },
                  topPerformingKeywords: [],
                  campaignPerformance: [],
                  audienceInsights: { topLocations: [], topDevices: [], topTimeSlots: [] }
                }} />

                {/* Insights */}
                <InsightsPanel 
                  brandHost={(function(){ try { return lastInputs.brandUrl ? new URL(lastInputs.brandUrl).hostname : undefined } catch { return undefined } })()}
                  competitorHost={(function(){ try { return lastInputs.competitorUrl ? new URL(lastInputs.competitorUrl).hostname : undefined } catch { return undefined } })()}
                  topTokens={(function(){
                    const stop = new Set(["the","and","for","with","best","near","me","vs","how","to","in","of"]);
                    const brandTokens = new Set((function(){
                      const all: string[] = [];
                      const push = (u?: string) => { try { if(!u) return; const h=new URL(u).hostname; h.split('.').forEach(p=>{ if(p && !['www','com','net','org'].includes(p)) all.push(p.toLowerCase()); }); } catch {} };
                      push(lastInputs.brandUrl); push(lastInputs.competitorUrl);
                      return all;
                    })());
                    const counts: Record<string, number> = {};
                    adGroups.flatMap((g:any)=>g.keywords).forEach((k:any)=>{
                      const words = String(k.keyword||'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
                      words.forEach(w=>{
                        if(stop.has(w) || brandTokens.has(w)) return;
                        counts[w] = (counts[w]||0)+1;
                      })
                    });
                    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([token,count])=>({token, count: count as number}));
                  })()}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
