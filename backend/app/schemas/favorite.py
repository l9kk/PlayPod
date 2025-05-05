from pydantic import BaseModel


class FavoriteBase(BaseModel):
    track_id: str
    title: str
    artist: str
    audio_url: str
    cover_image: str
    duration: int


class FavoriteCreate(FavoriteBase):
    pass


class Favorite(FavoriteBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
