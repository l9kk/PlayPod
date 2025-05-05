import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton, 
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import TimeAgo from '../components/TimeAgo';
import apiService from '../services/api';
import authService from '../services/authService';

function History({ setCurrentTrack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        if (authService.isLoggedIn()) {
          const response = await apiService.getHistory();
          setHistory(response.data || []);
        } else {
          const localHistory = JSON.parse(localStorage.getItem('listeningHistory') || '[]');
          setHistory(localHistory);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setError('Failed to load history. Please try again later.');
        
        const localHistory = JSON.parse(localStorage.getItem('listeningHistory') || '[]');
        setHistory(localHistory);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const playTrack = (track) => {
    setCurrentTrack({
      id: track.id || track.track_id,
      title: track.title,
      artist: track.artist,
      audio_url: track.audio_url,
      cover_image: track.cover_image,
      duration: track.duration
    });
    
    apiService.addToHistory({
      id: track.id || track.track_id,
      title: track.title,
      artist: track.artist,
      audio_url: track.audio_url,
      cover_image: track.cover_image,
      duration: track.duration
    });
  };

  const clearHistory = async () => {
    try {
      await apiService.clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
      setError('Failed to clear history. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!history.length) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>No listening history yet</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start playing tracks to see your listening history
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Explore Music
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Listening History
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={clearHistory}
        >
          Clear History
        </Button>
      </Box>
      
      <Card>
        <CardContent sx={{ p: 0 }}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {history.map((item, index) => (
              <Box key={`${item.track_id}-${item.timestamp || item.played_at}`}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => playTrack(item)}>
                      <PlayArrowIcon />
                    </IconButton>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={item.cover_image}
                      alt={item.title}
                      sx={{ width: 50, height: 50, borderRadius: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {item.artist}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.secondary">
                          <TimeAgo date={item.played_at || new Date(item.timestamp)} />
                        </Typography>
                      </Box>
                    }
                    sx={{ ml: 1 }}
                  />
                </ListItem>
                {index < history.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

export default History;
