import os
import logging
from typing import List, Dict, Any

from zeep import Client
from zeep.transports import Transport
from zeep.plugins import HistoryPlugin
from requests_oauthlib import OAuth2Session
from requests import Session

logger = logging.getLogger(__name__)

ADINSIGHT_WSDL = "https://clientcenter.api.bingads.microsoft.com/Api/Advertiser/AdInsight/v13/AdInsightService.svc?singleWsdl"

class MicrosoftAdsService:
    def __init__(self):
        self.developer_token = os.getenv('MSADS_DEVELOPER_TOKEN')
        self.client_id = os.getenv('MSADS_CLIENT_ID')
        self.client_secret = os.getenv('MSADS_CLIENT_SECRET')
        self.refresh_token = os.getenv('MSADS_REFRESH_TOKEN')
        self.customer_id = os.getenv('MSADS_CUSTOMER_ID')
        self.account_id = os.getenv('MSADS_ACCOUNT_ID')
        self.is_configured = all([
            self.developer_token,
            self.client_id,
            self.refresh_token,
            self.customer_id,
            self.account_id
        ])
        self._client = None
        self._history = HistoryPlugin()

    def _get_access_token(self) -> str:
        try:
            oauth = OAuth2Session(self.client_id)
            token = oauth.refresh_token(
                "https://login.live.com/oauth20_token.srf",
                refresh_token=self.refresh_token,
                client_id=self.client_id,
                client_secret=self.client_secret or "",
            )
            return token.get("access_token", "")
        except Exception as e:
            logger.error(f"MS Ads OAuth refresh failed: {e}")
            return ""

    def _ensure_client(self) -> Client:
        if self._client is not None:
            return self._client
        try:
            session = Session()
            transport = Transport(session=session, timeout=30)
            self._client = Client(wsdl=ADINSIGHT_WSDL, transport=transport, plugins=[self._history])
            return self._client
        except Exception as e:
            logger.error(f"MS Ads zeep client init failed: {e}")
            raise

    async def get_keyword_ideas(self, seed_keywords: List[str], language: str = 'en', location_ids: List[str] = None) -> List[Dict[str, Any]]:
        if not self.is_configured or not seed_keywords:
            return []
        try:
            access_token = self._get_access_token()
            if not access_token:
                return []

            client = self._ensure_client()
            service = client.create_service(
                '{https://bingads.microsoft.com/AdInsight/v13}BasicHttpBinding_IAdInsightService',
                ADINSIGHT_WSDL,
            )

            headers = {
                'AuthenticationToken': access_token,
                'DeveloperToken': self.developer_token,
                'CustomerId': int(self.customer_id),
                'AccountId': int(self.account_id),
            }

            # Build selector
            # Using GetKeywordIdeas with keywords only (no URL). For URL you can use SuggestKeywordsForUrl.
            idea_request = {
                'Keywords': seed_keywords[:50],
                'Language': language,
                # Optional: LocationIds expects array of geo location ids; skip if none
                'LocationIds': [int(x) for x in (location_ids or []) if str(x).isdigit()] or None,
                'Network': 'OwnedAndOperatedAndSyndicatedSearch',
                'IdeaAttributes': ['Keyword', 'MonthlySearchCounts', 'Competition', 'SuggestedBid'],
            }

            # zeep expects explicit type structures; for brevity, rely on dicts and zeep's coercion
            resp = service.GetKeywordIdeas(_soapheaders=headers, Selector=idea_request)

            results = []
            for idea in (resp or []):
                try:
                    text = getattr(idea, 'Keyword', None) or getattr(idea, 'Text', None)
                    monthly = 0
                    # MonthlySearchCounts may be an array; pick recent average
                    counts = getattr(idea, 'MonthlySearchCounts', None)
                    if counts and hasattr(counts, '__iter__'):
                        vals = [int(v) for v in counts if isinstance(v, (int,))]
                        if vals:
                            monthly = int(sum(vals) / max(1, len(vals)))
                    comp_val = getattr(idea, 'Competition', None)
                    if isinstance(comp_val, (int, float)):
                        comp_bucket = 'High' if comp_val > 0.66 else ('Medium' if comp_val > 0.33 else 'Low')
                    else:
                        comp_bucket = 'Unknown'
                    bid = getattr(idea, 'SuggestedBid', None)
                    bid_usd = float(bid) if isinstance(bid, (int, float)) else 0.0

                    if text:
                        results.append({
                            'keyword': str(text),
                            'avg_monthly_searches': monthly,
                            'competition': comp_bucket,
                            'low_top_of_page_bid_micros': int(max(0.0, bid_usd * 0.8) * 1_000_000),
                            'high_top_of_page_bid_micros': int(max(0.0, bid_usd * 1.2) * 1_000_000),
                            'source': 'ms_ads_planner',
                        })
                except Exception:
                    continue
            return results
        except Exception as e:
            logger.error(f"MS Ads keyword ideas error: {e}")
            return []

ms_ads_service = MicrosoftAdsService() 