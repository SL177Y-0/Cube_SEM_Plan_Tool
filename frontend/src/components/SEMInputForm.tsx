import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Globe, Users, DollarSign, Zap, Brain, TrendingUp, MapPin, Target, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SEMInputData {
  brandUrl: string;
  competitorUrl: string;
  serviceLocations: string;
  shoppingBudget: string;
  searchBudget: string;
  pmaxBudget: string;
  conversionRate: string;
  includeSemanticSearch: boolean;
  includeAIOverviews: boolean;
  minSearchVolume: string;
}

interface SEMInputFormProps {
  onSubmit: (data: SEMInputData) => void;
  isLoading?: boolean;
}

const SEMInputForm = ({ onSubmit, isLoading = false }: SEMInputFormProps) => {
  const [formData, setFormData] = useState<SEMInputData>({
    brandUrl: "",
    competitorUrl: "",
    serviceLocations: "",
    shoppingBudget: "",
    searchBudget: "",
    pmaxBudget: "",
    conversionRate: "2.0",
    includeSemanticSearch: true,
    includeAIOverviews: true,
    minSearchVolume: "500"
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // validation - learned this the hard way when users kept breaking things
    if (!formData.brandUrl || !formData.competitorUrl) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in both brand URL and competitor URL.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof SEMInputData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="card-gradient card-hover scale-in">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl">
            <Brain className="w-6 h-6 text-black" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gradient">
              AI-Powered SEM Campaign Planner
            </CardTitle>
            <p className="text-slate-300 mt-1">
              Generate comprehensive campaigns with intelligent keyword research and optimization
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-pastel-blue/20 text-pastel-blue border-pastel-blue/30">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="secondary" className="bg-pastel-green/20 text-pastel-green border-pastel-green/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            2025 Trends
          </Badge>
          <Badge variant="secondary" className="bg-pastel-coral/20 text-pastel-coral border-pastel-coral/30">
            <Target className="w-3 h-3 mr-1" />
            Smart Bidding
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-pastel-blue" />
              <h3 className="text-lg font-semibold">Business Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brandUrl" className="text-sm font-medium text-white">
                  Brand Website URL *
                </Label>
                <Input
                  id="brandUrl"
                  type="url"
                  placeholder="https://yourbrand.com"
                  value={formData.brandUrl}
                  onChange={(e) => handleInputChange("brandUrl", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-black focus:border-pastel-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="competitorUrl" className="text-sm font-medium text-white">
                  Competitor Website URL *
                </Label>
                <Input
                  id="competitorUrl"
                  type="url"
                  placeholder="https://competitor.com"
                  value={formData.competitorUrl}
                  onChange={(e) => handleInputChange("competitorUrl", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-black focus:border-pastel-blue"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceLocations" className="text-sm font-medium text-white">
                Service Locations
              </Label>
              <Textarea
                id="serviceLocations"
                placeholder="New York, Los Angeles, Chicago (comma-separated)"
                value={formData.serviceLocations}
                onChange={(e) => handleInputChange("serviceLocations", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-black focus:border-pastel-blue min-h-[80px]"
              />
            </div>
          </div>
          
          <Separator className="bg-border/30" />
          
          {/* Budget Allocation */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-pastel-green" />
              <h3 className="text-lg font-semibold">Budget Allocation</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="searchBudget" className="text-sm font-medium text-white">
                  Search Campaign Budget
                </Label>
                <Input
                  id="searchBudget"
                  type="number"
                  placeholder="5000"
                  value={formData.searchBudget}
                  onChange={(e) => handleInputChange("searchBudget", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-black focus:border-pastel-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shoppingBudget" className="text-sm font-medium text-white">
                  Shopping Campaign Budget
                </Label>
                <Input
                  id="shoppingBudget"
                  type="number"
                  placeholder="3000"
                  value={formData.shoppingBudget}
                  onChange={(e) => handleInputChange("shoppingBudget", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-black focus:border-pastel-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pmaxBudget" className="text-sm font-medium text-white">
                  Performance Max Budget
                </Label>
                <Input
                  id="pmaxBudget"
                  type="number"
                  placeholder="7000"
                  value={formData.pmaxBudget}
                  onChange={(e) => handleInputChange("pmaxBudget", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-black focus:border-pastel-blue"
                />
              </div>
            </div>
          </div>
          
          <Separator className="bg-border/30" />
          
          {/* Advanced Settings */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-pastel-coral" />
              <h3 className="text-lg font-semibold">Advanced Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="conversionRate" className="text-sm font-medium text-white">
                  Expected Conversion Rate (%)
                </Label>
                <Input
                  id="conversionRate"
                  type="number"
                  step="0.1"
                  placeholder="2.0"
                  value={formData.conversionRate}
                  onChange={(e) => handleInputChange("conversionRate", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-black focus:border-pastel-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minSearchVolume" className="text-sm font-medium text-white">
                  Minimum Search Volume
                </Label>
                <Input
                  id="minSearchVolume"
                  type="number"
                  placeholder="500"
                  value={formData.minSearchVolume}
                  onChange={(e) => handleInputChange("minSearchVolume", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-black focus:border-pastel-blue"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-white">Include Semantic Search</Label>
                  <p className="text-xs text-slate-300">
                    Generate keywords based on semantic search patterns
                  </p>
                </div>
                <Switch
                  checked={formData.includeSemanticSearch}
                  onCheckedChange={(checked) => handleInputChange("includeSemanticSearch", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-white">Include AI Overview Keywords</Label>
                  <p className="text-xs text-slate-300">
                    Generate keywords optimized for AI Overview results
                  </p>
                </div>
                <Switch
                  checked={formData.includeAIOverviews}
                  onCheckedChange={(checked) => handleInputChange("includeAIOverviews", checked)}
                />
              </div>
            </div>
          </div>
          
          <Separator className="bg-border/30" />
          
          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="button-glow bg-gradient-primary hover:bg-gradient-primary/90 text-black px-8 py-3 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                  Generating AI-Powered Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate SEM Campaign Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SEMInputForm;