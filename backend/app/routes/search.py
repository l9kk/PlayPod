from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.database import get_db
from app.models.track import Track
from app.models.album import Album
from app.schemas.track import Track as TrackSchema
from app.schemas.album import Album as AlbumSchema
from app.utils.responses import success_response

router = APIRouter()


@router.get("/search")
def search(
    q: str = Query(..., description="Search query"), db: Session = Depends(get_db)
):
    tracks = (
        db.query(Track)
        .filter(
            or_(
                Track.title.ilike(f"%{q}%"),
                Track.artist.ilike(f"%{q}%"),
                Track.genre.ilike(f"%{q}%"),
            )
        )
        .limit(10)
        .all()
    )

    albums = (
        db.query(Album)
        .filter(or_(Album.title.ilike(f"%{q}%"), Album.artist.ilike(f"%{q}%")))
        .limit(10)
        .all()
    )

    result = {
        "tracks": [TrackSchema.from_orm(track) for track in tracks],
        "albums": [AlbumSchema.from_orm(album) for album in albums],
    }

    return success_response(data=result, message="Search results")
