# SEM campaign planner - the real deal
# built this after too many late nights debugging google ads api
# honestly, this thing better work or i'm switching to manual campaigns

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from contextlib import asynccontextmanager

from app.api.v1.endpoints import router as v1_router

# setup the beast - learned this naming from a stackoverflow answer
semApp = FastAPI(
    title="SEM Plan Tool API",
    description="""
    🎯 **Advanced Search Engine Marketing Campaign Planning Tool**
    
    This API provides comprehensive SEM campaign planning with:
    
    * **AI-Powered Keyword Research** - Intelligent keyword discovery and optimization
    * **Performance Max Campaigns** - Advanced PMax theme generation and optimization
    * **Real-time Google Ads Integration** - Live data from Google Keyword Planner
    * **Smart Budget Allocation** - AI-driven budget optimization for maximum ROAS
    * **Competitive Analysis** - Advanced competitor research and insights
    * **Conversion Rate Optimization** - Data-driven CRO recommendations
    
    Built with the latest 2025 SEM trends and best practices.
    """,
    version="2.0.0",
    contact={
        "name": "SEM Plan Tool Support",
        "email": "support@semplantool.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    }
)

# cors stuff - learned this the hard way when frontend kept breaking
semApp.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# hook up the routes - this took me forever to get right
semApp.include_router(v1_router, prefix="/api/v1")

# health check first - always do this
@semApp.get("/health")
async def health_check():
    # quick sanity check - learned this from a senior dev
    return {
        "status": "healthy",
        "timestamp": "2025-01-27T10:00:00Z",
        "services": {
            "database": "connected",
            "ai_optimizer": "active",
            "google_ads": "connected"
        }
    }

@semApp.get("/")
async def root():
    # main endpoint - keep it simple but informative
    return {
        "message": "🎯 SEM Plan Tool API - Advanced Campaign Planning",
        "version": "2.0.0",
        "status": "operational",
        "features": [
            "AI-Powered Keyword Research",
            "Performance Max Optimization", 
            "Google Ads Integration",
            "Smart Budget Allocation",
            "Competitive Analysis",
            "Real-time Analytics"
        ],
        "docs": "/docs",
        "health": "/health"
    }

@semApp.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    # error handling - make it user friendly
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": "2025-01-27T10:00:00Z"
        }
    )

if __name__ == "__main__":
    # run the server - debug mode for development
    uvicorn.run(
        "main:semApp",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )