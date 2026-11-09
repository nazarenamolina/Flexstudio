import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type CuponAplicado } from '../api/cupones';

/** Lo que se compra es un mes. El título y la imagen son los de su categoría. */
export interface ItemCarrito {
  id: string;
  idCategoria: string;
  titulo: string;
  nombreModulo: string;
  precioArs: string | number | null | undefined;
  precioUsd: string | number | null | undefined;
  imagenTarjeta?: string;
}

interface CartState {
  cartItems: ItemCarrito[];
  // Vale para el mes y el precio con los que se calculó: cualquier cambio en el carrito lo quita.
  cupon: CuponAplicado | null;
  /** Se compra de a un mes: agregar otro reemplaza al que estaba. */
  addToCart: (item: ItemCarrito) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  /** Reemplaza el carrito por su versión revalidada contra el catálogo (ver useSincronizarCarrito). */
  reemplazarCarrito: (items: ItemCarrito[]) => void;
  setCupon: (cupon: CuponAplicado | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      cupon: null,
      addToCart: (item) => set({ cartItems: [item], cupon: null }),

      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
          cupon: null,
        })),
      clearCart: () => set({ cartItems: [], cupon: null }),
      reemplazarCarrito: (items) => set({ cartItems: items, cupon: null }),
      setCupon: (cupon) => set({ cupon }),
    }),
    {
      // Clave nueva: los carritos anteriores guardaban categorías, que ya no se compran.
      name: 'flex-studio-cart-modulos',
    }
  )
);
