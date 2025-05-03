from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Track(Base):
    __tablename__ = "tracks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String, index=True)
    genre = Column(String)
    audio_url = Column(String)
    cover_image = Column(String, nullable=True)
    duration = Column(Float)  # Duration in seconds
    album_id = Column(Integer, ForeignKey("albums.id"))
    
    album = relationship("Album", back_populates="tracks")