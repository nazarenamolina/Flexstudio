import { useState } from 'react';
import {api} from '../api/axios';  

export const useCheckout = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iniciarPagoMP = async (idsCategorias: string[]) => {
    setCargando(true);
    setError(null);

    try {
      const { data } = await api.post('/compras/iniciar', { idsCategorias });
      if (data && data.url) {  
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió el enlace de pago de la pasarela');
      }
    } catch (err: any) {
      console.error('Error al iniciar checkout:', err);
      setError(
        err.response?.data?.message || 'Ocurrió un error al procesar el pago. Intenta nuevamente.'
      );
    } finally {
      setCargando(false);
    }
  };

  return { iniciarPagoMP, cargando, error };
};

 