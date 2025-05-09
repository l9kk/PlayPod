import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import MusicPlayer from './components/MusicPlayer'
import ErrorBoundary from './components/ErrorBoundary'

import Home from './pages/Home'
import Albums from './pages/Albums'
import AlbumDetail from './pages/AlbumDetail'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import History from './pages/History'
import CreatePlaylist from './pages/CreatePlaylist'
import PlayerScreen from './pages/PlayerScreen'
import AllTracks from './pages/AllTracks'

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
      <ErrorBoundary>
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
                  <Route path="/" element={
                    <ErrorBoundary title="Home Error" message="Failed to load home page content">
                      <Home setCurrentTrack={setCurrentTrack} />
                    </ErrorBoundary>
                  } />
                  <Route path="/tracks" element={
                    <ErrorBoundary title="Tracks Error" message="Failed to load tracks">
                      <AllTracks setCurrentTrack={setCurrentTrack} />
                    </ErrorBoundary>
                  } />
                  <Route path="/albums" element={
                    <ErrorBoundary title="Albums Error" message="Failed to load album list">
                      <Albums />
                    </ErrorBoundary>
                  } />
                  <Route path="/albums/:id" element={
                    <ErrorBoundary title="Album Details Error" message="Failed to load album details">
                      <AlbumDetail setCurrentTrack={setCurrentTrack} />
                    </ErrorBoundary>
                  } />
                  <Route path="/search" element={
                    <ErrorBoundary title="Search Error" message="Failed to perform search">
                      <Search setCurrentTrack={setCurrentTrack} />
                    </ErrorBoundary>
                  } />
                  <Route path="/favorites" element={
                    <ErrorBoundary title="Favorites Error" message="Failed to load favorites">
                      <Favorites setCurrentTrack={setCurrentTrack} />
                    </ErrorBoundary>
                  } />
                  <Route path="/history" element={
                    <ErrorBoundary title="History Error" message="Failed to load playback history">
                      <History setCurrentTrack={setCurrentTrack} />
                    </ErrorBoundary>
                  } />
                  <Route path="/create-playlist" element={
                    <ErrorBoundary title="Playlist Error" message="Failed to manage playlists">
                      <CreatePlaylist setCurrentTrack={setCurrentTrack} />
                    </ErrorBoundary>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/player" element={
                    <ErrorBoundary title="Player Error" message="Failed to load music player">
                      <PlayerScreen />
                    </ErrorBoundary>
                  } />
                </Routes>
              </Box>
            </Box>
            {currentTrack && <MusicPlayer track={currentTrack} />}
          </Box>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App
