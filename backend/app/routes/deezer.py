from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from app.utils.deezer import (
    get_deezer_chart_tracks,
    get_deezer_track,
    get_deezer_album,
    search_deezer_tracks,
    search_deezer_albums,
    DeezerAPIError
)
from app.utils.responses import success_response

router = APIRouter()

@router.get("/deezer/tracks")
def live_tracks(limit: int = 10):
    try:
        data = get_deezer_chart_tracks(limit)
        return success_response(data=data)
    except DeezerAPIError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

@router.get("/deezer/tracks/{track_id}")
def live_track_detail(track_id: int):
    try:
        data = get_deezer_track(track_id)
        return success_response(data=data)
    except DeezerAPIError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

@router.get("/deezer/albums/{album_id}")
def live_album_detail(album_id: int):
    try:
        data = get_deezer_album(album_id)
        return success_response(data=data)
    except DeezerAPIError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

@router.get("/deezer/search")
def live_search(q: str, limit: int = 10):
    try:
        tracks = search_deezer_tracks(q, limit)
        albums = search_deezer_albums(q, limit)
        return success_response(data={"tracks": tracks, "albums": albums})
    except DeezerAPIError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))