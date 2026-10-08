from datetime import date, timedelta
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# In-memory SQLite for isolated test runs
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
    """Test GET /health returns status ok."""
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_cors_preflight(client):
    """Test CORS preflight allows Render frontend."""
    res = client.options(
        "/api/v1/checkins",
        headers={
            "Origin": "https://codeforge-0j8e.onrender.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "https://codeforge-0j8e.onrender.com"


# ==========================================
# GOLDEN PATH TESTS (Section 21 of Roadmap)
# ==========================================

def test_golden_path_register_login_checkin_dashboard(client):
    """Test 1: Register -> Login -> Check-in -> Dashboard Summary & Trends."""
    # 1. Register student
    reg_payload = {
        "name": "Atharva Test",
        "email": "atharva.test@campus.edu",
        "password": "password123",
        "role": "student",
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 201
    auth_data = res.json()
    assert "access_token" in auth_data
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": "atharva.test@campus.edu",
        "password": "password123",
    })
    assert login_res.status_code == 200

    # 3. Submit today's checkin
    checkin_payload = {
        "mood": "neutral",
        "stress_level": 4,
        "sleep_quality": 2,
        "nutrition": 3,
        "physical_activity": 3,
        "academic_pressure": 4,
        "social_interaction": 2,
        "private_note": "Final exam preparations.",
    }
    c_res = client.post("/api/v1/checkins", json=checkin_payload, headers=headers)
    assert c_res.status_code == 201
    c_data = c_res.json()
    assert c_data["stress_level"] == 4
    assert c_data["private_note"] == "Final exam preparations."

    # 4. View dashboard summary
    dash_res = client.get("/api/v1/dashboard/summary", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["today_status"]["completed"] is True
    assert dash_data["today_status"]["stress_level"] == 4
    assert "wellbeing_insight" in dash_data

    # 5. View dashboard trends
    trend_res = client.get("/api/v1/dashboard/trends", headers=headers)
    assert trend_res.status_code == 200
    trend_data = trend_res.json()
    assert len(trend_data["history_7d"]) == 7


def test_three_high_stress_days_triggers_support_signal(client):
    """Test 2: Three consecutive days of stress >= 4 triggers a Support Signal."""
    # Register student
    reg = client.post("/api/v1/auth/register", json={
        "name": "Stress Student",
        "email": "stress@campus.edu",
        "password": "password123",
        "role": "student",
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    today = date.today()

    # Day 1: 2 days ago
    client.post("/api/v1/checkins", json={
        "date": (today - timedelta(days=2)).isoformat(),
        "mood": "low",
        "stress_level": 4,
        "sleep_quality": 1,
    }, headers=headers)

    # Day 2: yesterday
    client.post("/api/v1/checkins", json={
        "date": (today - timedelta(days=1)).isoformat(),
        "mood": "very_low",
        "stress_level": 5,
        "sleep_quality": 1,
    }, headers=headers)

    # Day 3: today -> Should trigger Support Signal!
    res = client.post("/api/v1/checkins", json={
        "date": today.isoformat(),
        "mood": "very_low",
        "stress_level": 4,
        "sleep_quality": 1,
    }, headers=headers)

    assert res.status_code == 201
    data = res.json()
    assert data["support_signal"] is True
    assert "High stress" in data["support_reason"]
    assert data["date_range"] is not None


def test_student_cannot_access_other_student_checkin(client):
    """Test 3: Student A cannot access Student B's check-in (Strict RBAC)."""
    # Student A
    reg_a = client.post("/api/v1/auth/register", json={
        "name": "Student A",
        "email": "studenta@campus.edu",
        "password": "password123",
        "role": "student",
    })
    token_a = reg_a.json()["access_token"]

    # Student B
    reg_b = client.post("/api/v1/auth/register", json={
        "name": "Student B",
        "email": "studentb@campus.edu",
        "password": "password123",
        "role": "student",
    })
    token_b = reg_b.json()["access_token"]

    # Student A creates check-in
    res = client.post(
        "/api/v1/checkins",
        json={"mood": "good", "stress_level": 2, "sleep_quality": 3, "private_note": "A's secret"},
        headers={"Authorization": f"Bearer {token_a}"},
    )
    checkin_id = res.json()["id"]

    # Student B tries to access Student A's check-in -> 403 Forbidden!
    attack = client.get(
        f"/api/v1/checkins/{checkin_id}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert attack.status_code == 403


def test_staff_sees_signal_without_private_note(client):
    """Test 4: Staff sees signal, but privacy boundary hides private student notes."""
    # 1. Register Staff
    staff_reg = client.post("/api/v1/auth/register", json={
        "name": "Prof Smith",
        "email": "smith@campus.edu",
        "password": "password123",
        "role": "staff",
    })
    staff_token = staff_reg.json()["access_token"]

    # 2. Register Student & trigger signal
    stud_reg = client.post("/api/v1/auth/register", json={
        "name": "Confidential Student",
        "email": "confidential@campus.edu",
        "password": "password123",
        "role": "student",
    })
    stud_token = stud_reg.json()["access_token"]

    today = date.today()
    for i in range(2, -1, -1):
        client.post(
            "/api/v1/checkins",
            json={
                "date": (today - timedelta(days=i)).isoformat(),
                "mood": "very_low",
                "stress_level": 5,
                "sleep_quality": 1,
                "private_note": "Extremely personal family issues and therapy notes.",
            },
            headers={"Authorization": f"Bearer {stud_token}"},
        )

    # 3. Staff queries signals
    staff_res = client.get(
        "/api/v1/staff/support-signals",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert staff_res.status_code == 200
    signals = staff_res.json()
    assert len(signals) >= 1
    sig = signals[0]

    # Verify signal info is visible
    assert sig["student_name"] == "Confidential Student"
    assert "High stress" in sig["reason"]

    # PRIVACY VERIFICATION: Ensure private notes are NOT present in staff payload!
    assert "private_note" not in sig
    assert "Extremely personal" not in str(signals)


def test_duplicate_checkin_rejected(client):
    """Test 5: Duplicate check-in on the same date is rejected with 409 Conflict."""
    reg = client.post("/api/v1/auth/register", json={
        "name": "Dup Tester",
        "email": "dup@campus.edu",
        "password": "password123",
        "role": "student",
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    today = date.today().isoformat()
    c1 = client.post("/api/v1/checkins", json={"date": today, "mood": "good", "stress_level": 2, "sleep_quality": 3}, headers=headers)
    assert c1.status_code == 201

    # Second submission on same date
    c2 = client.post("/api/v1/checkins", json={"date": today, "mood": "neutral", "stress_level": 3, "sleep_quality": 2}, headers=headers)
    assert c2.status_code == 409
    assert "already been submitted" in c2.json()["detail"]


def test_date_filter_history(client):
    """Test 6: Date filters 'from' and 'to' return the correct records."""
    reg = client.post("/api/v1/auth/register", json={
        "name": "Filter Tester",
        "email": "filter@campus.edu",
        "password": "password123",
        "role": "student",
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    today = date.today()
    client.post("/api/v1/checkins", json={"date": (today - timedelta(days=10)).isoformat(), "mood": "good", "stress_level": 2, "sleep_quality": 3}, headers=headers)
    client.post("/api/v1/checkins", json={"date": (today - timedelta(days=3)).isoformat(), "mood": "neutral", "stress_level": 3, "sleep_quality": 2}, headers=headers)
    client.post("/api/v1/checkins", json={"date": today.isoformat(), "mood": "low", "stress_level": 4, "sleep_quality": 2}, headers=headers)

    # Filter last 5 days
    from_date = (today - timedelta(days=5)).isoformat()
    res = client.get(f"/api/v1/checkins?from={from_date}", headers=headers)
    assert res.status_code == 200
    filtered = res.json()
    assert len(filtered) == 2
    assert all(f["date"] >= from_date for f in filtered)
