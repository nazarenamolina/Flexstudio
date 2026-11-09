import { useState } from 'react';
import { mensajeDeError } from '../api/errores';
import { iniciarCompraRequest, type RespuestaInicioCompra } from '../api/compras';
import { actualizarPerfilCheckoutRequest, type CheckoutPerfilData } from '../api/usuario';

export interface PayloadCompra {
  idModulo: string;
  cupon?: string;
  plataforma: string;
  aceptaTerminos: true;
  captchaToken: string;
  /** No reutilizar el link pendiente de ese mes ("Empezar un pago nuevo"). */
  linkNuevo?: boolean;
}

export const useCheckout = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Devuelve el link de pago, o { yaPagado } si un pago anterior de ese mes ya se había acreditado.
  const procesarCheckout = async (payload: PayloadCompra, datosPerfil: CheckoutPerfilData): Promise<RespuestaInicioCompra | null> => {
    setCargando(true);
    setError(null);

    try {
      await actualizarPerfilCheckoutRequest(datosPerfil);
      const data = await iniciarCompraRequest(payload);

      if (data && ('yaPagado' in data || data.url)) {
        return data;
      } else {
        throw new Error('No se recibió el enlace de pago de la pasarela');
      }

    } catch (err) {
      console.error('Error al procesar checkout:', err);
      setError(mensajeDeError(err, 'Ocurrió un error al procesar el pago. Intentá nuevamente.'));
      return null;
    } finally {
      setCargando(false);
    }
  };

  return { procesarCheckout, cargando, error, setError };
};
