# SEM Plan Tool — End‑to‑End Written Report

This is a practical SEM planner I’d happily hand to a teammate. You drop in a brand URL, a competitor, a couple of seeds, a country code (e.g., 2840 for US), and some budget assumptions. It fetches ideas, cleans them up, organizes the mess into ad groups and PMax themes, and gives you enough KPIs and exports to have a decent planning conversation.

---

## What it does (in one breath)
- Pulls keyword ideas + KPIs (volume, competition, CPCs)
- Filters noise and strips brand tokens
- Groups into sensible ad groups
- Proposes PMax themes (with starter assets)
- Estimates clicks/conversions/cost and gives bids
- Exports CSV/JSON, can Save/Load a plan, works on mobile

---

## The simple flow I had in mind
1. You give it:
   - Seed keywords, brand/competitor URLs, locations, budgets
2. Backend fetches keywords in this priority:
   - DataForSEO → Google Ads → Microsoft Ads → SerpAPI (as discovery fallback)
3. It standardizes the data and adds tiny helper scores
4. It filters and groups the keywords, then drafts PMax themes
5. It projects budgets and bids, then ships everything to the UI

The UI is deliberately plain: one big form, a clean results page, buttons to save/export, and an analytics card for totals.

---

## Why DataForSEO is the primary source
Real talk: it’s the fastest way to get both ideas and KPIs without wrestling ad accounts.
- One provider, multiple endpoints (ideas + KPIs)
- Easy auth (API key or basic auth)
- Good enough coverage to make first‑pass plans credible
- If the well is dry (quota, key issue, niche space), we gracefully fall back

Fallbacks still matter:
- **Google Ads Keyword Planner**: classic, authoritative CPC/volume signals; many teams trust it
- **Microsoft Ads Keyword Planner**: complementary coverage; sometimes cheaper CPC pockets
- **SerpAPI**: last‑resort discovery (autocomplete/related) so you’re never stuck with an empty page

---

## Backend (FastAPI) — what’s where
- `app/main.py`: FastAPI app + CORS; mounts v1 API; `/health`
- `app/api/v1/endpoints.py`: the façade:
  - `POST /generate_keywords`: orchestrates providers and normalizes output
  - `POST /filter_keywords`: min volume, comp cap, simple brand exclusion
  - `POST /group_keywords`: tidy ad groups (brand/category/info)
  - `POST /pmax_themes`: buckets into themes and returns **basic asset suggestions**
  - `POST /calculate_bids`: small CPA‑ish model; expected clicks + conversions
- `app/services/dataforseo_service.py`: auth; ideas → (optional labs expand) → KPIs; filtering; normalized shape
- `app/services/google_ads_service.py`: Keyword Plan Ideas; normalized competition/CPC
- `app/services/ms_ads_service.py`: SOAP client; normalized results
- `app/services/serp_service.py`: discovery fallback via SerpAPI
- `app/config.py`: `get_env()` with dev fallbacks; supports `ALLOWED_ORIGINS`

Data shape we keep consistent:
```json
{
  "keyword": "whey isolate",
  "avg_monthly_searches": 12100,
  "competition": "Medium",
  "low_top_of_page_bid_micros": 1500000,
  "high_top_of_page_bid_micros": 2800000,
  "source": "dataforseo"
}
```

---

## Frontend (Vite/React) — what’s where
- `src/pages/Index.tsx`: the whole user story—form → API calls → display → save/export
- `src/components/SEMInputForm.tsx`: inputs; defaults to US (2840); quick min‑volume chips
- `src/components/KeywordResults.tsx`: collapsible groups; mobile‑safe keyword rows (truncation + wrapped badge)
- `src/components/PMaxThemes.tsx`: themes with impressions and a few suggested assets
- `src/components/BudgetSummary.tsx`: budgets, clicks, conversions, ROAS; quick visuals
- `src/components/AnalyticsDashboard.tsx`: CTR/CPC/CPA + totals
- `src/components/ShoppingPlan.tsx`: purchase‑intent slice (e.g., “buy”, “deal”, “free shipping”)
- `src/components/InsightsPanel.tsx`: brand/competitor hostnames + frequent non‑branded tokens
- `src/services/api.ts`: axios with types; `VITE_API_BASE_URL` drives which backend it talks to

UX choices:
- It’s fast to skim, especially on a call
- It flexes down to phones (important for stakeholder screenshots)
- Exports are one click (CSV/JSON); Save/Load for local drafts

---

## How the numbers are treated (sanely, not sacred)
- We don’t pretend to be a full forecasting suite. It’s a realistic scaffold:
  - CPC from provider → clicks given the budget → conversions from your rate
  - Bid suggestions tightened to each group’s CPC range
  - ROAS shown as a headline so a non‑technical stakeholder sees the “why”

If you want more, the code is ready for:
- Embedding‑based grouping, better CPx modeling, historical lift, and seasonality

---

## Deployment (short and sweet)
Backend (Render)
- Root: `backend/`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:semApp --host 0.0.0.0 --port $PORT`
- Env: `DATAFORSEO_API_*`, `SERPAPI_KEY`, `ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app`
- Check: `/health` returns `{"status":"healthy"}`

Frontend (Vercel)
- Root: `frontend/`
- Build: `npm ci && npm run build`
- Output: `dist`
- Env: `VITE_API_BASE_URL=https://<your-render>.onrender.com`

If you see CORS, add the exact Vercel URL to `ALLOWED_ORIGINS` in Render and redeploy.

---

## How I’d extend this next
- **Persist plans** server‑side (SQLite) with share links
- **Cache** provider calls by (seed, location, min volume)
- **Smarter PMax assets** by category (templates + examples)
- **Light tests** (FastAPI endpoints + UI smoke tests) so refactors feel safe

---

## TL;DR
- DataForSEO first because it gives ideas + KPIs without ceremony
- Google Ads + Microsoft Ads are ready when you have those accounts/keys
- SerpAPI means you never get an empty plan page
- The plan is readable, exportable, and easy to evolve

It’s built like something a person would actually use to get moving—today. If you want me to tune it for your vertical (or wire in your own CPC history), point me at the data and I’ll slot it in cleanly.

---

## Feature Map (at a glance)

| Area | Feature | Where | Notes |
|---|---|---|---|
| Inputs | Brand/Competitor URLs, Locations, Seeds, Budgets | `frontend/src/components/SEMInputForm.tsx` | Location preset 2840 (US); min‑volume chips 50/100/300 |
| Keyword Fetch | Provider priority (DataForSEO → Google Ads → MS Ads → SerpAPI) | `backend/app/api/v1/endpoints.py` | Unified result shape; graceful fallbacks |
| DataForSEO | Ideas + KPIs; Labs enrich + Search Volume | `backend/app/services/dataforseo_service.py` | API key or login/password; brand token exclusion |
| Google Ads | Keyword Plan Ideas | `backend/app/services/google_ads_service.py` | Competition mapped to Low/Med/High |
| Microsoft Ads | Keyword Ideas (SOAP) | `backend/app/services/ms_ads_service.py` | OAuth refresh; normalized CPC/volume |
| Discovery | Autocomplete/related (SerpAPI) | `backend/app/services/serp_service.py` | Last‑resort when planners unavailable |
| Filtering | Min volume, comp guard, brand exclusion | `backend/app/api/v1/endpoints.py` (filter) | Inputs from UI; lowers noise |
| Grouping | Brand/Category/Informational | `backend/app/api/v1/endpoints.py` (group) | Simple but readable clusters |
| PMax Themes | Themes + basic asset suggestions | `backend/app/api/v1/endpoints.py` (pmax_themes) | Headlines/descriptions derived from top terms |
| Budget/Bids | CPC→clicks→conversions; CPA‑ish bids | `backend/app/api/v1/endpoints.py` (calculate_bids) | Shows ROAS, per‑group hints |
| Keyword List | Collapsible groups, mobile‑safe rows | `frontend/src/components/KeywordResults.tsx` | Truncation, wrapped badge; no overflow |
| PMax UI | Themes card | `frontend/src/components/PMaxThemes.tsx` | Counts + impressions |
| Budget UI | Summary + breakdown + utilization | `frontend/src/components/BudgetSummary.tsx` | One‑glance digest for stakeholders |
| Analytics | Totals, CTR/CPC/CPA | `frontend/src/components/AnalyticsDashboard.tsx` | Computed from groups/themes/budget |
| Shopping Slice | Purchase‑intent keywords | `frontend/src/components/ShoppingPlan.tsx` | “buy/deal/free shipping” heuristics |
| Insights | Brand/competitor tokens | `frontend/src/components/InsightsPanel.tsx` | Frequent non‑branded tokens |
| Save/Export | Save/Load + CSV/JSON | `frontend/src/pages/Index.tsx` | LocalStorage; CSV rows by group |
| CORS/Config | `get_env` + ALLOWED_ORIGINS | `backend/app/config.py` | Works local + cloud (Render/Vercel) |
| Deploy | Render (API) / Vercel (UI) | `README.md`, `BEGINNER_DEPLOY_GUIDE.md` | Env: VITE_API_BASE_URL, ALLOWED_ORIGINS |

