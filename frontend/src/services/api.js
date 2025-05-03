import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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

  getAlbums: () => {
    return api.get('/albums');
  },

  getAlbumById: (id) => {
    return api.get(`/albums/${id}`);
  },

  search: (query) => {
    return api.get(`/search?q=${encodeURIComponent(query)}`);
  },

  getLiveTracks: (limit = 10) => api.get(`/deezer/tracks?limit=${limit}`),
  getLiveTrack: (id) => api.get(`/deezer/tracks/${id}`),
  getLiveAlbum: (id) => api.get(`/deezer/albums/${id}`),
  liveSearch: (q, limit = 10) => api.get(`/deezer/search?q=${encodeURIComponent(q)}&limit=${limit}`),
};

export default apiService;