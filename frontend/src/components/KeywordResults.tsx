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

interface KeywordProps {
  adGroups: AdGroup[];
}

const competitionColors = {
  low: 'text-pastel-green border-pastel-green',
  medium: 'text-pastel-yellow border-pastel-yellow',
  high: 'text-pastel-coral border-pastel-coral',
  default: 'text-muted-foreground border-border'
};

const matchTypeColors = {
  exact: 'bg-pastel-pink text-black',
  phrase: 'bg-pastel-blue text-black',
  broad: 'bg-pastel-green text-black',
  default: 'bg-muted text-muted-foreground'
};

const groupIcons = {
  'Brand': <Search className="w-5 h-5 text-pastel-blue" />,
  'Category': <TrendingUp className="w-5 h-5 text-pastel-green" />,
  'Competitor': <Users className="w-5 h-5 text-pastel-coral" />,
  'Location': <MapPin className="w-5 h-5 text-pastel-yellow" />
};

const KeywordResults = ({ adGroups }: KeywordProps) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set<string>());

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const s = new Set(prev);
      if (s.has(groupName)) s.delete(groupName); else s.add(groupName);
      return s;
    });
  };

  const getCompetitionColor = (competition: string) => competitionColors[competition.toLowerCase()] || competitionColors.default;
  const getMatchTypeColor = (matchType: string) => matchTypeColors[matchType.toLowerCase()] || matchTypeColors.default;

  return (
    <Card className="glass">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Keyword Groups</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {adGroups.map((group) => (
          <Collapsible key={group.name} open={expandedGroups.has(group.name)} onOpenChange={() => toggleGroup(group.name)} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="pill" className="w-full justify-between p-4 h-auto overflow-hidden">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="p-2 bg-muted rounded-xl">
                    {Object.keys(groupIcons).find(key => group.name.includes(key)) ? groupIcons[Object.keys(groupIcons).find(key => group.name.includes(key))] : <Target className="w-5 h-5 text-pastel-purple" />}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{group.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{group.theme}</p>
                    <div className="sm:hidden mt-1 flex items-center gap-2 text-[11px]">
                      <span className="text-muted-foreground">Keywords:</span>
                      <Badge variant="secondary" className="text-[10px]">{group.keywords.length}</Badge>
                      <span className="text-muted-foreground ml-2">CPC:</span>
                      <span className="text-pastel-yellow font-medium">${(group.suggestedCpc || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-muted-foreground">Keywords:</span>
                      <Badge variant="secondary" className="text-xs">{group.keywords.length}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <DollarSign className="w-3 h-3 text-pastel-yellow" />
                      <span className="text-pastel-yellow font-medium">${group.suggestedCpc.toFixed(2)} CPC</span>
                    </div>
                  </div>
                  {expandedGroups.has(group.name) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-3 ml-0 mt-3">
              <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                {group.keywords.map((keyword, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2.5 sm:p-3 bg-card rounded-lg border gap-2 sm:gap-3 overflow-hidden">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium break-words hyphens-auto min-w-0 truncate sm:whitespace-normal" title={keyword.keyword}>{keyword.keyword}</span>
                        <Badge className={`${getMatchTypeColor(keyword.matchType)} text-[10px] sm:text-xs shrink-0 hidden sm:inline-flex`}>{keyword.matchType}</Badge>
                      </div>
                      <div className="sm:hidden mt-1">
                        <Badge className={`${getMatchTypeColor(keyword.matchType)} text-[10px]`}>{keyword.matchType}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto text-[11px] sm:text-xs sm:min-w-[260px]">
                      <div className="text-center sm:text-left">
                        <p className="text-muted-foreground">Volume</p>
                        <p className="font-medium text-pastel-blue">{keyword.searchVolume.toLocaleString()}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-muted-foreground">Comp</p>
                        <Badge variant="outline" className={`${getCompetitionColor(keyword.competition)} text-[10px] sm:text-xs`}>{keyword.competition}</Badge>
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
                        <p className="text-muted-foreground">CPC</p>
                        <p className="font-medium text-pastel-yellow">${keyword.cpcLow.toFixed(2)} - ${keyword.cpcHigh.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-secondary/10 rounded-lg p-3 border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Estimated Monthly Clicks</span>
                  <span className="font-semibold text-secondary">{group.estimatedClicks.toLocaleString()}</span>
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
