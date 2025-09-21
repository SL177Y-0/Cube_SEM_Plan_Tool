import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronRight, 
  Target, 
  TrendingUp, 
  DollarSign,
  Search,
  Users,
  MapPin
} from "lucide-react";

interface Keyword {
  keyword: string;
  searchVolume: number;
  competition: string;
  cpcLow: number;
  cpcHigh: number;
  matchType: string;
}

interface AdGroup {
  name: string;
  theme: string;
  keywords: Keyword[];
  suggestedCpc: number;
  estimatedClicks: number;
}

interface KeywordResultsProps {
  adGroups: AdGroup[];
}

const KeywordResults = ({ adGroups }: KeywordResultsProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  const getCompetitionColor = (competition: string) => {
    // color coding for competition levels
    switch (competition.toLowerCase()) {
      case 'low': return 'text-pastel-green border-pastel-green';
      case 'medium': return 'text-pastel-yellow border-pastel-yellow';
      case 'high': return 'text-pastel-coral border-pastel-coral';
      default: return 'text-muted-foreground border-border';
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType.toLowerCase()) {
      case 'exact': return 'bg-pastel-pink text-black';
      case 'phrase': return 'bg-pastel-blue text-black';
      case 'broad': return 'bg-pastel-green text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="card-gradient card-hover scale-in">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-responsive-xl">
          <div className="p-2 sm:p-3 bg-gradient-primary rounded-xl shadow-lg">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </div>
          <span className="font-bold">Keyword Analysis by Ad Groups</span>
        </CardTitle>
        <p className="text-muted-foreground text-responsive-sm mt-2 leading-relaxed">
          Organized keyword groups with performance metrics and intelligent bid recommendations
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {adGroups.map((group, index) => (
          <Collapsible
            key={group.name}
            open={expandedGroups.includes(group.name)}
            onOpenChange={() => toggleGroup(group.name)}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between p-3 sm:p-5 h-auto border-gradient hover:bg-muted/50 hover:scale-[1.01] transition-all duration-300 group touch-target"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 min-w-0 flex-1">
                  <div className="p-2 sm:p-3 bg-muted rounded-xl group-hover:scale-110 transition-transform">
                    {group.name.includes('Brand') && <Search className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-blue" />}
                    {group.name.includes('Category') && <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-green" />}
                    {group.name.includes('Competitor') && <Users className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-coral" />}
                    {group.name.includes('Location') && <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-yellow" />}
                    {!['Brand', 'Category', 'Competitor', 'Location'].some(type => group.name.includes(type)) && 
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-pastel-purple" />}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <h3 className="font-bold text-responsive-base sm:text-lg truncate">{group.name}</h3>
                    <p className="text-responsive-xs sm:text-base text-muted-foreground line-clamp-2">{group.theme}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-responsive-xs">
                      <span className="text-muted-foreground">Keywords:</span>
                      <Badge variant="secondary" className="text-xs">{group.keywords.length}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-responsive-xs">
                      <DollarSign className="w-3 h-3 text-pastel-yellow" />
                      <span className="text-pastel-yellow font-medium">
                        ${group.suggestedCpc.toFixed(2)} CPC
                      </span>
                    </div>
                  </div>
                  
                  {expandedGroups.includes(group.name) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-3 ml-0 sm:ml-4 mt-3">
              <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-3">
                {group.keywords.map((keyword, keywordIndex) => (
                  <div 
                    key={keywordIndex}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors space-y-3 sm:space-y-0"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 min-w-0 flex-1">
                      <span className="font-medium text-foreground text-responsive-sm break-words">
                        {keyword.keyword}
                      </span>
                      <Badge className={`${getMatchTypeColor(keyword.matchType)} text-xs`}>
                        {keyword.matchType}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full sm:w-auto text-responsive-xs">
                      <div className="text-center sm:text-left">
                        <p className="text-muted-foreground text-xs">Search Volume</p>
                        <p className="font-medium text-pastel-blue">
                          {keyword.searchVolume.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="text-center sm:text-left">
                        <p className="text-muted-foreground text-xs">Competition</p>
                        <Badge variant="outline" className={`${getCompetitionColor(keyword.competition)} text-xs`}>
                          {keyword.competition}
                        </Badge>
                      </div>
                      
                      <div className="text-center sm:text-left">
                        <p className="text-muted-foreground text-xs">CPC Range</p>
                        <p className="font-medium text-pastel-yellow">
                          ${keyword.cpcLow.toFixed(2)} - ${keyword.cpcHigh.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-secondary/10 rounded-lg p-3 border border-secondary/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-responsive-xs space-y-1 sm:space-y-0">
                  <span className="text-muted-foreground">Estimated Monthly Clicks:</span>
                  <span className="font-semibold text-secondary">
                    {group.estimatedClicks.toLocaleString()}
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
};

export default KeywordResults;