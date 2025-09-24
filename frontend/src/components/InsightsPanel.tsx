import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Insight {
  label: string;
  value: string;
}

interface Props {
  brandHost?: string;
  competitorHost?: string;
  topTokens: { token: string; count: number }[];
}

const InsightsPanel = ({ brandHost, competitorHost, topTokens }: Props) => {
  return (
    <Card className="glass">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Brand & Competitor Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/30 p-3 border">
            <p className="text-muted-foreground text-xs">Brand</p>
            <p className="font-semibold break-all">{brandHost || '—'}</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 border">
            <p className="text-muted-foreground text-xs">Competitor</p>
            <p className="font-semibold break-all">{competitorHost || '—'}</p>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-2">Frequent non-branded tokens</p>
          {topTokens.length === 0 ? (
            <p className="text-muted-foreground">No notable tokens detected.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topTokens.slice(0, 12).map((t, i) => (
                <span key={i} className="px-2 py-1 rounded-full border text-xs bg-muted/40">
                  {t.token} <span className="text-muted-foreground">({t.count})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel; 