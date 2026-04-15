import { useState } from 'react';
import { iniciarCompraRequest } from '../api/compras';
import { actualizarPerfilCheckoutRequest, type CheckoutPerfilData } from '../api/usuario'; 

export const useCheckout = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const procesarCheckout = async (idsCategorias: string[], datosPerfil: CheckoutPerfilData) => {
    setCargando(true);
    setError(null);

    try {

      await actualizarPerfilCheckoutRequest(datosPerfil);
      const data = await iniciarCompraRequest({ idsCategorias });
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió el enlace de pago de la pasarela');
      }
      
      return true; // Éxito
    } catch (err: any) {
      console.error('Error al procesar checkout:', err);
      setError(
        err.response?.data?.message || 'Ocurrió un error al procesar el pago. Intenta nuevamente.'
      );
      return false; 
    } finally {
      setCargando(false);
    }
  };

  return { procesarCheckout, cargando, error, setError };
};