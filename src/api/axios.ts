import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({

  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada o inválida. Haciendo auto-logout...');
      useAuthStore.getState().logout();

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);