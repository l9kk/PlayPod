import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AlbumIcon from '@mui/icons-material/Album';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import HeadphonesIcon from '@mui/icons-material/Headphones';

const drawerWidth = 240;

function Sidebar() {
  const theme = useTheme();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          background: 'linear-gradient(180deg, rgba(17, 25, 39, 0.95) 0%, rgba(10, 14, 23, 0.95) 100%)',
          boxShadow: '4px 0px 15px rgba(0, 0, 0, 0.2)',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <HeadphonesIcon 
          sx={{ 
            fontSize: 32,
            color: theme.palette.primary.main,
            filter: 'drop-shadow(0 2px 4px rgba(29, 185, 84, 0.5))',
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1DB954, #30E675)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
          }}
        >
          PlayPod
        </Typography>
      </Box>

      <Box 
        sx={{ 
          overflow: 'auto', 
          mx: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          '& .MuiListItemButton-root': {
            borderRadius: 2,
            mb: 0.5,
            transition: 'all 0.2s ease-in-out',
          },
        }}
      >
        <Typography variant="overline" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }}>
          Discover
        </Typography>
        <List disablePadding>
          {[
            { path: '/', icon: <HomeIcon />, text: 'Home' },
            { path: '/search', icon: <SearchIcon />, text: 'Search' },
            { path: '/albums', icon: <AlbumIcon />, text: 'Albums' }
          ].map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to={item.path}
                  sx={{
                    bgcolor: active ? 'rgba(29, 185, 84, 0.15)' : 'transparent',
                    borderLeft: active ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                    pl: active ? 1.75 : 2,
                    '&:hover': {
                      bgcolor: active ? 'rgba(29, 185, 84, 0.20)' : 'rgba(255, 255, 255, 0.05)',
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: active ? theme.palette.primary.main : 'inherit',
                    minWidth: 40,
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: active ? 600 : 400,
                      color: active ? theme.palette.primary.main : 'inherit',
                    }
                  }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2, mx: 1, opacity: 0.6 }} />
        
        <Typography variant="overline" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }}>
          Library
        </Typography>
        <List disablePadding>
          {[
            { path: '/favorites', icon: <FavoriteIcon />, text: 'Favorites' },
            { path: '/history', icon: <HistoryIcon />, text: 'History' },
          ].map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to={item.path}
                  sx={{
                    bgcolor: active ? 'rgba(29, 185, 84, 0.15)' : 'transparent',
                    borderLeft: active ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                    pl: active ? 1.75 : 2,
                    '&:hover': {
                      bgcolor: active ? 'rgba(29, 185, 84, 0.20)' : 'rgba(255, 255, 255, 0.05)',
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: active ? theme.palette.primary.main : 'inherit',
                    minWidth: 40,
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: active ? 600 : 400,
                      color: active ? theme.palette.primary.main : 'inherit',
                    }
                  }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;