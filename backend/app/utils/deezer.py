import os
from dotenv import load_dotenv
import requests
from requests.exceptions import RequestException
from typing import List, Dict, Any
import random
from collections import defaultdict

load_dotenv()
DEEZER_BASE_URL = os.environ.get("DEEZER_BASE_URL", "https://api.deezer.com")

GENRES = {
    "pop": 132,
    "rock": 152,
    "rap": 116,
    "jazz": 129,
    "classical": 98,
    "electronic": 106,
    "r&b": 165,
    "country": 84,
    "reggae": 144,
    "metal": 464,
}


class DeezerAPIError(Exception):
    pass


def get_deezer_chart_tracks(limit: int = 10):
    try:
        resp = requests.get(
            f"{DEEZER_BASE_URL}/chart/0/tracks", params={"limit": limit}
        )
        resp.raise_for_status()
        data = resp.json().get("data", [])
        return data
    except RequestException as e:
        raise DeezerAPIError(str(e))


def get_deezer_track(track_id: int):
    try:
        resp = requests.get(f"{DEEZER_BASE_URL}/track/{track_id}")
        resp.raise_for_status()
        return resp.json()
    except RequestException as e:
        raise DeezerAPIError(str(e))


def get_deezer_album(album_id: int):
    try:
        resp = requests.get(f"{DEEZER_BASE_URL}/album/{album_id}")
        resp.raise_for_status()
        return resp.json()
    except RequestException as e:
        raise DeezerAPIError(str(e))


def search_deezer_tracks(query: str, limit: int = 10):
    try:
        resp = requests.get(
            f"{DEEZER_BASE_URL}/search", params={"q": query, "limit": limit}
        )
        resp.raise_for_status()
        return resp.json().get("data", [])
    except RequestException as e:
        raise DeezerAPIError(str(e))


def search_deezer_albums(query: str, limit: int = 10):
    try:
        resp = requests.get(
            f"{DEEZER_BASE_URL}/search/album", params={"q": query, "limit": limit}
        )
        resp.raise_for_status()
        return resp.json().get("data", [])
    except RequestException as e:
        raise DeezerAPIError(str(e))


def get_tracks_by_genre(genre_id: int, limit: int = 50) -> List[Dict[str, Any]]:
    try:
        resp = requests.get(
            f"{DEEZER_BASE_URL}/radio/{genre_id}/tracks", params={"limit": limit}
        )
        resp.raise_for_status()
        return resp.json().get("data", [])
    except RequestException as e:
        raise DeezerAPIError(f"Failed to get genre tracks: {str(e)}")


def build_custom_albums(
    tracks: List[Dict[str, Any]], tracks_per_album: int = 10
) -> List[Dict[str, Any]]:
    if not tracks:
        return []

    artists = defaultdict(list)
    for track in tracks:
        artist_name = track.get("artist", {}).get("name", "Unknown")
        artists[artist_name].append(track)

    custom_albums = []

    for artist_name, artist_tracks in artists.items():
        if len(artist_tracks) >= 3:
            template = artist_tracks[0].get("album", {})

            album = {
                "id": int(f"9{random.randint(10000, 99999)}"),
                "title": f"Best of {artist_name}",
                "artist": {"name": artist_name},
                "cover": template.get("cover")
                or artist_tracks[0].get("album", {}).get("cover"),
                "cover_small": template.get("cover_small")
                or artist_tracks[0].get("album", {}).get("cover_small"),
                "cover_medium": template.get("cover_medium")
                or artist_tracks[0].get("album", {}).get("cover_medium"),
                "tracks": {"data": artist_tracks[:tracks_per_album]},
                "release_date": "2023-01-01",
                "custom": True,
                "nb_tracks": min(len(artist_tracks), tracks_per_album),
                "genre": artist_tracks[0].get("genre_id", 0),
            }
            custom_albums.append(album)

    if len(custom_albums) < 5:
        all_tracks = [
            t
            for artist_tracks in artists.values()
            for t in artist_tracks
            if len(artist_tracks) < 3
        ]

        if all_tracks:
            genres = defaultdict(list)
            for track in all_tracks:
                genre_name = track.get("genre_id", "Unknown")
                genres[genre_name].append(track)

            for genre_name, genre_tracks in genres.items():
                if len(genre_tracks) >= 5:
                    genre_album = {
                        "id": int(f"8{random.randint(10000, 99999)}"),
                        "title": f"{genre_name.title() if isinstance(genre_name, str) else 'Misc'} Collection",
                        "artist": {"name": "Various Artists"},
                        "cover": genre_tracks[0].get("album", {}).get("cover"),
                        "cover_small": genre_tracks[0]
                        .get("album", {})
                        .get("cover_small"),
                        "cover_medium": genre_tracks[0]
                        .get("album", {})
                        .get("cover_medium"),
                        "tracks": {"data": genre_tracks[:tracks_per_album]},
                        "release_date": "2023-01-01",
                        "custom": True,
                        "nb_tracks": min(len(genre_tracks), tracks_per_album),
                        "genre": genre_name,
                    }
                    custom_albums.append(genre_album)

    return custom_albums


def get_genre_albums(genre_name: str = None, limit: int = 5) -> List[Dict[str, Any]]:
    try:
        if not genre_name:
            genre_name = random.choice(list(GENRES.keys()))

        genre_id = GENRES.get(genre_name.lower(), 0)

        albums = []

        search_resp = requests.get(
            f"{DEEZER_BASE_URL}/search/album", params={"q": genre_name, "limit": limit}
        )
        search_resp.raise_for_status()
        search_albums = search_resp.json().get("data", [])
        albums.extend(search_albums)

        if len(albums) < limit:
            tracks = get_tracks_by_genre(genre_id, 100)
            custom_albums = build_custom_albums(tracks, 10)
            albums.extend(custom_albums[: limit - len(albums)])

        return albums[:limit]
    except RequestException as e:
        raise DeezerAPIError(f"Failed to get genre albums: {str(e)}")
