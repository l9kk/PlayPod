import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  CardMedia,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import apiService from '../services/api';

function AllTracks({ setCurrentTrack }) {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const cachedData = localStorage.getItem('allTracksData');
        const now = new Date().getTime();
        
        if (cachedData) {
          const { tracks, timestamp } = JSON.parse(cachedData);
          if (now - timestamp < 15 * 60 * 1000) {
            setTracks(tracks);
            setFilteredTracks(tracks);
            setLoading(false);
            return;
          }
        }
        
        const response = await apiService.getLiveTracks(25);
        const deezerTracks = response.data.data;
        
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
        
        localStorage.setItem('allTracksData', JSON.stringify({
          tracks: mapped,
          timestamp: now
        }));
        
        setTracks(mapped);
        setFilteredTracks(mapped);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tracks:', err);
        setError('Failed to load tracks. Please try again later.');
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTracks(tracks);
    } else {
      const filtered = tracks.filter(track => 
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTracks(filtered);
    }
  }, [searchTerm, tracks]);

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
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 1, 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #FFFFFF, #B3B3B3)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        All Tracks
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Filter tracks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Paper elevation={2}>
          <List>
            {filteredTracks.map((track, index) => (
              <Box key={track.id}>
                <ListItem sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 50, height: 50, mr: 2 }}
                    image={track.cover_image}
                    alt={track.title}
                  />
                  <ListItemText 
                    primary={track.title} 
                    secondary={`${track.artist} • ${track.genre}`}
                    sx={{ flex: 2 }}
                  />
                  <ListItemText 
                    primary={formatTime(track.duration)} 
                    sx={{ flex: 1, textAlign: 'right' }}
                  />
                  <IconButton 
                    edge="end" 
                    aria-label="play" 
                    onClick={() => handlePlayTrack(track)}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </ListItem>
                {index < filteredTracks.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
        
        {filteredTracks.length === 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6">No tracks found matching your search.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AllTracks;
