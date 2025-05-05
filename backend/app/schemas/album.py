from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class AlbumBase(BaseModel):
    title: str
    artist: str
    cover_image: Optional[str] = None
    release_date: Optional[datetime] = None


class AlbumCreate(AlbumBase):
    pass


class Album(AlbumBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True


class AlbumWithTracks(Album):
    tracks: List["Track"] = []


from app.schemas.track import Track

AlbumWithTracks.model_rebuild()
