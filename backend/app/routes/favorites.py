from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.models.favorite import Favorite as FavoriteModel
from app.schemas.favorite import Favorite, FavoriteCreate
from app.auth.auth import get_current_user
from app.schemas.user import User
from app.utils.responses import success_response

router = APIRouter()

@router.get("/favorites/debug")
def debug_favorites_auth(authorization: Optional[str] = Header(None)):
    if authorization is None:
        return {"status": "error", "message": "No authorization header found"}
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return {"status": "error", "message": "Invalid auth format, expected: Bearer <token>", "received": authorization}
    
    return {
        "status": "success", 
        "message": "Authorization header found", 
        "token": parts[1]
    }

@router.get("/favorites", response_model=List[Favorite])
def get_favorites(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    favorites = (
        db.query(FavoriteModel).filter(FavoriteModel.user_id == current_user.id).all()
    )
    return favorites


@router.post("/favorites", response_model=Favorite, status_code=status.HTTP_201_CREATED)
def add_favorite(
    favorite: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_favorite = (
        db.query(FavoriteModel)
        .filter(
            FavoriteModel.user_id == current_user.id,
            FavoriteModel.track_id == favorite.track_id,
        )
        .first()
    )

    if existing_favorite:
        return existing_favorite

    db_favorite = FavoriteModel(**favorite.dict(), user_id=current_user.id)
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite


@router.delete("/favorites/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    track_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite = (
        db.query(FavoriteModel)
        .filter(
            FavoriteModel.user_id == current_user.id, FavoriteModel.track_id == track_id
        )
        .first()
    )

    if favorite is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found"
        )

    db.delete(favorite)
    db.commit()
    return None
