from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base
import datetime

class Album(Base):
    __tablename__ = "albums"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String, index=True)
    cover_image = Column(String)
    release_date = Column(DateTime, default=datetime.datetime.now)
    
    tracks = relationship("Track", back_populates="album")