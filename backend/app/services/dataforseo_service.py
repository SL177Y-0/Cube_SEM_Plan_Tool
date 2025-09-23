import os
import base64
import json
import logging
from urllib.parse import urlparse
from typing import List, Dict, Any, Set

import requests

logger = logging.getLogger(__name__)

class DataForSEOService:
    """Thin wrapper around DataForSEO v3 Keywords Data + Labs endpoints.
    Strategy:
    - Try Keywords Data: google_ads/keywords_for_keywords/live for KPIs
    - If results are sparse, pull Labs keyword_ideas/live to expand, then enrich KPIs via
      google_ads/search_volume/live on the new terms
    - Apply simple min volume filter and brand exclusions
    """

    def __init__(self) -> None:
        self.api_login = os.getenv("DATAFORSEO_API_LOGIN")
        self.api_password = os.getenv("DATAFORSEO_API_PASSWORD")
        self.api_key = os.getenv("DATAFORSEO_API_KEY")
        self.base = os.getenv("DATAFORSEO_BASE_URL", "https://api.dataforseo.com")
        self.session = requests.Session()

        self.is_configured = bool((self.api_login and self.api_password) or self.api_key)
        if not self.is_configured:
            logger.warning("DataForSEO credentials not configured - skipping as primary source")

    def _auth_headers(self) -> Dict[str, str]:
        if self.api_key:
            return {"Authorization": f"Basic {base64.b64encode((self.api_key + ':').encode()).decode()}"}
        if self.api_login and self.api_password:
            token = base64.b64encode(f"{self.api_login}:{self.api_password}".encode()).decode()
            return {"Authorization": f"Basic {token}"}
        return {}

    def _post(self, path: str, payload: Any) -> Dict[str, Any]:
        url = f"{self.base}{path}"
        try:
            resp = self.session.post(url, headers=self._auth_headers(), json=payload, timeout=30)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            logger.error(f"DataForSEO POST {path} failed: {e}")
            return {}

    def _hostname_tokens(self, url: str) -> Set[str]:
        try:
            host = urlparse(url).hostname or ""
            parts = [p for p in host.split(".") if p and p not in {"www", "com", "net", "org"}]
            return set(parts)
        except Exception:
            return set()

    def _filter_terms(self, items: List[Dict[str, Any]], min_volume: int, exclude_tokens: Set[str]) -> List[Dict[str, Any]]:
        cleaned: List[Dict[str, Any]] = []
        for it in items:
            kw = (it.get("keyword") or "").strip()
            if not kw:
                continue
            if any(tok in kw.lower() for tok in exclude_tokens):
                continue
            vol = int(it.get("avg_monthly_searches") or it.get("search_volume") or 0)
            if vol < min_volume:
                continue
            cleaned.append(it)
        return cleaned

    def _map_kpi_item(self, kw: Dict[str, Any]) -> Dict[str, Any]:
        text = kw.get("keyword") or kw.get("se_type")
        volume = int(kw.get("avg_monthly_searches") or kw.get("search_volume") or 0)
        comp_val = kw.get("competition")
        if isinstance(comp_val, (int, float)):
            competition = "High" if comp_val > 0.66 else ("Medium" if comp_val > 0.33 else "Low")
        else:
            competition = str(comp_val or "Unknown").title() if comp_val else "Unknown"
        cpc_usd = 0.0
        if isinstance(kw.get("cpc"), (int, float)):
            cpc_usd = float(kw.get("cpc"))
        elif isinstance(kw.get("ad_click_probability"), (int, float)) and isinstance(kw.get("cpc_distribution"), dict):
            cpc_usd = float(kw.get("ad_click_probability", 0.0)) * 2.0
        if not text:
            return {}
        return {
            "keyword": str(text),
            "avg_monthly_searches": volume,
            "competition": competition,
            "low_top_of_page_bid_micros": int(max(0.0, cpc_usd * 0.8) * 1_000_000),
            "high_top_of_page_bid_micros": int(max(0.0, cpc_usd * 1.2) * 1_000_000),
            "source": "dataforseo",
        }

    def _kdd_keywords_for_keywords(self, seeds: List[str], location_code: int, language_code: str) -> List[Dict[str, Any]]:
        tasks = [{"keywords": seeds[:50], "location_code": location_code, "language_code": language_code}]
        data = self._post("/v3/keywords_data/google_ads/keywords_for_keywords/live", tasks)
        results: List[Dict[str, Any]] = []
        for task in (data.get("tasks") or []):
            for item in (task.get("result") or []):
                for kw in (item.get("items") or []):
                    mapped = self._map_kpi_item(kw)
                    if mapped:
                        results.append(mapped)
        return results

    def _labs_keyword_ideas(self, seeds: List[str], location_code: int, language_code: str, limit: int = 300) -> List[str]:
        # Labs keyword ideas endpoint
        payload = [{
            "keyword": seeds[0],
            "location_code": location_code,
            "language_code": language_code,
            "limit": min(1000, max(100, limit))
        }]
        data = self._post("/v3/dataforseo_labs/google/keyword_ideas/live", payload)
        out: List[str] = []
        for task in (data.get("tasks") or []):
            for item in (task.get("result") or []):
                for it in (item.get("items") or []):
                    text = it.get("keyword") or it.get("se_type")
                    if text:
                        out.append(str(text))
        # de-dupe preserve order
        seen: Set[str] = set()
        deduped: List[str] = []
        for k in out:
            if k not in seen:
                seen.add(k)
                deduped.append(k)
        return deduped[:limit]

    def _kdd_search_volume(self, keywords: List[str], location_code: int, language_code: str) -> List[Dict[str, Any]]:
        # Enrich list with KPIs (volume/CPC may be included here as well)
        if not keywords:
            return []
        payload = [{
            "keywords": keywords[:700],
            "location_code": location_code,
            "language_code": language_code
        }]
        data = self._post("/v3/keywords_data/google_ads/search_volume/live", payload)
        results: List[Dict[str, Any]] = []
        for task in (data.get("tasks") or []):
            for item in (task.get("result") or []):
                for kw in (item.get("items") or []):
                    mapped = self._map_kpi_item(kw)
                    if mapped:
                        results.append(mapped)
        return results

    async def get_keyword_data(self, seed_keywords: List[str], location_code: int = 2840, language_code: str = "en", brand_url: str = None, competitor_url: str = None, min_volume: int = 300) -> List[Dict[str, Any]]:
        if not self.is_configured or not seed_keywords:
            return []

        exclude_tokens: Set[str] = set()
        for url in [brand_url, competitor_url]:
            exclude_tokens |= self._hostname_tokens(url or "")

        # 1) Try Keywords Data (KPIs included)
        primary = self._kdd_keywords_for_keywords(seed_keywords, location_code, language_code)

        # 2) If sparse, expand with Labs ideas and enrich via Search Volume
        if len(primary) < 30:
            try:
                ideas = self._labs_keyword_ideas(seed_keywords, location_code, language_code, limit=400)
                # remove already present
                present = {p["keyword"] for p in primary}
                to_enrich = [k for k in ideas if k not in present]
                enriched = self._kdd_search_volume(to_enrich, location_code, language_code)
                primary.extend(enriched)
            except Exception as e:
                logger.error(f"Labs enrichment failed: {e}")

        # 3) Apply filtering and map
        filtered = self._filter_terms(primary, min_volume=min_volume, exclude_tokens={t.lower() for t in exclude_tokens})
        return filtered


dataforseo_service = DataForSEOService() 