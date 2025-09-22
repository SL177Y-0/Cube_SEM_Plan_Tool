#  SEM Plan Tool - Ultimate Search Engine Marketing Campaign Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A small FastAPI + React project for planning SEM campaigns. It talks to Google Ads (when credentials are provided) and exposes a few endpoints the frontend calls.

## What’s here
- Backend: FastAPI (`backend/app`)
- Frontend: React + Vite + TypeScript (`frontend`)
- Minimal environment config via `.env` files (kept small on purpose)

## Requirements
- Python 3.9+
- Node.js 18+

## Environment
Only add what’s actually used by the current code.

Backend (`backend/.env`):
```
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CUSTOMER_ID=
```

Optional (backend, only if you plan to wire real trend sources):
```
GOOGLE_TRENDS_API_KEY=
SEMRUSH_API_KEY=
AHREFS_API_KEY=
```

Frontend (`frontend/.env`):
```
VITE_API_BASE_URL=http://localhost:8000
```

## Getting started
### 1) Backend
```
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

copy .env.example .env  # or cp on macOS/Linux
# Fill in your Google Ads values if you have them

uvicorn app.main:semApp --reload --host 0.0.0.0 --port 8000
```
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### 2) Frontend
```
cd frontend
npm install

copy .env.example .env  # or cp on macOS/Linux
# VITE_API_BASE_URL should point to your backend (default above)

npm run dev
```
By default Vite is set to run on port 8080 (see `frontend/vite.config.ts`).
- Frontend: http://localhost:8080

## Common endpoints (backend)
- `GET /health` — simple health check
- `GET /api/v1/trends` — trends data (falls back to static if no keys)
- `POST /api/v1/generate_keywords` — keyword ideas via Google Ads if configured

## Docker (optional)
There’s a `docker-compose.yml` if you want to run things in containers. It includes backend, frontend, Postgres, and Redis. It’s not required for local dev.
```
docker-compose up --build
```
If you use Docker, you’ll still want to provide the same env values (through Compose or `.env` files) for Google Ads.

## Notes
- The app works without Google Ads credentials, but keyword endpoints will return empty results.
- CORS is open for local development. Lock it down before deploying.
- If you change ports, update `VITE_API_BASE_URL` accordingly.

## Troubleshooting
- Frontend can’t reach the API: check `VITE_API_BASE_URL` and that the backend is running on that host/port.
- Google Ads calls return empty results: confirm all five Google Ads env vars are set and valid.
- Port conflicts: adjust `frontend/vite.config.ts` or pass a different `--port` to uvicorn.


###  AI-Powered Intelligence
- **Smart Keyword Research**: Advanced keyword discovery with AI-driven relevance scoring
- **Performance Max Optimization**: Automated PMax theme generation and optimization
- **Budget Intelligence**: AI-driven budget allocation for maximum ROAS
- **Competitive Analysis**: Advanced competitor research and market insights

### Real-Time Analytics
- **Live Google Ads Integration**: Real-time data from Google Keyword Planner
- **Performance Tracking**: Comprehensive campaign performance monitoring
- **Conversion Optimization**: Data-driven CRO recommendations
- **Trend Analysis**: SEM trend insights and best practices

### Campaign Management
- **Multi-Campaign Support**: Manage multiple campaigns from a single dashboard
- **Advanced Targeting**: Geographic, demographic, and behavioral targeting
- **A/B Testing**: Built-in testing framework for campaign optimization
- **Automated Reporting**: Scheduled reports and performance alerts

## Architecture

### Backend (FastAPI)
- **High-Performance API**: Built with FastAPI for maximum speed and reliability
- **Database**: PostgreSQL with SQLAlchemy ORM for robust data management
- **Authentication**: JWT-based security with role-based access control
- **AI Integration**: OpenAI and Anthropic API integration for intelligent features

### Frontend (React + TypeScript)
- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Component Library**: Shadcn UI components for consistent, beautiful design
- **Responsive Design**: Mobile-first approach with perfect responsiveness
- **Real-Time Updates**: Live data synchronization with backend

---
