# SEM Plan Tool

A small, practical app to build an SEM plan from a brand URL, a competitor URL, and a few constraints. It discovers keywords, filters them, groups them into ad groups, proposes PMax themes, and suggests CPC bids.

## What it uses
- Backend: FastAPI (Python)
- Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui
- Data sources (in order):
  1) Google Ads Keyword Planner
  2) Microsoft Advertising Keyword Planner
  3) SerpAPI (autocomplete/related) as a free discovery fallback

## Fallback logic (short version)
- If Google Ads keys are present and valid → use Google Keyword Planner.
- Else if Microsoft Ads keys are present → use MS Ads Keyword Planner.
- Else if `SERPAPI_KEY` is present → do discovery via Google autocomplete/related (reduced KPIs).

## Requirements
- Node 18+, npm
- Python 3.10+
- Docker (optional, for compose)

## Environment
Create `backend/.env` (or copy `backend/env.example`) and fill what you have.

Google Ads (optional but preferred):
- GOOGLE_ADS_DEVELOPER_TOKEN
- GOOGLE_ADS_CLIENT_ID
- GOOGLE_ADS_CLIENT_SECRET
- GOOGLE_ADS_REFRESH_TOKEN
- GOOGLE_ADS_CUSTOMER_ID

Microsoft Ads (optional fallback):
- MSADS_DEVELOPER_TOKEN
- MSADS_CLIENT_ID
- MSADS_CLIENT_SECRET
- MSADS_REFRESH_TOKEN
- MSADS_CUSTOMER_ID
- MSADS_ACCOUNT_ID

Discovery (optional free fallback):
- SERPAPI_KEY

Frontend `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

## Quick start (Docker)
From the repo root:
```
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend:  http://localhost:8000/docs

You can pass env vars in `docker-compose.yml` under the backend `environment:` section.

## Quick start (local dev)
Backend:
```
cd backend
python -m venv .venv
. .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:semApp --host 0.0.0.0 --port 8000
```

Frontend (new terminal):
```
cd frontend
npm install
npm run dev   # serves on :8080
```
Set `VITE_API_BASE_URL` to point at your backend (default above).

## API cheatsheet
Generate keywords
```
curl -X POST http://localhost:8000/api/v1/generate_keywords \
  -H "Content-Type: application/json" \
  -d '{
    "seed_keywords": ["vegan protein", "whey isolate"],
    "brand_url": "https://yourbrand.com",
    "competitor_url": "https://competitor.com",
    "locations": ["US"],
    "max_results": 200
  }'
```

Filter
```
curl -X POST http://localhost:8000/api/v1/filter_keywords \
  -H "Content-Type: application/json" \
  -d '{ "keywords": [], "min_search_volume": 500 }'
```

Group into ad groups
```
curl -X POST http://localhost:8000/api/v1/group_keywords \
  -H "Content-Type: application/json" \
  -d '{ "keywords": [] }'
```

PMax themes
```
curl -X POST http://localhost:8000/api/v1/pmax_themes \
  -H "Content-Type: application/json" \
  -d '{ "keywords": [] }'
```

Bid suggestions
```
curl -X POST http://localhost:8000/api/v1/calculate_bids \
  -H "Content-Type: application/json" \
  -d '{ "ad_groups": [], "budgets": {"search": 5000, "shopping": 3000, "pmax": 7000}, "conversion_rate": 0.02 }'
```

## Notes
- Secrets live in env files, not in code.
- If you only have SerpAPI, the app still works, but KPIs (volume/bids/competition) are limited.
- UI is dark, responsive, and intentionally minimal. Adjust colors in `frontend/src/index.css` if you want a different look.
