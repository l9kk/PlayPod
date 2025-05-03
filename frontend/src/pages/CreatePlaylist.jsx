import { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

function CreatePlaylist({ setCurrentTrack }) {
  const [playlists, setPlaylists] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('playlists')) || []
    setPlaylists(data)
  }, [])

  const addPlaylist = () => {
    if (!name.trim()) return
    const updated = [...playlists, { id: Date.now(), name, tracks: [] }]
    setPlaylists(updated)
    localStorage.setItem('playlists', JSON.stringify(updated))
    setName('')
  }

  const deletePlaylist = (id) => {
    const updated = playlists.filter(p => p.id !== id)
    setPlaylists(updated)
    localStorage.setItem('playlists', JSON.stringify(updated))
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Typography variant='h4' gutterBottom>Create Playlist</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label='Playlist Name'
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
        />
        <Button variant='contained' onClick={addPlaylist}>Add</Button>
      </Box>
      <List>
        {playlists.map(pl => (
          <ListItem 
            key={pl.id} 
            secondaryAction={
              <IconButton edge='end' onClick={() => deletePlaylist(pl.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={pl.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default CreatePlaylist