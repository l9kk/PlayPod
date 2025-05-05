import os
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.database.database import get_db
from app.models.user import User

async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Auth header received: {authorization}")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme, use Bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = parts[1]
    print(f"Looking up user with token: {token}")
    
    user = db.query(User).filter(User.username == token).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {token}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"User found: {user.username}, ID: {user.id}")
    return user
