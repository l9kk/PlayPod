from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.album import Album as AlbumModel
from app.schemas.album import Album, AlbumCreate, AlbumWithTracks

router = APIRouter()

@router.get("/albums", response_model=List[Album])
def get_albums(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    albums = db.query(AlbumModel).offset(skip).limit(limit).all()
    return albums

@router.get("/albums/{album_id}", response_model=AlbumWithTracks)
def get_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(AlbumModel).filter(AlbumModel.id == album_id).first()
    if album is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Album not found")
    return album

@router.post("/albums", response_model=Album, status_code=status.HTTP_201_CREATED)
def create_album(album: AlbumCreate, db: Session = Depends(get_db)):
    db_album = AlbumModel(**album.dict())
    db.add(db_album)
    db.commit()
    db.refresh(db_album)
    return db_album

@router.delete("/albums/{album_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(AlbumModel).filter(AlbumModel.id == album_id).first()
    if album is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Album not found")
    db.delete(album)
    db.commit()
    return None