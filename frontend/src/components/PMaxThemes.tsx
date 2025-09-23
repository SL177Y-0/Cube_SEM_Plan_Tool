import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PMaxTheme {
  title: string;
  category: string;
  description: string;
  keywords: string[];
  targetAudience: string;
  estimatedImpressions: number;
  expectedCtr: number;
}

interface PMaxProps {
  themes: PMaxTheme[];
}

const PMaxThemes = ({ themes }: PMaxProps) => {
  return (
    <Card className="glass">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Performance Max Themes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {themes.length === 0 ? (
          <p className="text-muted-foreground">No themes generated yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((t, idx) => (
              <div key={idx} className="rounded-xl border border-border/60 p-4 bg-card/40">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{t.title}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{t.category}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-muted/40 px-3 py-2">Keywords: <span className="font-medium">{t.keywords.length}</span></div>
                  <div className="rounded-lg bg-muted/40 px-3 py-2">Est. Impr: <span className="font-medium">{t.estimatedImpressions}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PMaxThemes;
