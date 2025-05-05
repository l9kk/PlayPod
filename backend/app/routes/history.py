from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database.database import get_db
from app.models.history import History as HistoryModel
from app.schemas.history import History, HistoryCreate
from app.auth.auth import get_current_user
from app.schemas.user import User

router = APIRouter()


@router.get("/history", response_model=List[History])
def get_history(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    history = (
        db.query(HistoryModel)
        .filter(HistoryModel.user_id == current_user.id)
        .order_by(HistoryModel.played_at.desc())
        .limit(50)
        .all()
    )
    return history


@router.post("/history", response_model=History, status_code=status.HTTP_201_CREATED)
def add_history(
    history_item: HistoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_history = HistoryModel(**history_item.dict(), user_id=current_user.id, played_at=datetime.utcnow())
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
def clear_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(HistoryModel).filter(HistoryModel.user_id == current_user.id).delete()
    db.commit()
    return None
