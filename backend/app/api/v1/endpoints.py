from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.services.dataforseo_service import dataforseo_service
from app.services.google_ads_service import google_ads_service
from app.services.ms_ads_service import ms_ads_service
from app.services.serp_service import serp_service

router = APIRouter()
apiRouter = router

class KeywordRequest(BaseModel):
    seed_keywords: List[str]
    brand_url: Optional[str] = None
    competitor_url: Optional[str] = None
    locations: Optional[List[str]] = Field(default=[])
    max_results: Optional[int] = Field(default=1000)

class KeywordItem(BaseModel):
    keyword: str
    avg_monthly_searches: int
    competition: str
    top_of_page_bid_low: float
    top_of_page_bid_high: float
    source: str
    intent: str
    difficulty_score: float
    opportunity_score: float

class FilterRequest(BaseModel):
    keywords: List[KeywordItem]
    min_search_volume: int = 500
    max_competition: Optional[str] = "High"
    min_opportunity_score: Optional[float] = 0.6
    exclude_branded: Optional[bool] = False

class AdGroup(BaseModel):
    name: str
    theme: str
    keywords: List[KeywordItem]
    suggested_match_types: Dict[str, List[str]]
    cpc_range: Dict[str, float]
    estimated_clicks: int
    estimated_conversions: float
    target_cpa: float

class PMaxTheme(BaseModel):
    title: str
    category: str
    description: str
    keywords: List[str]
    target_audience: str
    estimated_impressions: int
    expected_ctr: float
    asset_suggestions: Dict[str, List[str]]

class BudgetRequest(BaseModel):
    ad_groups: List[AdGroup]
    budgets: Dict[str, float]
    conversion_rate: float = 0.02
    target_roas: Optional[float] = 4.0

class CampaignOptimization(BaseModel):
    campaign_type: str
    budget_allocation: Dict[str, float]
    bid_strategy: str
    targeting_optimization: Dict[str, Any]
    creative_recommendations: List[str]
    performance_predictions: Dict[str, float]

@apiRouter.post("/generate_keywords", response_model=Dict[str, Any])
async def generate_keywords(request: KeywordRequest):
    try:
        # Priority: DataForSEO → Google Ads → Microsoft Ads → SerpAPI discovery
        real_keywords: List[Dict[str, Any]] = []

        # Parse first numeric location if provided; default to US (2840)
        location_code = 2840
        try:
            if request.locations:
                first = request.locations[0]
                if isinstance(first, str) and first.strip().isdigit():
                    location_code = int(first.strip())
        except Exception:
            pass

        if dataforseo_service.is_configured:
            real_keywords = await dataforseo_service.get_keyword_data(
                seed_keywords=request.seed_keywords,
                location_code=location_code,
                language_code="en",
                brand_url=request.brand_url,
                competitor_url=request.competitor_url,
                min_volume=300,
            )

        if not real_keywords:
            ga_keywords = await google_ads_service.get_keyword_ideas(
                seed_keywords=request.seed_keywords,
                location_ids=request.locations
            )
            if ga_keywords:
                real_keywords = ga_keywords

        if not real_keywords and request.seed_keywords:
            ms_keywords = await ms_ads_service.get_keyword_ideas(
                seed_keywords=request.seed_keywords,
                location_ids=request.locations
            )
            if ms_keywords:
                real_keywords = [
                    {
                        "keyword": k.get("keyword") or k.get("text") or "",
                        "avg_monthly_searches": k.get("avg_monthly_searches") or k.get("monthly_searches") or 0,
                        "competition": k.get("competition") or ("High" if (k.get("competition_level") or 0) > 0.66 else ("Medium" if (k.get("competition_level") or 0) > 0.33 else "Low")),
                        "low_top_of_page_bid_micros": int((k.get("cpc_low") or k.get("suggested_bid_low") or 0) * 1_000_000),
                        "high_top_of_page_bid_micros": int((k.get("cpc_high") or k.get("suggested_bid_high") or k.get("cpc") or 0) * 1_000_000),
                        "source": "ms_ads_planner"
                    }
                    for k in ms_keywords if (k.get("keyword") or k.get("text"))
                ]

        if not real_keywords and request.seed_keywords:
            discovered = await serp_service.discover_keywords(request.seed_keywords)
            real_keywords = [
                {
                    "keyword": r["keyword"],
                    "avg_monthly_searches": r.get("score", 0),
                    "competition": "Unknown",
                    "low_top_of_page_bid_micros": 0,
                    "high_top_of_page_bid_micros": 0,
                    "source": "serpapi"
                }
                for r in discovered
            ]
        
        def to_scores(volume: int, competition: str) -> Dict[str, float]:
            comp_map = {"Low": 0.2, "Medium": 0.5, "High": 0.8, "Unknown": 0.5}
            difficulty = comp_map.get(competition, 0.5)
            vol_norm = min(1.0, volume / 20000.0)
            opportunity = round(max(0.0, min(1.0, (0.7 * vol_norm) + (0.3 * (1 - difficulty)))), 3)
            return {"difficulty": round(difficulty, 3), "opportunity": opportunity}

        keyword_items = [
            KeywordItem(
                keyword=kw_data["keyword"],
                avg_monthly_searches=kw_data.get("avg_monthly_searches", 0),
                competition=kw_data.get("competition", "Unknown"),
                top_of_page_bid_low=kw_data.get("low_top_of_page_bid_micros", 0) / 1_000_000,
                top_of_page_bid_high=kw_data.get("high_top_of_page_bid_micros", 0) / 1_000_000,
                source=kw_data.get("source", "keyword_planner"),
                intent="commercial",
                **(lambda s: {"difficulty_score": s["difficulty"], "opportunity_score": s["opportunity"]})(to_scores(kw_data.get("avg_monthly_searches", 0), kw_data.get("competition", "Unknown")))
            ) for kw_data in real_keywords
        ]
        
        if not keyword_items:
            return {"status": "success", "total_keywords": 0, "keywords": [], "data_source": "none", "generated_at": datetime.now().isoformat()}
        
        data_source = (
            "dataforseo_api" if (dataforseo_service.is_configured and real_keywords and real_keywords[0].get("source") == "dataforseo") else
            ("google_ads_api" if google_ads_service.is_configured and real_keywords and real_keywords[0].get("source") != "ms_ads_planner" and real_keywords[0].get("source") != "serpapi" else
             ("ms_ads_api" if ms_ads_service.is_configured and real_keywords and real_keywords[0].get("source") == "ms_ads_planner" else "serpapi_fallback"))
        )
        
        return {
            "status": "success",
            "total_keywords": len(keyword_items),
            "keywords": keyword_items[:request.max_results],
            "data_source": data_source,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Keyword generation failed: {str(e)}")

@apiRouter.post("/filter_keywords", response_model=Dict[str, Any])
async def filter_keywords(request: FilterRequest):
    try:
        filtered_kws = [
            kw for kw in request.keywords
            if kw.avg_monthly_searches >= request.min_search_volume and
            not (request.max_competition and kw.competition == "High" and request.max_competition != "High") and
            kw.opportunity_score >= request.min_opportunity_score and
            not (request.exclude_branded and "brand" in kw.keyword.lower())
        ]
        filtered_kws.sort(key=lambda x: x.opportunity_score, reverse=True)
        return {
            "status": "success",
            "original_count": len(request.keywords),
            "filtered_count": len(filtered_kws),
            "keywords": filtered_kws,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Keyword filtering failed: {str(e)}")

@apiRouter.post("/group_keywords", response_model=Dict[str, Any])
async def group_keywords(request: FilterRequest):
    try:
        adGroups = []
        brandKws = [kw for kw in request.keywords if kw.intent == "navigational"]
        if brandKws:
            adGroups.append(AdGroup(
                name="Brand Terms",
                theme="Brand searches",
                keywords=brandKws,
                suggested_match_types={"exact": [kw.keyword for kw in brandKws], "phrase": [kw.keyword for kw in brandKws], "bmm": []},
                cpc_range={"low": 1.5, "high": 3.2},
                estimated_clicks=2500,
                estimated_conversions=50.0,
                target_cpa=50.0
            ))
        categoryKws = [kw for kw in request.keywords if kw.intent == "commercial"]
        if categoryKws:
            adGroups.append(AdGroup(
                name="Category Terms",
                theme="Product or service categories",
                keywords=categoryKws,
                suggested_match_types={"exact": [kw.keyword for kw in categoryKws[:5]], "phrase": [kw.keyword for kw in categoryKws], "bmm": [kw.keyword for kw in categoryKws]},
                cpc_range={"low": 3.2, "high": 8.5},
                estimated_clicks=1800,
                estimated_conversions=36.0,
                target_cpa=45.0
            ))
        infoKws = [kw for kw in request.keywords if kw.intent == "informational"]
        if infoKws:
            adGroups.append(AdGroup(
                name="Informational Terms",
                theme="Educational queries",
                keywords=infoKws,
                suggested_match_types={"exact": [], "phrase": [kw.keyword for kw in infoKws], "bmm": [kw.keyword for kw in infoKws]},
                cpc_range={"low": 1.2, "high": 3.5},
                estimated_clicks=1200,
                estimated_conversions=24.0,
                target_cpa=40.0
            ))
        return {"status": "success", "ad_groups": adGroups, "total_keywords": len(request.keywords)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Keyword grouping failed: {str(e)}")

@apiRouter.post("/pmax_themes", response_model=Dict[str, Any])
async def generate_pmax_themes(request: FilterRequest):
    try:
        # naive clustering by simple tokens
        buckets: Dict[str, List[str]] = {"product": [], "use_case": [], "demographic": [], "seasonal": []}
        for kw in request.keywords:
            text = kw.keyword.lower()
            if any(t in text for t in ["for men", "for women", "kids", "senior", "student"]):
                buckets["demographic"].append(kw.keyword)
            elif any(t in text for t in ["winter", "summer", "spring", "fall", "black friday", "cyber monday"]):
                buckets["seasonal"].append(kw.keyword)
            elif any(t in text for t in ["best", "near me", "how to", "vs", "review", "ideas", "tips"]):
                buckets["use_case"].append(kw.keyword)
            else:
                buckets["product"].append(kw.keyword)
        themes: List[PMaxTheme] = []
        for cat, kws in buckets.items():
            if not kws:
                continue
            themes.append(PMaxTheme(
                title=f"{cat.title()} Theme",
                category=cat,
                description=f"Asset group centered on {cat.replace('_',' ')} queries",
                keywords=kws[:30],
                target_audience="General",
                estimated_impressions=sum(k.avg_monthly_searches for k in request.keywords if k.keyword in kws),
                expected_ctr=0.02,
                asset_suggestions={"headlines": [], "descriptions": [], "images": []}
            ))
        return {"status": "success", "themes": themes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PMax theme generation failed: {str(e)}")

@apiRouter.post("/calculate_bids", response_model=Dict[str, Any])
async def calculate_bids(request: BudgetRequest):
    try:
        totalBudget = sum(request.budgets.values())
        totalConversions = sum(g.estimated_conversions for g in request.ad_groups) or 1
        targetCpa = totalBudget / totalConversions
        bidRecs = []
        for g in request.ad_groups:
            targetCpc = targetCpa * request.conversion_rate
            recommendedBid = min(max(targetCpc, g.cpc_range["low"]), g.cpc_range["high"])
            bidRecs.append({
                "ad_group_name": g.name,
                "target_cpa": targetCpa,
                "target_cpc": targetCpc,
                "recommended_bid": recommendedBid,
                "bid_range": g.cpc_range,
                "estimated_clicks": g.estimated_clicks,
                "estimated_conversions": g.estimated_conversions
            })
        expectedRoas = 4.0
        return {
            "status": "success",
            "budget_allocation": request.budgets,
            "total_budget": totalBudget,
            "target_cpa": targetCpa,
            "expected_roas": expectedRoas,
            "bid_recommendations": bidRecs,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bid calculation failed: {str(e)}")
