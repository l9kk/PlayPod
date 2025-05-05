import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import authService from '../services/authService';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.12),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: '500px',
  transition: theme.transitions.create('all'),
  backdropFilter: 'blur(10px)',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.6),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(10, 14, 23, 0.7)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
}));

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isSearchPage = location.pathname === '/search';

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const user = authService.getCurrentUser();
        setUsername(user?.username || '');
      }
    };
    
    checkLoginStatus();
    
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${e.target.value}`);
      e.target.value = '';
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static" elevation={0}>
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%',
          px: 3
        }}>
          {!isSearchPage && (
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center',
              flexGrow: 1
            }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search for songs, albums, or artists..."
                  inputProps={{ 'aria-label': 'search' }}
                  onKeyDown={handleSearchKeyDown}
                />
              </Search>
            </Box>
          )}
          
          {isSearchPage && <Box sx={{ flexGrow: 1 }} />}
          
          {isLoggedIn ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={handleMenu}
                sx={{
                  padding: 0,
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                  }
                }}
              >
                <Avatar 
                  alt="User" 
                  sx={{ 
                    width: 35, 
                    height: 35,
                    bgcolor: 'primary.dark',
                  }}
                >
                  {username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    backgroundImage: 'linear-gradient(to bottom, rgba(25, 25, 30, 0.95), rgba(16, 16, 20, 0.95))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    minWidth: '200px',
                  }
                }}
              >
                <MenuItem 
                  onClick={handleClose} 
                  sx={{ gap: 1.5 }}
                  component={RouterLink} 
                  to="/profile"
                >
                  <PersonIcon fontSize="small" />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ gap: 1.5 }}>
                  <SettingsIcon fontSize="small" />
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ gap: 1.5 }}>
                  <LogoutIcon fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                variant="outlined"
                sx={{ 
                  borderRadius: '50px',
                  px: 2.5,
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/register"
                sx={{ 
                  borderRadius: '50px',
                  px: 2.5,
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}

export default Navbar;