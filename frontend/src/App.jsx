import { useState } from 'react'
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
    },
  },
});

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Navbar />
          <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
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
