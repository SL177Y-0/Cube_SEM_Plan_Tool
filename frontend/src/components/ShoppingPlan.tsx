import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ShoppingItem {
  keyword: string;
  estimatedImpressions: number;
  suggestedCpc: number;
}

interface ShoppingGroup {
  title: string;
  items: ShoppingItem[];
}

interface Props {
  groups: ShoppingGroup[];
}

const ShoppingPlan = ({ groups }: Props) => {
  return (
    <Card className="glass">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Shopping Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.length === 0 ? (
          <p className="text-muted-foreground">No Shopping ideas detected.</p>
        ) : (
          <div className="space-y-4">
            {groups.map((g, gi) => (
              <div key={gi} className="rounded-xl border p-4 bg-card/40">
                <h4 className="font-semibold mb-3">{g.title}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {g.items.map((it, ii) => (
                    <div key={ii} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                      <div className="min-w-0 pr-2">
                        <p className="font-medium truncate" title={it.keyword}>{it.keyword}</p>
                        <p className="text-xs text-muted-foreground">Impr: {it.estimatedImpressions.toLocaleString()}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="text-pastel-yellow font-medium">${it.suggestedCpc.toFixed(2)} CPC</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingPlan; 