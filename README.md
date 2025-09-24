# SEM Plan Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

FastAPI + React app to generate a structured SEM plan across Search, Shopping and Performance Max using DataForSEO as primary source with Google/Microsoft/SerpAPI fallbacks.

## What’s Included
- Keyword generation (DataForSEO → Google Ads → Microsoft Ads → SerpAPI)
- Filtering, grouping, and bid calculation
- PMax themes with asset suggestions (headlines/descriptions) and estimates
- Shopping plan (derived purchase-intent terms)
- Budget summary, projections, and analytics
- Brand & competitor insights (tokenization with brand-token exclusion)
- Save/Load plan (localStorage) and Export (CSV/JSON)
- Responsive UI, strict dev port 3000

## Quick Start (Local)
1) Backend
```
cd backend
# create/activate venv if needed (already present as venv/)
venv\Scripts\pip install -r requirements.txt
venv\Scripts\python -m uvicorn app.main:semApp --host 0.0.0.0 --port 8000
```

2) Frontend
```
cd frontend
npm ci
npm run dev
# Vite on http://localhost:3000 (strictPort=true)
```

## Configuration
Environment values are read via `app/config.py:get_env`. For local dev, the file includes hardcoded fallbacks so you can run without a `.env`.
- DataForSEO: `DATAFORSEO_API_LOGIN` + `DATAFORSEO_API_PASSWORD` or `DATAFORSEO_API_KEY`
- SERPAPI: `SERPAPI_KEY`
- CORS: allow localhost dev ports

If you prefer `.env`, add it under `backend/.env` and ensure Docker compose points to it.

## Usage Tips
- Use numeric location codes (e.g., 2840 for US). The input form defaults `serviceLocations` to `2840`.
- Minimum Search Volume defaults to 100; quick presets available (50/100/300).
- If filtering returns no keywords, the UI gracefully falls back to show results.
- Save/Load buttons store/retrieve your plan in localStorage.
- Export CSV contains keyword rows by group; Export JSON contains the entire plan payload.

## Troubleshooting
- Missing modules in editor: select interpreter `backend/venv/Scripts/python.exe` in VS Code.
- DataForSEO 401: verify credentials. With API key, `Authorization: Basic <API_KEY>` is used. With login/password, `login:password` Basic is used.
- Port conflicts: the frontend is strict on 3000; free the port or stop other apps.

## Scripts
- Backend run: `venv\Scripts\python -m uvicorn app.main:semApp --host 0.0.0.0 --port 8000`
- Frontend run: `npm run dev` (in `frontend/`)

