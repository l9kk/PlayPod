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
  Grid,
  Tooltip,
  Fade,
  keyframes
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LaunchIcon from '@mui/icons-material/Launch';
import EqualizerIcon from '@mui/icons-material/Equalizer';

const drawerWidth = 240;

const pulse = keyframes`
  0% {
    opacity: 0.4;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.4;
    transform: scale(0.9);
  }
`;

const StyledSlider = styled(Slider)(({ theme }) => ({
  height: 4,
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
    transition: '0.2s all',
    '&:hover, &.Mui-active': {
      boxShadow: '0px 0px 0px 8px rgba(29, 185, 84, 0.16)',
      width: 14,
      height: 14,
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.28,
  },
}));

const PlayerCard = styled(Card)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: `${drawerWidth}px`,
  width: `calc(100% - ${drawerWidth}px)`,
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '20px 20px 0 0',
  backdropFilter: 'blur(10px)',
  backgroundImage: 'linear-gradient(to bottom, rgba(20, 20, 25, 0.7), rgba(10, 10, 15, 0.9))',
  boxShadow: '0 -5px 20px rgba(0, 0, 0, 0.3)',
  zIndex: theme.zIndex.appBar,
  transform: 'translateY(0)',
  transition: 'transform 0.3s ease-in-out'
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '50%',
  padding: 8,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  boxShadow: '0 4px 10px rgba(29, 185, 84, 0.3)',
  padding: 12,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(29, 185, 84, 0.4)',
    backgroundColor: theme.palette.primary.dark,
  },
}));

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
      
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setIsFavorite(favorites.some(fav => fav.id === track.id));
      
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

  const openFullPlayer = () => {
    navigate('/player');
  };

  if (!track) return null;

  const progressPercentage = (currentTime / duration) * 100 || 0;

  return (
    <Fade in={true} timeout={300}>
      <PlayerCard>
        <Box sx={{ position: 'relative' }}>
          {/* Progress bar*/}
          <Box sx={{ 
            position: 'absolute', 
            top: -8,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
          }}>
            <Box sx={{ 
              height: '100%', 
              width: `${progressPercentage}%`, 
              backgroundColor: 'primary.main',
              borderRadius: 2,
              transition: 'width 0.1s linear',
              boxShadow: '0 0 8px rgba(29, 185, 84, 0.5)',
            }} />
          </Box>
        
          <Grid container spacing={2} alignItems="center">
            {/* Track Info */}
            <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                mr: 2,
                width: 55,
                height: 55,
              }}>
                <CardMedia
                  component="img"
                  sx={{ width: 55, height: 55 }}
                  image={track.cover_image || '/default-album.png'}
                  alt={track.title}
                />
                {isPlaying && (
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    py: 0.5,
                  }}>
                    <EqualizerIcon 
                      sx={{ 
                        fontSize: 16,
                        color: '#1DB954',
                        animation: `${pulse} 1.2s ease-in-out infinite`
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  component="div" 
                  sx={{ 
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: { xs: '100px', sm: '200px' }
                  }}
                >
                  {track.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 400,
                    display: 'block',
                    lineHeight: 1.2,
                  }}
                >
                  {track.artist}
                </Typography>
              </Box>
            </Grid>
            
            {/* Player Controls */}
            <Grid item xs={12} sm={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
                  <Tooltip title="Previous">
                    <ControlButton aria-label="previous" size="small">
                      <SkipPreviousIcon />
                    </ControlButton>
                  </Tooltip>
                  
                  <PlayButton 
                    aria-label="play/pause" 
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </PlayButton>
                  
                  <Tooltip title="Next">
                    <ControlButton aria-label="next" size="small">
                      <SkipNextIcon />
                    </ControlButton>
                  </Tooltip>
                </Stack>
                
                <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ opacity: 0.8, width: 35, textAlign: 'right' }}>
                    {formatTime(currentTime)}
                  </Typography>
                  <StyledSlider
                    size="small"
                    value={currentTime}
                    min={0}
                    max={duration || 100}
                    onChange={handleTimeChange}
                    aria-label="time-indicator"
                  />
                  <Typography variant="caption" sx={{ opacity: 0.8, width: 35 }}>
                    {formatTime(duration)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            
            {/* Volume Control */}
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                  <IconButton onClick={toggleFavorite} sx={{ color: isFavorite ? 'primary.main' : 'inherit' }}>
                    {isFavorite ? 
                      <FavoriteIcon sx={{ filter: 'drop-shadow(0 0 3px rgba(29, 185, 84, 0.5))' }} /> : 
                      <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
                <VolumeDownIcon fontSize="small" sx={{ opacity: 0.7 }} />
                <StyledSlider
                  size="small"
                  value={volume}
                  aria-label="Volume"
                  onChange={handleVolumeChange}
                />
                <VolumeUpIcon fontSize="small" sx={{ opacity: 0.7 }} />
                <Tooltip title="Open full player">
                  <ControlButton 
                    aria-label="expand player" 
                    onClick={openFullPlayer}
                    sx={{ ml: 1 }}
                  >
                    <LaunchIcon fontSize="small" />
                  </ControlButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </PlayerCard>
    </Fade>
  );
}

export default MusicPlayer;