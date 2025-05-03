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
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import apiService from '../services/api';

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const resp = await apiService.getAlbums();
        setAlbums(resp.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching albums:', err);
        setError('Failed to load albums. Please try again later.');
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  // Filter albums based on search term
  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    album.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort albums based on selected option
  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'artist') {
      return a.artist.localeCompare(b.artist);
    } else if (sortBy === 'release_date') {
      return new Date(b.release_date) - new Date(a.release_date);
    }
    return 0;
  });

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
        Albums
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 4, gap: 2, flexWrap: 'wrap' }}>
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
      </Box>
      
      <Grid container spacing={3}>
        {sortedAlbums.map((album) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={album.cover_image}
                alt={album.title}
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
                  {album.artist}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Released: {new Date(album.release_date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredAlbums.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">No albums found matching your search.</Typography>
        </Box>
      )}
    </Box>
  );
}

export default Albums;