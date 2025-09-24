import logging
from typing import List, Dict, Any
import requests
from ..config import get_env

logger = logging.getLogger(__name__)

class SerpService:
    def __init__(self):
        self.api_key = get_env('SERPAPI_KEY')
        self.base_url = 'https://serpapi.com/search.json'
        self.is_configured = bool(self.api_key)
        if not self.is_configured:
            logger.warning("SerpAPI key not configured - discovery will be disabled")

    def _get(self, params: Dict[str, Any]) -> Dict[str, Any]:
        try:
            params = {**params, 'api_key': self.api_key}
            r = requests.get(self.base_url, params=params, timeout=20)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            logger.error(f"SerpAPI request failed: {e}")
            return {}

    async def discover_keywords(self, seeds: List[str]) -> List[Dict[str, Any]]:
        if not self.is_configured or not seeds:
            return []
        collected: Dict[str, int] = {}
        # Google Autocomplete and Related Searches per seed
        for seed in seeds[:5]:
            # Autocomplete via engine=google, google_domain default, q=seed, feature: 'autocomplete' (provided in inline_results)
            data = await self._autocomplete(seed)
            for kw in data:
                collected[kw] = collected.get(kw, 0) + 3
            # Related searches via normal search endpoint
            related = await self._related_searches(seed)
            for kw in related:
                collected[kw] = collected.get(kw, 0) + 2
        # flatten to list
        return [{"keyword": k, "score": v} for k, v in collected.items()]

    async def _autocomplete(self, query: str) -> List[str]:
        try:
            res = self._get({
                'engine': 'google',
                'q': query,
                'google_domain': 'google.com',
                'hl': 'en',
                'num': 10
            })
            # SerpAPI returns 'inline_images' and others; autocomplete suggestions often under 'suggested_searches' or 'inline_results'
            suggestions: List[str] = []
            # Try 'suggested_searches'
            for s in (res.get('suggested_searches') or []):
                text = s.get('query') or s.get('title')
                if text:
                    suggestions.append(str(text))
            # Try 'related_questions'
            for s in (res.get('related_questions') or []):
                q = s.get('question')
                if q:
                    suggestions.append(str(q))
            return list(dict.fromkeys(suggestions))
        except Exception as e:
            logger.error(f"autocomplete error: {e}")
            return []

    async def _related_searches(self, query: str) -> List[str]:
        try:
            res = self._get({
                'engine': 'google',
                'q': query,
                'google_domain': 'google.com',
                'hl': 'en'
            })
            related: List[str] = []
            for item in (res.get('related_searches') or []):
                q = item.get('query') or item.get('title')
                if q:
                    related.append(str(q))
            return list(dict.fromkeys(related))
        except Exception as e:
            logger.error(f"related_searches error: {e}")
            return []

serp_service = SerpService()
