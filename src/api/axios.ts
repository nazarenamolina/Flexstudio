import axios from 'axios';
export const api = axios.create({

  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("La sesión expiró o no hay cookie válida.");
    }
    return Promise.reject(error);
  }
);