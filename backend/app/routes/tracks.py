from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.track import Track as TrackModel
from app.schemas.track import Track, TrackCreate

router = APIRouter()

@router.get("/tracks", response_model=List[Track])
def get_tracks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tracks = db.query(TrackModel).offset(skip).limit(limit).all()
    return tracks

@router.get("/tracks/{track_id}", response_model=Track)
def get_track(track_id: int, db: Session = Depends(get_db)):
    track = db.query(TrackModel).filter(TrackModel.id == track_id).first()
    if track is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Track not found")
    return track

@router.post("/tracks", response_model=Track, status_code=status.HTTP_201_CREATED)
def create_track(track: TrackCreate, db: Session = Depends(get_db)):
    db_track = TrackModel(**track.dict())
    db.add(db_track)
    db.commit()
    db.refresh(db_track)
    return db_track

@router.delete("/tracks/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_track(track_id: int, db: Session = Depends(get_db)):
    track = db.query(TrackModel).filter(TrackModel.id == track_id).first()
    if track is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Track not found")
    db.delete(track)
    db.commit()
    return None