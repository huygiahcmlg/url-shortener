from datetime import datetime
from pydantic import BaseModel, HttpUrl


class ShortenRequest(BaseModel):
    url: HttpUrl


class ShortenResponse(BaseModel):
    short_code: str
    short_url: str


class StatsResponse(BaseModel):
    original_url: str
    short_code: str
    clicks: int
    created_at: datetime
