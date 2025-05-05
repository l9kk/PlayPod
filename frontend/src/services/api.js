import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
  retryDelay: 1000,
  maxRetries: 3,
});

api.interceptors.request.use(
  (config) => {
    if (config.retry === undefined) {
      config.retry = 0;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      
      if (config.url.includes('favorites')) {
        console.log('Auth headers for favorites request:', config.headers.Authorization);
      }
    } else if (config.url.includes('favorites')) {
      console.warn('No auth token found for favorites request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;
    
    if (!config) {
      return Promise.reject(error);
    }

    const shouldRetry = (
      !error.response || 
      (error.response.status >= 500 && error.response.status <= 599)
    ) && config.retry < config.maxRetries;

    if (shouldRetry) {
      config.retry += 1;
      
      const delay = config.retryDelay * (2 ** (config.retry - 1));
      
      console.log(`API call failed, retrying (${config.retry}/${config.maxRetries}) in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(config);
    }

    return Promise.reject(error);
  }
);

const apiService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify({ 
          username: credentials.username,
          token: response.data.access_token,
          isLoggedIn: true 
        }));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    return api.post('/users', userData);
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getTracks: () => {
    return api.get('/tracks');
  },

  getTrackById: (id) => {
    return api.get(`/tracks/${id}`);
  },

  getAlbums: (config = {}) => {
    return api.get('/albums', config);
  },

  getAlbumById: (id) => {
    return api.get(`/albums/${id}`);
  },

  search: (query) => {
    return api.get(`/search?q=${encodeURIComponent(query)}`);
  },

  getLiveTracks: (limit = 10) => {
    return api.get(`/deezer/tracks?limit=${limit}`)
      .catch(error => {
        console.log('Trying alternative tracks endpoint...');
        if (error.response?.status === 404) {
          const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
          return axios.get(`${baseUrl}/deezer/tracks?limit=${limit}`);
        }
        throw error;
      });
  },
  
  getLiveTrack: (id) => {
    return api.get(`/deezer/tracks/${id}`)
      .catch(error => {
        if (error.response?.status === 404) {
          const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
          return axios.get(`${baseUrl}/deezer/tracks/${id}`);
        }
        throw error;
      });
  },
  
  getLiveAlbum: (id) => {
    return api.get(`/deezer/albums/${id}`)
      .catch(error => {
        if (error.response?.status === 404) {
          const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
          return axios.get(`${baseUrl}/deezer/albums/${id}`);
        }
        throw error;
      });
  },
  
  liveSearch: (q, limit = 10) => {
    return api.get(`/deezer/search?q=${encodeURIComponent(q)}&limit=${limit}`)
      .catch(error => {
        if (error.response?.status === 404) {
          const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
          return axios.get(`${baseUrl}/deezer/search?q=${encodeURIComponent(q)}&limit=${limit}`);
        }
        throw error;
      });
  },
  
  getGenres: () => {
    return api.get('/deezer/genres')
      .catch(error => {
        if (error.response?.status === 404) {
          const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
          return axios.get(`${baseUrl}/deezer/genres`);
        }
        throw error;
      });
  },

  getGenreAlbums: (genre, limit = 5) => api.get(`/deezer/genre/${genre}/albums?limit=${limit}`),
  getCustomAlbums: (genre = null, limit = 5) => {
    const params = { limit };
    if (genre) params.genre = genre;
    return api.get('/deezer/custom-albums', { params });
  },

  testAuth: () => {
    return api.get('/api/favorites/debug')
      .then(response => {
        console.log('Auth test response:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Auth test error:', error.response?.data || error.message);
        throw error;
      });
  },

  getFavorites: () => {
    return api.get('/favorites')
      .catch(error => {
        console.log('Trying alternative favorites endpoint...');
        if (error.response?.status === 404) {
          return api.get('/api/favorites');
        } else if (error.code === 'ERR_NETWORK' || error.response?.status === 500) {
          const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          return { data: localFavorites };
        }
        throw error;
      });
  },
  
  addFavorite: (track) => {
    const favoriteData = {
      track_id: track.id.toString(),
      title: track.title,
      artist: track.artist,
      audio_url: track.audio_url,
      cover_image: track.cover_image,
      duration: track.duration
    };
    
    const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const existingIndex = localFavorites.findIndex(f => f.track_id === track.id.toString());
    if (existingIndex === -1) {
      localFavorites.push(favoriteData);
      localStorage.setItem('favorites', JSON.stringify(localFavorites));
    }
    
    return api.post('/favorites', favoriteData)
      .catch(error => {
        if (error.response?.status === 404) {
          return api.post('/api/favorites', favoriteData);
        } else if (error.code === 'ERR_NETWORK' || error.response?.status === 500) {
          return { data: favoriteData };
        }
        throw error;
      });
  },
  
  removeFavorite: (trackId) => {
    return api.delete(`/favorites/${trackId}`)
      .catch(error => {
        if (error.response?.status === 404) {
          return api.delete(`/api/favorites/${trackId}`);
        }
        throw error;
      });
  },
  
  checkFavorite: (trackId) => {
    return api.get('/favorites')
      .then(response => {
        const favorites = response.data;
        return favorites.some(fav => fav.track_id === trackId.toString());
      })
      .catch(error => {
        if (error.response?.status === 404) {
          return api.get('/api/favorites').then(response => {
            const favorites = response.data;
            return favorites.some(fav => fav.track_id === trackId.toString());
          });
        } else if (error.code === 'ERR_NETWORK' || error.response?.status === 500) {
          const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          return localFavorites.some(fav => fav.track_id === trackId.toString());
        }
        throw error;
      });
  },

  getHistory: () => {
    return api.get('/api/history')
      .catch(error => {
        console.log('Trying alternative history endpoint...');
        if (error.response?.status === 404) {
          return api.get('/history');
        } else if (error.code === 'ERR_NETWORK' || error.response?.status === 500 || error.response?.status === 401) {
          const localHistory = JSON.parse(localStorage.getItem('listeningHistory') || '[]');
          return { data: localHistory };
        }
        throw error;
      });
  },
  
  addToHistory: (track) => {
    const history = JSON.parse(localStorage.getItem('listeningHistory') || '[]');
    const filteredHistory = history.filter(item => item.track_id !== track.id.toString());
    
    const historyItem = {
      track_id: track.id.toString(),
      title: track.title,
      artist: track.artist,
      audio_url: track.audio_url,
      cover_image: track.cover_image,
      duration: track.duration,
      played_at: new Date().toISOString(),
      timestamp: new Date().getTime()
    };
    
    filteredHistory.unshift(historyItem);
    const trimmedHistory = filteredHistory.slice(0, 50);
    localStorage.setItem('listeningHistory', JSON.stringify(trimmedHistory));
    
    const user = localStorage.getItem('user');
    if (user) {
      return api.post('/api/history', {
        track_id: track.id.toString(),
        title: track.title,
        artist: track.artist,
        audio_url: track.audio_url,
        cover_image: track.cover_image,
        duration: track.duration
      }).catch(error => {
        if (error.response?.status === 404) {
          return api.post('/history', historyItem);
        }
        console.error('Failed to save history to server:', error);
        return { data: historyItem };
      });
    }
    
    return Promise.resolve({ data: historyItem });
  },
  
  clearHistory: () => {
    localStorage.removeItem('listeningHistory');
    
    const user = localStorage.getItem('user');
    if (user) {
      return api.delete('/api/history')
        .catch(error => {
          if (error.response?.status === 404) {
            return api.delete('/history');
          }
          console.error('Failed to clear history on server:', error);
        });
    }
    
    return Promise.resolve();
  },
};

export { api };
export default apiService;