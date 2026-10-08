from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.database import init_db
from app.routers import (
    ai_router,
    auth_router,
    health_router,
    items_router,
    notifications_router,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and shutdown events."""
    # Ensure database tables exist
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for Render frontend and local development
allow_all = "*" in settings.CORS_ORIGINS

if allow_all:
    # Allow all origins while also supporting credentials
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"^https?://.*$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_origin_regex=settings.CORS_ORIGIN_REGEX,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include Routers
app.include_router(health_router)
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI Orchestration"])
app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(items_router, prefix="/api/v1/items", tags=["Items"])


@app.get("/", tags=["Root"])
def root_endpoint():
    """Root endpoint for quick API discovery."""
    return {
        "message": "Fusion Hackathon API is running",
        "status": "ok",
        "docs": "/docs",
        "health": "/health",
        "version": settings.VERSION,
    }
