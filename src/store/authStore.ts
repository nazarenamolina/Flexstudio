import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Usuario } from '../api/auth';
 
interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  setUsuario: (usuario: Usuario) => void;
  logout: () => void;
}

 
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      isAuthenticated: false,
      setUsuario: (usuario: Usuario) => 
        set({ 
          usuario: usuario, 
          isAuthenticated: true 
        }),

      logout: () => 
        set({ 
          usuario: null, 
          isAuthenticated: false 
        }),
    }),
    {
      name: 'flex-studio-auth', 
    }
  )
);