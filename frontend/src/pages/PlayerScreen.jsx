import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Slider,
  Paper,
  Stack,
  Button,
  Avatar,
  Grid
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RepeatIcon from '@mui/icons-material/Repeat';
import ShuffleIcon from '@mui/icons-material/Shuffle';

function PlayerScreen() {
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTrack = localStorage.getItem('currentTrack');
    if (savedTrack) {
      setTrack(JSON.parse(savedTrack));
    }
  }, []);

  useEffect(() => {
    if (!track) return;

    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = track.audio_url;
    audioRef.current.volume = volume / 100;
    audioRef.current.load();

    const setupAudio = () => setDuration(audioRef.current.duration);
    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    const handleEnded = () => setIsPlaying(false);

    audioRef.current.addEventListener('loadedmetadata', setupAudio);
    audioRef.current.addEventListener('timeupdate', updateTime);
    audioRef.current.addEventListener('ended', handleEnded);

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.some(fav => fav.id === track.id));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', setupAudio);
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [track, isDragging]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Playback failed:", error);
          });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleTimeChange = (e, newValue) => {
    setCurrentTime(newValue);
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
  };

  const toggleFavorite = () => {
    if (!track) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (isFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== track.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favorites, track];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
    
    setIsFavorite(!isFavorite);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const goBack = () => {
    navigate(-1);
  };

  if (!track) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5">No track is currently playing</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          sx={{ mt: 3 }}
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5'
    }}>
      <Box sx={{ p: 2 }}>
        <IconButton onClick={goBack} edge="start">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 4 }}>
        <Grid container spacing={4}>
          {/* Album Art */}
          <Grid item xs={12} md={7} sx={{ textAlign: 'center' }}>
            <Paper
              elevation={6}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                maxWidth: '100%',
                width: '100%',
                aspectRatio: '1/1',
                mb: 4,
                backgroundImage: `url(${track.cover_image || '/default-album.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Grid>
          
          {/* Track Info and Controls */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom>
                {track.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {track.artist}
              </Typography>
              {track.genre && (
                <Typography variant="subtitle2" color="text.secondary">
                  Genre: {track.genre}
                </Typography>
              )}
            </Box>
            
            {/* Heart Button */}
            <IconButton 
              onClick={toggleFavorite}
              sx={{ mb: 2, p: 1 }}
              color={isFavorite ? "primary" : "default"}
            >
              {isFavorite ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
            </IconButton>
            
            {/* Progress and Current Time */}
            <Box sx={{ mb: 2 }}>
              <Slider
                value={currentTime}
                min={0}
                max={duration || 1}
                onChange={handleTimeChange}
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
                aria-label="time-indicator"
                sx={{ 
                  height: 6,
                  '& .MuiSlider-thumb': {
                    width: 14,
                    height: 14,
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">{formatTime(currentTime)}</Typography>
                <Typography variant="body2">{formatTime(duration)}</Typography>
              </Box>
            </Box>
            
            {/* Player Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
              <IconButton size="small">
                <ShuffleIcon />
              </IconButton>
              <IconButton sx={{ mx: 1 }} size="large">
                <SkipPreviousIcon fontSize="large" />
              </IconButton>
              <IconButton 
                onClick={handlePlayPause} 
                sx={{ 
                  mx: 2,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  p: 2
                }}
              >
                {isPlaying ? 
                  <PauseIcon fontSize="large" sx={{ color: '#fff' }} /> : 
                  <PlayArrowIcon fontSize="large" sx={{ color: '#fff' }} />
                }
              </IconButton>
              <IconButton sx={{ mx: 1 }} size="large">
                <SkipNextIcon fontSize="large" />
              </IconButton>
              <IconButton size="small">
                <RepeatIcon />
              </IconButton>
            </Box>
            
            {/* Volume Control */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 4 }}>
              <VolumeDownIcon />
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                sx={{ flexGrow: 1 }}
              />
              <VolumeUpIcon />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PlayerScreen;