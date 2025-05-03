import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import apiService from '../services/api';

function Search({ setCurrentTrack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searchResults, setSearchResults] = useState({ tracks: [], albums: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await apiService.liveSearch(searchTerm, 10);
      const data = resp.data.data;
      setSearchResults({ tracks: data.tracks, albums: data.albums });
      setLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for songs, albums, or artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ mt: 5 }}>
          <Typography color="error" variant="h6" align="center">
            {error}
          </Typography>
        </Box>
      ) : (searchResults.tracks.length > 0 || searchResults.albums.length > 0) ? (
        <Box>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{ mb: 3 }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={`Tracks (${searchResults.tracks.length})`} />
            <Tab label={`Albums (${searchResults.albums.length})`} />
          </Tabs>
          
          {/* Tracks Tab Panel */}
          {tabValue === 0 && (
            <Paper elevation={2}>
              <List>
                {searchResults.tracks.map((track, index) => (
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
                    {index < searchResults.tracks.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>
          )}
          
          {/* Albums Tab Panel */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              {searchResults.albums.map((album) => (
                <Grid item xs={12} sm={6} md={4} key={album.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={album.cover_image}
                      alt={album.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {album.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {album.artist}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      ) : searchTerm.trim() !== '' ? (
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="h6">No results found for "{searchTerm}"</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Try different keywords or check your spelling
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

export default Search;