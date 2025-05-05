import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  IconButton,
  Paper
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import apiService from '../services/api';

function AlbumDetail({ setCurrentTrack }) {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const resp = await apiService.getLiveAlbum(id);
        const data = resp.data.data;
        setAlbum({
          id: data.id,
          title: data.title,
          artist: data.artist.name,
          cover_image: data.cover_small,
          release_date: data.release_date,
          description: data.description || ''
        });
        const mappedTracks = data.tracks.data.map((t, idx) => ({
          id: t.id,
          title: t.title,
          artist: t.artist.name,
          genre: t.type || '',
          audio_url: t.preview,
          cover_image: t.album.cover_small,
          duration: t.duration,
          album_id: data.id
        }));
        setTracks(mappedTracks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching album details:', err);
        setError('Failed to load album details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) fetchAlbumDetails();
  }, [id]);

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !album) {
    return (
      <Box sx={{ mt: 5 }}>
        <Typography color="error" variant="h6" align="center">
          {error || "Album not found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 4 }}>
        <CardMedia
          component="img"
          sx={{ width: { xs: '100%', md: 300 }, height: { xs: 300, md: 'auto' } }}
          image={album.cover_image}
          alt={album.title}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
          <Typography variant="h4" component="div" gutterBottom>
            {album.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {album.artist}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {album.description}
          </Typography>
          <Box sx={{ mt: 'auto' }}>
            <Typography variant="body2" color="text.secondary">
              Release Date: {new Date(album.release_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tracks.length} tracks • {formatTime(tracks.reduce((total, track) => total + track.duration, 0))}
            </Typography>
          </Box>
        </Box>
      </Card>
      
      <Typography variant="h5" gutterBottom>
        Tracks
      </Typography>
      
      <Paper elevation={2}>
        <List>
          <ListItem sx={{ py: 1, bgcolor: 'background.paper' }}>
            <ListItemIcon sx={{ minWidth: '40px' }}>#</ListItemIcon>
            <ListItemText primary="TITLE" sx={{ flex: 2 }} />
            <ListItemText primary="DURATION" sx={{ flex: 1, textAlign: 'right' }} />
            <Box sx={{ width: '48px' }}></Box>
          </ListItem>
          <Divider />
          
          {tracks.map((track, index) => (
            <Box key={track.id}>
              <ListItem sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  {index + 1}
                </ListItemIcon>
                <ListItemText 
                  primary={track.title} 
                  secondary={track.artist}
                  sx={{ flex: 2 }}
                />
                <ListItemText 
                  primary={formatTime(track.duration)} 
                  sx={{ flex: 1, textAlign: 'right' }}
                />
                <IconButton 
                  edge="end" 
                  aria-label="play" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayTrack(track);
                  }}
                  sx={{ 
                    '&:hover': { 
                      color: 'primary.main',
                      transform: 'scale(1.1)'
                    },
                    '&:active': {
                      transform: 'scale(0.95)'
                    }
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </ListItem>
              {index < tracks.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default AlbumDetail;