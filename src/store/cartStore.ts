import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CategoriaReal {
  id: string;
  titulo: string;
  precioArs: string | number; 
  imagenTarjeta?: string;
}

interface CartState {
  cartItems: CategoriaReal[];
  addToCart: (item: CategoriaReal) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) => 
        set((state) => {
          const existe = state.cartItems.some((i) => i.id === item.id);
          if (existe) return state;
          return { cartItems: [...state.cartItems, item] };
        }),

      removeFromCart: (id) => 
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id)
        })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'flex-studio-cart',  
    }
  )
);