import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../config';

export const api = axios.create({

  baseURL: API_URL,
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Un 401 significa que la cookie de sesión venció o no llegó (por ejemplo, bloqueada en incógnito o
// Safari). Se cierra la sesión local y nada más: las rutas privadas (ProtectedRoute) redirigen
// solas al login recordando a dónde volver, y las públicas siguen funcionando. Antes se forzaba una
// recarga a /login desde cualquier página, incluso navegando la home con algo en el carrito.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !esLogin) {
      const { isAuthenticated, logout } = useAuthStore.getState();
      if (isAuthenticated) {
        logout({ conservarCarrito: true });
        toast('Tu sesión expiró. Volvé a iniciar sesión para continuar.', { id: 'sesion-expirada', icon: '🔒' });
      }
    }
    return Promise.reject(error);
  }
);
