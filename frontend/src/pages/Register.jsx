import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Container,
  Avatar,
  Grid,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import authService from '../services/authService';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (!formData.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      navigate('/login', { 
        state: { message: 'Registration successful! Please login with your new account.' }
      });
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.status === 400 && err.response?.data?.detail?.includes('Email already registered')) {
        setError('This email is already registered. Please use a different email address.');
      } else {
        setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          mb: 4,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95) 0%, rgba(15, 15, 25, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Avatar sx={{ 
            m: 1, 
            bgcolor: 'secondary.main',
            width: 56,
            height: 56,
            boxShadow: '0 4px 12px rgba(176, 38, 255, 0.4)'
          }}>
            <PersonAddIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Join PlayPod to create playlists, save favorites, and more!
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              margin="normal"
              InputProps={{
                sx: {
                  borderRadius: 1.5,
                  fontSize: '1rem',
                  '& .MuiOutlinedInput-input': {
                    padding: '16px 14px',
                  }
                }
              }}
            />
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              margin="normal"
              InputProps={{
                sx: {
                  borderRadius: 1.5,
                  fontSize: '1rem',
                  '& .MuiOutlinedInput-input': {
                    padding: '16px 14px',
                  }
                }
              }}
            />
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  margin="normal"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      fontSize: '1rem',
                      '& .MuiOutlinedInput-input': {
                        padding: '16px 14px',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  margin="normal"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      fontSize: '1rem',
                      '& .MuiOutlinedInput-input': {
                        padding: '16px 14px',
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
              disabled={loading}
              size="large"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
            </Divider>
            
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body1" sx={{ fontWeight: 500 }}>
                Sign in here
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;