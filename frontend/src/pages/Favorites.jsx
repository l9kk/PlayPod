import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Button
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import apiService from '../services/api'
import authService from '../services/authService'

function Favorites({ setCurrentTrack }) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true)
      try {
        if (!authService.isLoggedIn()) {
          navigate('/login', { state: { message: 'Please login to view your favorites' } })
          return
        }
        
        const response = await apiService.getFavorites()
        setFavorites(response.data || [])
        setError(null)
      } catch (error) {
        console.error('Error fetching favorites:', error)
        
        if (error.code === 'ERR_NETWORK') {
          setError('Network error - Unable to connect to the server. The backend may not be running or the API endpoint is not available.')
        } else {
          setError(`Failed to load favorites. ${error.message || 'Please try again later.'}`)
        }
        
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        if (localFavorites.length > 0) {
          setFavorites(localFavorites)
          setError(prev => prev + ' Showing locally stored favorites as fallback.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [navigate])

  const removeFavorite = async (id) => {
    try {
      await apiService.removeFavorite(id)
      setFavorites(favorites.filter(item => (item.id || item.track_id) !== id))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!favorites.length) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>No favorites yet</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start adding tracks to your favorites to see them here
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Explore Music
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>Your Favorites</Typography>
      
      {error && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {favorites.map(track => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={track.id || track.track_id}>
            <Card sx={{ 
              position: 'relative', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia 
                  component="img" 
                  height="180" 
                  image={track.cover_image} 
                  alt={track.title}
                  sx={{
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    opacity: 1
                  }
                }}>
                  <IconButton
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'scale(1.1)'
                      },
                      '&:active': {
                        transform: 'scale(0.95)'
                      },
                      zIndex: 10,
                      pointerEvents: 'auto'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTrack({
                        id: track.id || track.track_id,
                        title: track.title,
                        artist: track.artist,
                        audio_url: track.audio_url,
                        cover_image: track.cover_image,
                        duration: track.duration
                      });
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap>{track.title}</Typography>
                <Typography variant="subtitle2" color="text.secondary" noWrap>{track.artist}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </Typography>
              </CardContent>
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 0, 0, 0.7)'
                  }
                }}
                onClick={() => removeFavorite(track.id || track.track_id)}
              >
                <DeleteIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Favorites