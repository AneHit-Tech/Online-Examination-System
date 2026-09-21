import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach the stored JWT to every outgoing request, if present
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('examAppUser');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      localStorage.removeItem('examAppUser');
    }
  }
  return config;
});

// Response interceptor to handle session expiration cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired or invalidated user session
      localStorage.removeItem('examAppUser');
    }
    return Promise.reject(error);
  }
);

export default api;