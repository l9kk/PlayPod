from pydantic import BaseModel
from typing import Optional

class TrackBase(BaseModel):
    title: str
    artist: str
    genre: str
    audio_url: str
    cover_image: Optional[str] = None
    duration: float
    album_id: int

class TrackCreate(TrackBase):
    pass

class Track(TrackBase):
    id: int
    
    class Config:
        orm_mode = True
        from_attributes = True