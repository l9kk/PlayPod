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
  CircularProgress,
  Paper,
  Skeleton,
  useTheme,
  Button,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import AlbumIcon from '@mui/icons-material/Album';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import apiService from '../services/api';

const SectionTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
}));

const SectionIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '12px',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(29, 185, 84, 0.2)',
}));

const TrackCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  },
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.1)',
  },
  boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)',
}));

const AlbumCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
  },
  '& .MuiCardMedia-root': {
    transition: 'transform 0.5s ease',
  },
}));

function Home({ setCurrentTrack }) {
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

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
      <Box sx={{ pb: 10 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Welcome to PlayPod
        </Typography>
        
        <SectionTitle>
          <SectionIcon>
            <FeaturedPlayListIcon sx={{ color: 'white' }} />
          </SectionIcon>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Featured Tracks
          </Typography>
        </SectionTitle>
        
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        
        <SectionTitle sx={{ mt: 6 }}>
          <SectionIcon>
            <AlbumIcon sx={{ color: 'white' }} />
          </SectionIcon>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Recent Albums
          </Typography>
        </SectionTitle>
        
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ width: '100%' }}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 1 }} />
                <Skeleton width="70%" height={24} />
                <Skeleton width="40%" height={20} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      {/* Header */}
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
        Welcome to PlayPod
      </Typography>
      
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 5, 
          color: 'text.secondary',
          maxWidth: '600px'
        }}
      >
        Discover, stream, and enjoy your favorite music. Get started by exploring our curated selections below.
      </Typography>
      
      <Box sx={{ mb: 6 }}>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <SectionTitle>
            <SectionIcon>
              <FeaturedPlayListIcon sx={{ color: 'white' }} />
            </SectionIcon>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Featured Tracks
            </Typography>
          </SectionTitle>
          
          <Button 
            endIcon={<ChevronRightIcon />} 
            component={RouterLink} 
            to="/search"
            sx={{ textTransform: 'none' }}
          >
            View all
          </Button>
        </Stack>
        
        <Grid container spacing={3}>
          {featuredTracks.map((track) => (
            <Grid item xs={12} sm={6} md={3} key={track.id}>
              <TrackCard>
                <Box sx={{ display: 'flex', position: 'relative', height: '100%' }}>
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: 120, 
                      height: '100%',
                      filter: 'brightness(0.85)',
                      objectFit: 'cover'
                    }}
                    image={track.cover_image}
                    alt={track.title}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 120,
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    <PlayButton
                      aria-label="play/pause"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                    </PlayButton>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    flexGrow: 1,
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, rgba(35,35,45,1) 0%, rgba(25,25,35,1) 100%)',
                  }}>
                    <CardContent sx={{ flexGrow: 1, py: 2 }}>
                      <Typography 
                        component="div" 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {track.title}
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary" 
                        component="div"
                        sx={{ fontWeight: 400 }}
                      >
                        {track.artist}
                      </Typography>
                    </CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      px: 2, 
                      py: 1,
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                    }}>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </Typography>
                      <Box flexGrow={1} />
                      <IconButton 
                        size="small" 
                        onClick={() => handlePlayTrack(track)}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        <PlayArrowIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </TrackCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Divider sx={{ my: 6, opacity: 0.6 }} />
      
      <Box>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <SectionTitle>
            <SectionIcon>
              <AlbumIcon sx={{ color: 'white' }} />
            </SectionIcon>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Recent Albums
            </Typography>
          </SectionTitle>
          
          <Button 
            endIcon={<ChevronRightIcon />} 
            component={RouterLink} 
            to="/albums"
            sx={{ textTransform: 'none' }}
          >
            Browse albums
          </Button>
        </Stack>
        
        <Grid container spacing={3}>
          {recentAlbums.map((album) => (
            <Grid item xs={12} sm={6} md={3} key={album.id}>
              <AlbumCard>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={album.cover_image}
                    alt={album.title}
                  />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                  }} />
                </Box>
                <CardContent sx={{ position: 'relative', background: 'linear-gradient(135deg, rgba(35,35,45,1) 0%, rgba(25,25,35,1) 100%)' }}>
                  <Link 
                    component={RouterLink} 
                    to={`/albums/${album.id}`}
                    sx={{ textDecoration: 'none' }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      component="div"
                      sx={{ fontWeight: 500, color: 'text.primary' }}
                    >
                      {album.title}
                    </Typography>
                  </Link>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      mt: 0.5,
                      fontWeight: 400,
                    }}
                  >
                    {album.artist}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'rgba(0,0,0,0.4)',
                      px: 1, 
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 500,
                    }}
                  >
                    {new Date(album.release_date).getFullYear()}
                  </Typography>
                </CardContent>
              </AlbumCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;