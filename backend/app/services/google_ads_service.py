import os
import logging
from typing import List, Dict, Any
from datetime import datetime, timedelta
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

logger = logging.getLogger(__name__)

class GoogleAdsService:
    def __init__(self):
        self.g_client_id = os.getenv('GOOGLE_ADS_CLIENT_ID')
        self.g_client_secret = os.getenv('GOOGLE_ADS_CLIENT_SECRET')
        self.g_refresh_token = os.getenv('GOOGLE_ADS_REFRESH_TOKEN')
        self.dev_token = os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')
        self.customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')
        self.is_configured = all([self.g_client_id, self.g_client_secret, self.g_refresh_token, self.dev_token, self.customer_id])
        self.client = None
        if self.is_configured:
            try:
                self._initialize_client()
            except Exception as e:
                logger.error(f"Google Ads client init failed: {e}")
                self.is_configured = False

    def _map_competition_level(self, competition_enum) -> str:
        return {0: "Unknown", 1: "Unknown", 2: "Low", 3: "Medium", 4: "High"}.get(competition_enum, "Unknown")

    def _initialize_client(self):
        cfg = {
            "developer_token": self.dev_token,
            "client_id": self.g_client_id,
            "client_secret": self.g_client_secret,
            "refresh_token": self.g_refresh_token,
            "use_proto_plus": True,
        }
        self.client = GoogleAdsClient.load_from_dict(cfg)
        logger.info("Google Ads client initialized")
    
    async def get_keyword_ideas(self, seed_keywords: List[str], language_id: str = "1000", location_ids: List[str] = None) -> List[Dict[str, Any]]:
        if not self.is_configured:
            return []
        try:
            planner_svc = self.client.get_service("KeywordPlanIdeaService")
            req = self.client.get_type("GenerateKeywordIdeasRequest")
            req.customer_id = self.customer_id
            req.language = self.client.get_service("GoogleAdsService").language_constant_path(language_id)
            if location_ids:
                for loc_id in location_ids:
                    geo_target = self.client.get_service("GoogleAdsService").geographic_target_constant_path(loc_id)
                    req.geo_target_constants.append(geo_target)
            if seed_keywords:
                ks = self.client.get_type("KeywordSeed")
                for k in seed_keywords:
                    ks.keywords.append(k)
                req.keyword_seed = ks
            response = planner_svc.generate_keyword_ideas(request=req)
            return [
                {
                    "keyword": r.text,
                    "avg_monthly_searches": r.keyword_idea_metrics.avg_monthly_searches,
                    "competition": self._map_competition_level(r.keyword_idea_metrics.competition),
                    "competition_index": r.keyword_idea_metrics.competition_index,
                    "low_top_of_page_bid_micros": r.keyword_idea_metrics.low_top_of_page_bid_micros,
                    "high_top_of_page_bid_micros": r.keyword_idea_metrics.high_top_of_page_bid_micros,
                    "source": "keyword_planner",
                }
                for r in response if r.keyword_idea_metrics
            ]
        except GoogleAdsException as e:
            logger.error(f"Google Ads API error: {e}")
            return []
        except Exception as e:
            logger.error(f"get_keyword_ideas error: {e}")
            return []

google_ads_service = GoogleAdsService()
