import os
import secrets
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Url
from schemas import ShortenRequest, ShortenResponse, StatsResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")


def _generate_short_code(db: Session) -> str:
    for _ in range(10):
        code = secrets.token_urlsafe(6)
        if not db.query(Url).filter(Url.short_code == code).first():
            return code
    raise RuntimeError("Could not generate unique short code")


@app.post("/shorten", response_model=ShortenResponse)
def shorten_url(body: ShortenRequest, db: Session = Depends(get_db)):
    short_code = _generate_short_code(db)
    url_row = Url(original_url=str(body.url), short_code=short_code)
    db.add(url_row)
    db.commit()
    return ShortenResponse(
        short_code=short_code,
        short_url=f"{BASE_URL}/{short_code}",
    )


@app.get("/stats/{short_code}", response_model=StatsResponse)
def get_stats(short_code: str, db: Session = Depends(get_db)):
    url_row = db.query(Url).filter(Url.short_code == short_code).first()
    if not url_row:
        raise HTTPException(status_code=404, detail="Short code not found")
    return StatsResponse(
        original_url=url_row.original_url,
        short_code=url_row.short_code,
        clicks=url_row.clicks,
        created_at=url_row.created_at,
    )


@app.get("/{short_code}")
def redirect_url(short_code: str, db: Session = Depends(get_db)):
    url_row = db.query(Url).filter(Url.short_code == short_code).first()
    if not url_row:
        raise HTTPException(status_code=404, detail="Short code not found")
    url_row.clicks += 1
    db.commit()
    return RedirectResponse(url=url_row.original_url, status_code=302)
