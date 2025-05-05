import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Link,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Alert,
  Snackbar,
  AlertTitle,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ErrorIcon from '@mui/icons-material/Error';
import FilterListIcon from '@mui/icons-material/FilterList';
import apiService from '../services/api';

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genresLoading, setGenresLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [albumSource, setAlbumSource] = useState('all');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineSnackbar, setShowOfflineSnackbar] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isOnline) {
        fetchAlbums();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineSnackbar(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  useEffect(() => {
    const fetchGenres = async () => {
      setGenresLoading(true);
      try {
        const response = await apiService.getGenres();
        setGenres(response.data.data || []);
      } catch (err) {
        console.error('Error loading genres:', err);
      } finally {
        setGenresLoading(false);
      }
    };
    
    fetchGenres();
  }, []);
  
  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (albumSource === 'custom' || selectedGenre) {
        response = await apiService.getCustomAlbums(selectedGenre, 15);
      } else if (albumSource === 'deezer') {
        response = await apiService.getAlbums({
          maxRetries: 3,
          timeout: 8000
        });
      } else {
        try {
          response = await apiService.getAlbums({
            maxRetries: 2,
            timeout: 5000
          });
          
          if (!response.data || response.data.length === 0) {
            response = await apiService.getCustomAlbums(null, 15);
          }
        } catch (err) {
          response = await apiService.getCustomAlbums(null, 15);
        }
      }
      
      setAlbums(response.data.data || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching albums:', err);
      
      let errorMessage = 'Unable to connect to server. Please check your network connection and try again.';
      
      if (err.response) {
        errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check if the backend service is running.';
      }
      
      setError({
        message: errorMessage,
        technical: err.message,
        code: err.code
      });
      
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [retryAttempt, albumSource, selectedGenre]);

  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (album.artist && album.artist.name 
      ? album.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      : (album.artist || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    const getArtistName = (album) => 
      album.artist && album.artist.name ? album.artist.name : album.artist || '';
      
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'artist') {
      return getArtistName(a).localeCompare(getArtistName(b));
    } else if (sortBy === 'release_date') {
      return new Date(b.release_date || 0) - new Date(a.release_date || 0);
    }
    return 0;
  });

  const handleRetry = () => {
    setRetryAttempt(prev => prev + 1);
  };

  const handleSnackbarClose = () => {
    setShowOfflineSnackbar(false);
  };
  
  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };
  
  const handleAlbumSourceChange = (event, newSource) => {
    if (newSource !== null) {
      setAlbumSource(newSource);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading Albums...</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we fetch the latest albums for you
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
        <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Connection Error
        </Typography>
        
        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
          <AlertTitle>Error Details</AlertTitle>
          {error.message}
          {error.technical && (
            <Typography variant="caption" component="div" sx={{ mt: 1 }}>
              Technical details: {error.technical} {error.code ? `(${error.code})` : ''}
            </Typography>
          )}
        </Alert>
        
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="body1" paragraph>
            Try the following solutions:
          </Typography>
          <ul style={{ textAlign: 'left' }}>
            <li>Check your internet connection</li>
            <li>Make sure the backend server is running</li>
            <li>Verify the API URL in your environment configuration</li>
            <li>Check browser console for more details</li>
          </ul>
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
          sx={{ mt: 2 }}
          size="large"
        >
          Retry Connection
        </Button>
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
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        Albums
        {!isOnline && (
          <Typography 
            component="span" 
            variant="subtitle1" 
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center', 
              bgcolor: 'warning.dark', 
              color: 'warning.contrastText',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <WifiOffIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> OFFLINE
          </Typography>
        )}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <ToggleButtonGroup
          value={albumSource}
          exclusive
          onChange={handleAlbumSourceChange}
          aria-label="album source"
          sx={{ mb: 2 }}
          size="small"
        >
          <ToggleButton value="all">
            All Albums
          </ToggleButton>
          <ToggleButton value="custom">
            Custom Collections
          </ToggleButton>
          <ToggleButton value="deezer">
            Deezer Albums
          </ToggleButton>
        </ToggleButtonGroup>
      
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search Albums"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="artist">Artist</MenuItem>
              <MenuItem value="release_date">Release Date</MenuItem>
            </Select>
          </FormControl>
          
          {genres.length > 0 && (
            <FormControl sx={{ minWidth: '180px' }}>
              <InputLabel id="genre-label">Genre</InputLabel>
              <Select
                labelId="genre-label"
                value={selectedGenre}
                label="Genre"
                onChange={handleGenreChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Genres</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>
      
      {albums.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h6">No albums found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The database might be empty. Try checking the backend connection or switching to custom albums.
          </Typography>
          <Button 
            variant="outlined"
            onClick={handleRetry}
            sx={{ mt: 3 }}
          >
            Refresh
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedAlbums.map((album) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative'
              }}>
                {album.custom && (
                  <Chip 
                    label="Custom" 
                    color="secondary" 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      zIndex: 1
                    }}
                  />
                )}
                <CardMedia
                  component="img"
                  height="200"
                  image={album.cover_medium || album.cover || album.cover_image}
                  alt={album.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Link 
                    component={RouterLink} 
                    to={`/albums/${album.id}`}
                    sx={{ textDecoration: 'none' }}
                  >
                    <Typography variant="h6" component="div" gutterBottom>
                      {album.title}
                    </Typography>
                  </Link>
                  <Typography variant="subtitle1" color="text.secondary">
                    {album.artist && album.artist.name 
                      ? album.artist.name 
                      : album.artist || 'Unknown Artist'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Tracks: {album.nb_tracks || album.tracks?.data?.length || 0}
                  </Typography>
                  {album.release_date && (
                    <Typography variant="body2" color="text.secondary">
                      Released: {new Date(album.release_date).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {filteredAlbums.length === 0 && searchTerm && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">No albums found matching your search.</Typography>
        </Box>
      )}

      <Snackbar
        open={showOfflineSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="You are currently offline. Some features may be limited."
        action={
          <Button color="primary" size="small" onClick={handleSnackbarClose}>
            Dismiss
          </Button>
        }
      />
    </Box>
  );
}

export default Albums;