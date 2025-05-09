from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    profile_image = Column(String, nullable=True)

    favorites = relationship(
        "Favorite", back_populates="user", cascade="all, delete-orphan"
    )
    history = relationship("History", back_populates="user")
