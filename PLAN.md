# Plan: URL Shortener Fullstack App

## Context
Build a minimal but complete URL Shortener từ scratch, deploy toàn bộ trên Railway.
Stack: Next.js (frontend) + FastAPI (backend) + PostgreSQL (database).

---

## Project Structure

```
D:\Demo webapp\
├── frontend/
│   ├── app/
│   │   └── page.tsx           # Single page: form + result
│   ├── components/
│   │   └── UrlForm.tsx
│   ├── .env.local
│   ├── package.json
│   └── next.config.ts
├── backend/
│   ├── main.py                # Routes + app entry
│   ├── database.py            # SQLAlchemy engine + session
│   ├── models.py              # ORM model: Url
│   ├── schemas.py             # Pydantic schemas
│   ├── requirements.txt
│   └── Procfile
└── railway.toml
```

---

## Database Schema (PostgreSQL)

```sql
CREATE TABLE urls (
    id           SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code   VARCHAR(10) UNIQUE NOT NULL,
    clicks       INTEGER DEFAULT 0,
    created_at   TIMESTAMP DEFAULT NOW()
);
```

---

## Backend — FastAPI

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/shorten` | Nhận `{url}` → trả `{short_code, short_url}` |
| `GET` | `/{short_code}` | Redirect 302 → original URL, +1 click |
| `GET` | `/stats/{short_code}` | Trả `{original_url, clicks, created_at}` |

---

## Deploy Railway (theo thứ tự)

1. **PostgreSQL** plugin → lấy `DATABASE_URL`
2. **Backend** service, root dir `/backend`, link `DATABASE_URL`
3. **Frontend** service, root dir `/frontend`, set `NEXT_PUBLIC_API_URL` = backend domain

---

## Build Steps

1. Scaffold `/backend` — tất cả file Python + Procfile
2. Test local: `uvicorn main:app --reload`
3. Scaffold `/frontend` — `create-next-app` với TypeScript + Tailwind
4. Build UI
5. Test frontend + backend local
6. Push GitHub
7. Deploy Railway 3 services
8. Verify end-to-end
