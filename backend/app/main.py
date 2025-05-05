from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import tracks, albums, users, search, deezer, favorites, history
from app.database.database import create_tables

app = FastAPI(
    title="PlayPod API",
    description="Nfactorial Incubator 2025",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tracks.router, prefix="/api", tags=["tracks"])
app.include_router(albums.router, prefix="/api", tags=["albums"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(search.router, prefix="/api", tags=["search"])
app.include_router(deezer.router, prefix="/api", tags=["deezer"])
app.include_router(favorites.router, prefix="/api", tags=["favorites"])
app.include_router(history.router, prefix="/api", tags=["history"])

app.include_router(favorites.router, tags=["favorites-alt"])
app.include_router(history.router, tags=["history-alt"])


@app.get("/")
def read_root():
    return {"message": "Hello Nfactorial Incubator 2025!"}
