import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import MusicPlayer from './components/MusicPlayer'

import Home from './pages/Home'
import Albums from './pages/Albums'
import AlbumDetail from './pages/AlbumDetail'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import CreatePlaylist from './pages/CreatePlaylist'
import PlayerScreen from './pages/PlayerScreen'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954',
      light: '#3FCF70',
      dark: '#159A45',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#B026FF',
      light: '#C45AFF',
      dark: '#8A00D4',
    },
    background: {
      default: '#0A0E17',
      paper: '#111927',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom right, rgba(40, 40, 45, 0.8), rgba(20, 20, 25, 1))',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom, rgba(25, 25, 30, 0.9), rgba(16, 16, 20, 1))',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
          },
        },
        contained: {
          backgroundImage: 'linear-gradient(45deg, #1DB954, #18A549)',
        },
      },
    },
  },
});

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh',
          background: 'linear-gradient(135deg, #0A0E17 0%, #121A29 100%)',
          backgroundAttachment: 'fixed'
        }}>
          <Navbar />
          <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            <Sidebar />
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1, 
                p: 3, 
                overflow: 'auto',
                backgroundImage: 'url("/subtle-pattern.png")',
                backgroundBlendMode: 'soft-light',
                backgroundSize: '200px',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'repeat',
              }}
            >
              <Routes>
                <Route path="/" element={<Home setCurrentTrack={setCurrentTrack} />} />
                <Route path="/albums" element={<Albums />} />
                <Route path="/albums/:id" element={<AlbumDetail setCurrentTrack={setCurrentTrack} />} />
                <Route path="/search" element={<Search setCurrentTrack={setCurrentTrack} />} />
                <Route path="/favorites" element={<Favorites setCurrentTrack={setCurrentTrack} />} />
                <Route path="/create-playlist" element={<CreatePlaylist setCurrentTrack={setCurrentTrack} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/player" element={<PlayerScreen />} />
              </Routes>
            </Box>
          </Box>
          {currentTrack && <MusicPlayer track={currentTrack} />}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App
