import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  brandUrl: string;
  competitorUrl: string;
  serviceLocations: string;
  seedKeywords: string;
  shoppingBudget: string;
  searchBudget: string;
  pmaxBudget: string;
  conversionRate: string;
  minSearchVolume: string;
}

interface SEMInputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-sm tracking-wide text-muted-foreground uppercase">{title}</h3>
    {children}
  </div>
);

const fieldCls = "bg-input/70 border border-border text-foreground rounded-xl focus-visible:ring-2 focus-visible:ring-primary/60 transition duration-200";

const SEMInputForm = ({ onSubmit, isLoading = false }: SEMInputFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    brandUrl: "", competitorUrl: "", serviceLocations: "",
    seedKeywords: "",
    shoppingBudget: "", searchBudget: "", pmaxBudget: "",
    conversionRate: "2.0", minSearchVolume: "500"
  });

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.brandUrl.trim() === '' && formData.seedKeywords.trim() === '') {
      toast({ title: "Missing input", description: "Provide brand URL or seed keywords.", variant: "destructive" });
      return;
    }
    if (formData.competitorUrl.trim() === '') {
      toast({ title: "Missing competitor", description: "Competitor URL is required.", variant: "destructive" });
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="glass w-full">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold">SEM Campaign Planner</CardTitle>
        <p className="text-sm text-muted-foreground">Enter inputs to generate keywords and themes.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Section title="Business Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="brandUrl" className="text-xs text-muted-foreground">Brand Website URL</Label>
                <Input id="brandUrl" type="url" placeholder="https://yourbrand.com" value={formData.brandUrl} onChange={handleInputChange} className={fieldCls} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="competitorUrl" className="text-xs text-muted-foreground">Competitor Website URL *</Label>
                <Input id="competitorUrl" type="url" placeholder="https://competitor.com" value={formData.competitorUrl} onChange={handleInputChange} className={fieldCls} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="serviceLocations" className="text-xs text-muted-foreground">Service Locations</Label>
              <Textarea id="serviceLocations" placeholder="New York, Los Angeles, Chicago" value={formData.serviceLocations} onChange={handleInputChange} className={fieldCls + " min-h-[72px]"} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seedKeywords" className="text-xs text-muted-foreground">Seed Keywords (comma-separated)</Label>
              <Input id="seedKeywords" type="text" placeholder="vegan protein, post workout, whey isolate" value={formData.seedKeywords} onChange={handleInputChange} className={fieldCls} />
            </div>
          </Section>

          <Separator className="bg-border/40" />

          <Section title="Budget & Constraints">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="searchBudget" className="text-xs text-muted-foreground">Search Budget ($)</Label>
                <Input id="searchBudget" type="number" placeholder="5000" value={formData.searchBudget} onChange={handleInputChange} className={fieldCls} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shoppingBudget" className="text-xs text-muted-foreground">Shopping Budget ($)</Label>
                <Input id="shoppingBudget" type="number" placeholder="3000" value={formData.shoppingBudget} onChange={handleInputChange} className={fieldCls} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pmaxBudget" className="text-xs text-muted-foreground">PMax Budget ($)</Label>
                <Input id="pmaxBudget" type="number" placeholder="7000" value={formData.pmaxBudget} onChange={handleInputChange} className={fieldCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="conversionRate" className="text-xs text-muted-foreground">Expected Conversion Rate (%)</Label>
                <Input id="conversionRate" type="number" step="0.1" placeholder="2.0" value={formData.conversionRate} onChange={handleInputChange} className={fieldCls} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minSearchVolume" className="text-xs text-muted-foreground">Minimum Search Volume</Label>
                <Input id="minSearchVolume" type="number" placeholder="500" value={formData.minSearchVolume} onChange={handleInputChange} className={fieldCls} />
              </div>
            </div>
          </Section>

          <div className="flex justify-center pt-2">
            <Button type="submit" disabled={isLoading} variant="pill" className="bg-gradient-primary text-black px-8 py-3 font-semibold button-glow">
              {isLoading ? "Generating..." : "Generate SEM Plan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SEMInputForm;
