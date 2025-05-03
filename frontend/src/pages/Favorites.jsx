import { useState, useEffect } from 'react'
import { Box, Typography, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

function Favorites({ setCurrentTrack }) {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites')) || []
    setFavorites(favs)
  }, [])

  const removeFavorite = (id) => {
    const updated = favorites.filter(item => item.id !== id)
    setFavorites(updated)
    localStorage.setItem('favorites', JSON.stringify(updated))
  }

  if (!favorites.length) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography>No favorites yet.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Typography variant="h4" gutterBottom>Favorites</Typography>
      <Grid container spacing={2}>
        {favorites.map(track => (
          <Grid item xs={12} sm={6} md={4} key={track.id}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia component="img" height="140" image={track.cover_image} alt={track.title} />
              <CardContent>
                <Typography variant="h6">{track.title}</Typography>
                <Typography variant="subtitle2" color="text.secondary">{track.artist}</Typography>
              </CardContent>
              <IconButton 
                sx={{ position: 'absolute', top: 8, right: 8 }}
                onClick={() => removeFavorite(track.id)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton 
                sx={{ position: 'absolute', bottom: 8, right: 8 }}
                onClick={() => setCurrentTrack(track)}
              >
                <PlayArrowIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Favorites