import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Link,
  Divider,
  CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import apiService from '../services/api';

function Home({ setCurrentTrack }) {
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tracksResp = await apiService.getLiveTracks(4);
        const deezerTracks = tracksResp.data.data;
        const mapped = deezerTracks.map(t => ({
          id: t.id,
          title: t.title,
          artist: t.artist.name,
          genre: t.type || '',
          audio_url: t.preview,
          cover_image: t.album?.cover_small,
          duration: t.duration,
          album_id: t.album.id
        }));
        setFeaturedTracks(mapped);
        const albumsResp = await apiService.getAlbums();
        setRecentAlbums(albumsResp.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching live data:', err);
        setError('Failed to load live content. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 5 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to PlayPod
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Featured Tracks
        </Typography>
        <Grid container spacing={2}>
          {featuredTracks.map((track) => (
            <Grid item xs={12} sm={6} md={3} key={track.id}>
              <Card sx={{ display: 'flex', height: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 80 }}
                  image={track.cover_image}
                  alt={track.title}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <CardContent sx={{ flex: '1 0 auto', py: 1 }}>
                    <Typography component="div" variant="subtitle1">
                      {track.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" component="div">
                      {track.artist}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <IconButton 
                      aria-label="play/pause" 
                      onClick={() => handlePlayTrack(track)}
                    >
                      <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Recent Albums
        </Typography>
        <Grid container spacing={2}>
          {recentAlbums.map((album) => (
            <Grid item xs={12} sm={6} md={3} key={album.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="180"
                  image={album.cover_image}
                  alt={album.title}
                />
                <CardContent>
                  <Link 
                    component={RouterLink} 
                    to={`/albums/${album.id}`}
                    sx={{ textDecoration: 'none' }}
                  >
                    <Typography variant="subtitle1" component="div">
                      {album.title}
                    </Typography>
                  </Link>
                  <Typography variant="subtitle2" color="text.secondary">
                    {album.artist}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;