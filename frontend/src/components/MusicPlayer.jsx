import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Slider,
  Stack,
  Grid
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LaunchIcon from '@mui/icons-material/Launch';

const drawerWidth = 240;

function MusicPlayer({ track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (track) {
      localStorage.setItem('currentTrack', JSON.stringify(track));
      
      setIsPlaying(false);
      setCurrentTime(0);
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = track.audio_url;
      audioRef.current.volume = volume / 100;
      audioRef.current.load();
      const setupAudio = () => setDuration(audioRef.current.duration);
      const updateTime = () => setCurrentTime(audioRef.current.currentTime);
      audioRef.current.addEventListener('loadedmetadata', setupAudio);
      audioRef.current.addEventListener('timeupdate', updateTime);
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('loadedmetadata', setupAudio);
          audioRef.current.removeEventListener('timeupdate', updateTime);
        }
      };
    }
  }, [track]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  const handlePlayPause = () => {
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
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };
  
  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const openFullPlayer = () => {
    navigate('/player');
  };

  if (!track) return null;

  return (
    <Card sx={{
      position: 'fixed',
      bottom: 0,
      left: `${drawerWidth}px`,
      width: `calc(100% - ${drawerWidth}px)`,
      padding: 2,
      borderTop: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: 0,
      zIndex: (theme) => theme.zIndex.appBar
    }}>
      <Grid container spacing={2} alignItems="center">
        {/* Track Info */}
        <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
          <CardMedia
            component="img"
            sx={{ width: 50, height: 50, mr: 2 }}
            image={track.cover_image || '/default-album.png'}
            alt={track.title}
          />
          <Box>
            <Typography variant="subtitle1" component="div">
              {track.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {track.artist}
            </Typography>
          </Box>
        </Grid>
        
        {/* Player Controls */}
        <Grid item xs={12} sm={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <IconButton aria-label="previous">
                <SkipPreviousIcon />
              </IconButton>
              <IconButton aria-label="play/pause" onClick={handlePlayPause}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton aria-label="next">
                <SkipNextIcon />
              </IconButton>
            </Stack>
            
            <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
              <Typography variant="caption">{formatTime(currentTime)}</Typography>
              <Slider
                size="small"
                value={currentTime}
                min={0}
                max={duration || 100}
                onChange={handleTimeChange}
                aria-label="time-indicator"
                sx={{ flexGrow: 1 }}
              />
              <Typography variant="caption">{formatTime(duration)}</Typography>
            </Stack>
          </Box>
        </Grid>
        
        {/* Volume Control */}
        <Grid item xs={12} sm={4}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <IconButton onClick={() => setIsFavorite(!isFavorite)}>
              {isFavorite ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
            </IconButton>
            <VolumeDownIcon />
            <Slider
              size="small"
              value={volume}
              aria-label="Volume"
              onChange={handleVolumeChange}
              sx={{ flexGrow: 1 }}
            />
            <VolumeUpIcon />
            <IconButton 
              aria-label="expand player" 
              onClick={openFullPlayer}
              title="Open full player"
            >
              <LaunchIcon />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default MusicPlayer;