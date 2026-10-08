# Hackathon Backend API

A clean, production-ready, and lightweight REST API built with **FastAPI**, **SQLite**, and **Uvicorn**, packaged using **Astral `uv`**.

---

## 🚀 Features

- **Fast & Modern**: Built on FastAPI with async support and automatic OpenAPI documentation.
- **Hackathon-Ready SQLite**: Pre-configured SQLAlchemy with automatic table initialization on startup.
- **Render-Optimized CORS**: Ready out-of-the-box for frontends hosted on Render (`*.onrender.com`) and local development (`localhost:5173`, `localhost:3000`).
- **Health Check**: Dedicated `GET /health` endpoint returning `{"status":"ok"}` for uptime monitors and deployment checks.
- **Environment Driven**: 12-factor configuration with Pydantic Settings and `.env` support.
- **Package Management with `uv`**: Ultra-fast virtual environment and dependency management.

---

## 📁 Project Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py             # FastAPI app, lifespan setup, and CORS configuration
│   ├── database.py         # SQLAlchemy SQLite engine, session, and init_db()
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py       # Pydantic Settings loaded from .env
│   ├── models/
│   │   ├── __init__.py
│   │   └── item.py         # SQLAlchemy ORM database models
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── health.py       # Health check response schema
│   │   └── item.py         # Request and response schemas for REST API
│   └── routers/
│       ├── __init__.py
│       ├── health.py       # GET /health
│       └── items.py        # REST CRUD endpoints for /api/v1/items
├── tests/
│   └── test_api.py         # Automated pytest test suite
├── .env.example            # Sample environment variables
├── .gitignore              # Git ignore rules for virtual environments & SQLite
├── pyproject.toml          # Project configuration for uv
├── requirements.txt        # Pinned requirements for production/Render deployment
└── README.md               # Setup and deployment documentation
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | **Required health check** (returns `{"status":"ok"}`) |
| `GET` | `/` | API status & discovery links |
| `GET` | `/docs` | Interactive Swagger API documentation |
| `GET` | `/redoc` | Interactive ReDoc API documentation |
| `GET` | `/api/v1/items` | List items (supports `search`, `is_completed`, `skip`, `limit`) |
| `POST` | `/api/v1/items` | Create a new item |
| `GET` | `/api/v1/items/{id}` | Get item by ID |
| `PUT` | `/api/v1/items/{id}` | Update item by ID |
| `DELETE` | `/api/v1/items/{id}` | Delete item by ID |

---

## 🛠️ Local Setup with `uv`

### Prerequisites

Install `uv` (if not already installed):
```bash
# On Linux / macOS:
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows (PowerShell):
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 1. Clone & Navigate to Backend
```bash
cd backend
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

### 3. Install Dependencies
Using `uv`:
```bash
uv sync
```

### 4. Run the Development Server
```bash
# Option A: Standard local runner with auto-reload
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Option B: Run using the exact Render command format:
PORT=8000 uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Visit the interactive API docs at [http://localhost:8000/docs](http://localhost:8000/docs) and health check at [http://localhost:8000/health](http://localhost:8000/health).

### 5. Run Tests
```bash
uv run pytest -v
```

---

## 🌐 Deploying to Render

Deploying this backend to [Render](https://render.com) takes less than 2 minutes.

### Step 1: Create a New Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Connect your Git repository (e.g. `fusion-hackathon`).

### Step 2: Configure Service Settings
Fill in the following fields:

- **Name**: `fusion-hackathon-backend` (or your choice)
- **Region**: Choose the region closest to you or your frontend
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python`

### Step 3: Build & Start Commands

- **Build Command**:
  ```bash
  pip install -r requirements.txt
  ```
  *(Or if you prefer `uv` on Render: `curl -LsSf https://astral.sh/uv/install.sh | sh && uv pip install -r requirements.txt`)*

- **Start Command**:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

### Step 4: Environment Variables on Render
Under **Environment Variables**, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `ENVIRONMENT` | `production` | Set environment mode |
| `DEBUG` | `False` | Disable debug mode in production |
| `SECRET_KEY` | *(generate a random string)* | Secret key for auth/sessions |
| `DATABASE_URL` | `sqlite:///./hackathon.db` | Default SQLite storage file |
| `CORS_ORIGINS` | `https://<your-frontend>.onrender.com` | Your Render frontend URL |

> [!NOTE]
> Render automatically sets the `$PORT` environment variable (e.g., `10000`). The start command automatically uses this port.
> In addition, any frontend hosted on `*.onrender.com` is automatically allowed by the backend's CORS configuration regex, avoiding CORS blocking during quick hackathon iterations!

### Step 5: Health Check
In Render's **Advanced Settings**:
- **Health Check Path**: `/health`

Click **Create Web Service**. Once deployed, Render will verify `/health` and display **Live**!

---

## 🔒 CORS Configuration

CORS is pre-configured to allow:
1. `localhost:5173`, `localhost:3000`, `127.0.0.1:5173`, `127.0.0.1:3000` for local dev.
2. Any frontend URL matching `https://*.onrender.com`.
3. Custom origins specified in `CORS_ORIGINS` (comma-separated list, or `*` to allow all).
