import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Usuario } from '../api/auth';
import { useCartStore } from './cartStore';

interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  setUsuario: (usuario: Usuario) => void;
  /** `conservarCarrito`: cuando la sesión vence sola (no la cerró el usuario), el carrito es suyo y se mantiene. */
  logout: (opciones?: { conservarCarrito?: boolean }) => void;
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

      logout: (opciones) => {
        if (!opciones?.conservarCarrito) useCartStore.getState().clearCart();
        set({ 
          usuario: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'flex-studio-auth', 
    }
  )
);