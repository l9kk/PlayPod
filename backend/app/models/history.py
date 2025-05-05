from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    track_id = Column(String, index=True)
    title = Column(String)
    artist = Column(String)
    audio_url = Column(String)
    cover_image = Column(String)
    duration = Column(Integer)
    played_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="history")
