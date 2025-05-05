from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    track_id = Column(String, index=True)
    title = Column(String)
    artist = Column(String)
    audio_url = Column(String)
    cover_image = Column(String)
    duration = Column(Integer)

    user = relationship("User", back_populates="favorites")
