import apiService, { api } from './api';

const TOKEN_KEY = 'user';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      if (response.data.access_token) {
        const userData = { 
          username: credentials.username,
          token: response.data.access_token,
          isLoggedIn: true 
        };
        localStorage.setItem(TOKEN_KEY, JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    return api.post('/users', userData);
  },
  
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('favorites');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem(TOKEN_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  isLoggedIn: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getToken: () => {
    const user = authService.getCurrentUser();
    return user?.token || null;
  }
};

export default authService;
