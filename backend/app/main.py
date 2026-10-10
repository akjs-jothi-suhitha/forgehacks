from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.api.v1 import health, learning, progress, tutor

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="ConceptForge AI — Adaptive conceptual learning platform evaluating reasoning, not just answers."
)

# Set up CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(learning.router, prefix=f"{settings.API_V1_STR}/learning", tags=["Learning"])
app.include_router(progress.router, prefix=settings.API_V1_STR, tags=["Progress"])
app.include_router(tutor.router, prefix=f"{settings.API_V1_STR}/tutor", tags=["Tutor"])

# Locate frontend dist directory
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import HTTPException

FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if not FRONTEND_DIST.exists():
    FRONTEND_DIST = Path("/app/frontend/dist")

if FRONTEND_DIST.exists() and (FRONTEND_DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
        raise HTTPException(status_code=404, detail="Not Found")

    if FRONTEND_DIST.exists():
        if full_path:
            file_path = FRONTEND_DIST / full_path
            if file_path.is_file():
                return FileResponse(file_path)
        index_file = FRONTEND_DIST / "index.html"
        if index_file.is_file():
            return FileResponse(index_file)

    return {
        "message": "Welcome to ConceptForge AI API",
        "tagline": "Learn the concept. Connect the ideas. Apply the knowledge.",
        "docs_url": "/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }

