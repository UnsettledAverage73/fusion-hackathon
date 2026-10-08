import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_health_check(client):
    """Test required GET /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root_endpoint(client):
    """Test GET / endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "/health" in data["health"]


def test_cors_preflight_localhost(client):
    """Test CORS preflight for local frontend development."""
    response = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_cors_preflight_render_domain(client):
    """Test CORS preflight for Render-hosted frontend."""
    response = client.options(
        "/api/v1/items",
        headers={
            "Origin": "https://my-awesome-frontend.onrender.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://my-awesome-frontend.onrender.com"


def test_crud_items(client):
    """Test REST API CRUD functionality for items."""
    # 1. Create item
    create_payload = {
        "title": "Hackathon Demo Item",
        "description": "Building a fullstack project with FastAPI and React",
        "is_completed": False,
    }
    res = client.post("/api/v1/items", json=create_payload)
    assert res.status_code == 201
    item = res.json()
    assert item["title"] == create_payload["title"]
    assert item["description"] == create_payload["description"]
    assert item["is_completed"] is False
    assert "id" in item
    item_id = item["id"]

    # 2. List items
    res = client.get("/api/v1/items")
    assert res.status_code == 200
    items = res.json()
    assert len(items) == 1
    assert items[0]["id"] == item_id

    # 3. Get item by ID
    res = client.get(f"/api/v1/items/{item_id}")
    assert res.status_code == 200
    assert res.json()["title"] == create_payload["title"]

    # 4. Update item
    update_payload = {"is_completed": True, "title": "Updated Hackathon Demo Item"}
    res = client.put(f"/api/v1/items/{item_id}", json=update_payload)
    assert res.status_code == 200
    updated_item = res.json()
    assert updated_item["is_completed"] is True
    assert updated_item["title"] == "Updated Hackathon Demo Item"

    # 5. Delete item
    res = client.delete(f"/api/v1/items/{item_id}")
    assert res.status_code == 200

    # 6. Verify 404 after deletion
    res = client.get(f"/api/v1/items/{item_id}")
    assert res.status_code == 404


def test_auth_google_config(client):
    """Test GET /api/v1/auth/google/config endpoint."""
    res = client.get("/api/v1/auth/google/config")
    assert res.status_code == 200
    data = res.json()
    assert "client_id" in data
    assert "redirect_uri" in data


def test_auth_demo_login_and_me(client):
    """Test 1-click demo login and protected /me profile endpoint."""
    res = client.post("/api/v1/auth/demo")
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "judge.demo@fusion-hackathon.dev"
    token = data["access_token"]

    # Verify protected /me endpoint with Bearer token
    res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    user = res.json()
    assert user["email"] == "judge.demo@fusion-hackathon.dev"
    assert user["role"] == "judge"


def test_notifications_slack_dispatch(client):
    """Test POST /api/v1/notifications/slack endpoint."""
    payload = {
        "title": "Unit Test Alert",
        "message": "Testing Slack dispatch pipeline",
        "severity": "INFO",
        "details": {"Env": "pytest", "Status": "pass"},
    }
    res = client.post("/api/v1/notifications/slack", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "delivered" in data
    assert "message" in data


def test_ai_orchestration_semif_groq_sarvam(client):
    """Test POST /api/v1/ai/run hybrid SemIf orchestration."""
    # 1. Complex prompt triggering Groq route
    res = client.post("/api/v1/ai/run", json={"prompt": "Explain and write python code to optimize database queries."})
    assert res.status_code == 200
    data = res.json()
    assert data["route_selected"] == "DEEP_GROQ"
    assert "probabilities" in data
    assert "DEEP_GROQ" in data["probabilities"]
    assert data["latency_ms"] >= 0

    # 2. Indic prompt triggering Sarvam route
    res_indic = client.post("/api/v1/ai/run", json={"prompt": "नमस्ते, मला मराठी भाषेत मदत हवी आहे."})
    assert res_indic.status_code == 200
    data_indic = res_indic.json()
    assert data_indic["route_selected"] == "INDIC_SARVAM"
    assert data_indic["probabilities"]["INDIC_SARVAM"] > 0.5


