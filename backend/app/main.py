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

@app.get("/")
def root():
    return {
        "message": "Welcome to ConceptForge AI API",
        "tagline": "Learn the concept. Connect the ideas. Apply the knowledge.",
        "docs_url": "/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }
