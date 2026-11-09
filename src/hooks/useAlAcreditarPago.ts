import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';

/**
 * Un pago que no se había acreditado apareció al revisarlo: se vacía el carrito si tenía ese mes,
 * se actualizan los estados de los meses y se lleva a la persona a sus videos.
 */
export const useAlAcreditarPago = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useCallback((idModulo: string, idCategoria: string) => {
    if (useCartStore.getState().cartItems[0]?.id === idModulo) clearCart();
    queryClient.invalidateQueries({ queryKey: ['estados-modulos'] });
    queryClient.invalidateQueries({ queryKey: ['mis-clases'] });
    toast.success('Tu pago ya estaba acreditado. ¡Ya tenés acceso!', { id: `acreditado-${idModulo}`, duration: 6000 });
    navigate(`/mis-clases/${idCategoria}`);
  }, [clearCart, navigate, queryClient]);
};
