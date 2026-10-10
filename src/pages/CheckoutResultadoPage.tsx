import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ResultadoPago, Resaltado } from '../components/ResultadoPago';

interface Props {
  tipo: 'error' | 'pendiente';
}

/**
 * Retornos de la pasarela que no son un pago aprobado:
 *  - /checkout/pendiente: MercadoPago con pago en efectivo o transferencia, todavía sin acreditar.
 *  - /checkout/error: MercadoPago rechazado (?status=rejected), o el comprador canceló o volvió
 *    sin pagar (MercadoPago sin status, o PayPal con ?token=…).
 * Es pública: si la sesión no sobrevivió al viaje a la pasarela, igual se informa qué pasó.
 */
export const CheckoutResultadoPage = ({ tipo }: Props) => {
  const clearCart = useCartStore((state) => state.clearCart);
  const [searchParams] = useSearchParams();
  const estadoPasarela = searchParams.get('collection_status') || searchParams.get('status');

  // Un pago pendiente ya está en camino (se habilita al acreditarse): no se deja el carrito
  // lleno para que no se pague dos veces. Si fue rechazado o cancelado, se conserva.
  useEffect(() => {
    if (tipo === 'pendiente') clearCart();
  }, [tipo, clearCart]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (tipo === 'pendiente') {
    return (
      <ResultadoPago
        tono="espera"
        titulo={<>Pago <Resaltado>pendiente</Resaltado></>}
        texto="Tu pago todavía no se acreditó (por ejemplo, si elegiste efectivo o transferencia). Cuando se acredite te llega el comprobante por mail y tus clases aparecen en Mis clases."
        accion={{ to: '/mis-clases', label: 'Ir a mis clases' }}
        accionSecundaria={{ to: '/', label: 'Volver al inicio' }}
      />
    );
  }

  if (estadoPasarela === 'rejected') {
    return (
      <ResultadoPago
        tono="error"
        titulo={<>Pago <Resaltado tono="error">rechazado</Resaltado></>}
        texto="El medio de pago fue rechazado y no se realizó ningún cobro. Tus clases siguen en el carrito para que lo intentes con otra tarjeta o medio."
        accion={{ to: '/carrito', label: 'Volver al carrito' }}
      />
    );
  }

  return (
    <ResultadoPago
      tono="error"
      titulo={<>Pago <Resaltado tono="error">cancelado</Resaltado></>}
      texto="No se completó el pago y no se realizó ningún cobro. Tus clases siguen en el carrito cuando quieras retomarlo."
      accion={{ to: '/carrito', label: 'Volver al carrito' }}
      accionSecundaria={{ to: '/', label: 'Seguir mirando clases' }}
    />
  );
};
