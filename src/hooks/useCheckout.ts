import { useState } from 'react';
import { iniciarCompraRequest } from '../api/compras';
import { actualizarPerfilCheckoutRequest, type CheckoutPerfilData } from '../api/usuario'; 

export interface PayloadCompra {
  idsCategorias: string[];
  plataforma: string;
  captchaToken: string;
}

export const useCheckout = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const procesarCheckout = async (payload: PayloadCompra, datosPerfil: CheckoutPerfilData): Promise<string | null> => {
    setCargando(true);
    setError(null);

    try {
      await actualizarPerfilCheckoutRequest(datosPerfil);
      const data = await iniciarCompraRequest(payload);
      
      if (data && data.url) {
        return data.url; 
      } else {
        throw new Error('No se recibió el enlace de pago de la pasarela');
      }
      
    } catch (err: any) {
      console.error('Error al procesar checkout:', err);
      setError(
        err.response?.data?.message || 'Ocurrió un error al procesar el pago. Intenta nuevamente.'
      );
      return null; 
    } finally {
      setCargando(false);
    }
  };

  return { procesarCheckout, cargando, error, setError };
};