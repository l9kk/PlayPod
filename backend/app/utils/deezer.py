import os
from dotenv import load_dotenv
import requests
from requests.exceptions import RequestException

load_dotenv()
DEEZER_BASE_URL = os.environ.get("DEEZER_BASE_URL")


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
