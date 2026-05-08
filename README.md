# URL Shortener

Fullstack URL Shortener app — Next.js + FastAPI + PostgreSQL, deployed on Railway.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, Tailwind CSS v4, TypeScript |
| Backend | Python FastAPI, SQLAlchemy, psycopg3 |
| Database | PostgreSQL |
| Deploy | Railway (monorepo) |

## Features

- Shorten any URL instantly
- Redirect via short code
- Click count tracking

## Project Structure

```
url-shortener/
├── frontend/          # Next.js app
│   ├── app/
│   ├── components/
│   └── next.config.ts # Rewrites: /api/backend/* → API_URL/*
├── backend/           # FastAPI app
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── Procfile
└── railway.toml
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/shorten` | Tạo short URL |
| `GET` | `/{short_code}` | Redirect → original URL |
| `GET` | `/stats/{short_code}` | Xem click count |

## Local Development

### Backend

```bash
cd backend
cp .env.example .env   # điền DATABASE_URL
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại `http://localhost:3000`, backend tại `http://localhost:8000`.

## Deploy (Railway)

Tạo 3 services trong cùng 1 Railway project:

1. **PostgreSQL** — Railway plugin
2. **Backend** — root dir: `backend`, link `DATABASE_URL` từ PostgreSQL
3. **Frontend** — root dir: `frontend`, thêm env var:
   - `API_URL` = URL của backend service

Railway tự detect Python (Procfile) và Node.js (.node-version).
