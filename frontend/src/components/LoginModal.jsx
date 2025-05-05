import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import authService from '../services/authService';

function LoginModal({ open, onClose, actionType = "add to favorites" }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      if (result) {
        setLoading(false);
        onClose(true);
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate('/register');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'linear-gradient(to bottom, rgba(25, 25, 35, 0.95), rgba(15, 15, 20, 0.98))',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5 
        }}>
          <Box 
            sx={{ 
              borderRadius: 1,
              bgcolor: 'primary.main',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LockOutlinedIcon sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h6">Sign in required</Typography>
        </Box>
        <IconButton aria-label="close" onClick={() => onClose(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          <MusicNoteIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: 'primary.main' }} />
          You need to be signed in to {actionType}.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            variant="outlined"
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Button 
          fullWidth 
          variant="outlined"
          onClick={handleGoToRegister}
          sx={{ borderRadius: 1 }}
        >
          Create an account
        </Button>
        <Button 
          size="small" 
          sx={{ mt: 1, alignSelf: 'center', color: 'text.secondary' }}
          onClick={() => onClose(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginModal;
