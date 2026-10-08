from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.core.security import get_current_user
from app.database import init_db
from app.models.user import User
from app.routers import (
    ai_router,
    auth_router,
    checkins_router,
    dashboard_router,
    health_router,
    items_router,
    records_router,
    staff_router,
    stats_router,
    seed_router,
)
from app.schemas.auth import UserResponse

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and database seeding."""
    init_db()
    yield


app = FastAPI(
    title="CodeForge Wellbeing Platform API",
    version=settings.VERSION,
    description="Student & Staff Wellbeing Tracking, Check-in Platform, and Support Signal Engine",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Explicit allowed origins including Render frontend and local development
allowed_origins = [
    "https://codeforge-0j8e.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

for o in settings.CORS_ORIGINS:
    if o not in allowed_origins and o != "*":
        allowed_origins.append(o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^(https?:\/\/.*\.onrender\.com|http:\/\/localhost(:\d+)?|http:\/\/127\.0\.0\.1(:\d+)?)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=0,
)

# Core Wellbeing Routers
app.include_router(health_router)
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(checkins_router, prefix="/api/v1/checkins", tags=["Daily Check-ins"])
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["Student Dashboard"])
app.include_router(staff_router, prefix="/api/v1/staff", tags=["Staff Support Signals"])
app.include_router(seed_router, prefix="/api/v1/seed", tags=["Demo Seeder"])


@app.get(
    "/api/v1/student/me",
    response_model=UserResponse,
    tags=["Authentication"],
    summary="Get current student profile",
)
def student_me_alias(user: User = Depends(get_current_user)):
    return UserResponse.model_validate(user)


# Include utility routers (hackathon foundation)
app.include_router(records_router, prefix="/api/v1/records", tags=["Records & Pipelines"])
app.include_router(stats_router, prefix="/api/v1/stats", tags=["Dashboard Stats"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI & Playground"])
app.include_router(items_router, prefix="/api/v1/items", tags=["Items"])


@app.get("/", tags=["Root"])
def root_endpoint():
    """Root endpoint for quick API discovery."""
    return {
        "message": "CodeForge Wellbeing & Check-in Platform API is active",
        "status": "ok",
        "docs": "/docs",
        "health": "/health",
        "version": settings.VERSION,
    }
