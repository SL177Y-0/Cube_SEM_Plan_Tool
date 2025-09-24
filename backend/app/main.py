from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from .api.v1.endpoints import router as v1_router

semApp = FastAPI(
    title="SEM Plan Tool API",
    description="Search engine marketing planning API: keyword generation, grouping, themes, and bids.",
    version="2.0.0",
)

semApp.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

semApp.include_router(v1_router, prefix="/api/v1")

@semApp.get("/health")
async def health_check():
    return {"status": "healthy"}

@semApp.get("/")
async def root():
    return {
        "message": "SEM Plan Tool API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
    }

@semApp.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})

if __name__ == "__main__":
    # run the server - debug mode for development
    uvicorn.run(
        "main:semApp",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
