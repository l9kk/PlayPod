from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class HistoryBase(BaseModel):
    track_id: str
    title: str
    artist: str
    audio_url: str
    cover_image: Optional[str] = None
    duration: int


class HistoryCreate(HistoryBase):
    pass


class History(HistoryBase):
    id: int
    user_id: int
    played_at: datetime

    class Config:
        from_attributes = True
