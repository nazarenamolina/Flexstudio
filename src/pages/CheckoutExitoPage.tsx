import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Receipt } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { capturarPagoPaypalRequest, obtenerEstadoCompraRequest } from '../api/compras';
import { ResultadoPago, Resaltado } from '../components/ResultadoPago';
import { mensajeDeError } from '../api/errores';
import { registrarCompra } from '../analytics';

// El acceso lo habilita el webhook de la pasarela, que puede tardar unos segundos: se consulta
// el estado cada 3 s durante 1 minuto antes de pasar a "se está acreditando".
const INTERVALO_MS = 3000;
const ESPERA_MAXIMA_MS = 60_000;

type Estado = 'confirmando' | 'exito' | 'acreditando' | 'rechazado' | 'sin-pagar' | 'sin-datos' | 'error';

const ERROR_CONFIRMACION = 'No pudimos confirmar el pago. Si se te cobró, te llegará el comprobante por mail.';

export const CheckoutExitoPage = () => {
  const clearCart = useCartStore((state) => state.clearCart);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  // MercadoPago vuelve con external_reference y payment_id; PayPal con grupoId y token (ID de la orden).
  const grupoPagoId = searchParams.get('external_reference') || searchParams.get('grupoId');
  const idOrdenPaypal = searchParams.get('token');
  const idOperacion = searchParams.get('payment_id');

  // PayPal: la orden está aprobada pero falta cobrarla (la respuesta ya es el estado definitivo).
  const captura = useQuery({
    queryKey: ['paypal-captura', idOrdenPaypal],
    queryFn: () => capturarPagoPaypalRequest(idOrdenPaypal!),
    enabled: !!idOrdenPaypal,
    retry: false,
    staleTime: Infinity,
  });

  // MercadoPago: se espera a que el webhook apruebe la compra, hasta ESPERA_MAXIMA_MS.
  const [esperaAgotada, setEsperaAgotada] = useState(false);
  useEffect(() => {
    const temporizador = setTimeout(() => setEsperaAgotada(true), ESPERA_MAXIMA_MS);
    return () => clearTimeout(temporizador);
  }, []);
  const consulta = useQuery({
    queryKey: ['estado-compra', grupoPagoId],
    queryFn: () => obtenerEstadoCompraRequest(grupoPagoId!),
    enabled: !!grupoPagoId && !idOrdenPaypal,
    retry: 1,
    // Son pocas consultas: siguen aunque el cliente cambie de pestaña mientras espera.
    refetchIntervalInBackground: true,
    refetchInterval: (q) => (q.state.data?.estado === 'PENDIENTE' && !esperaAgotada ? INTERVALO_MS : false),
  });

  let estado: Estado;
  if (idOrdenPaypal) {
    if (captura.isPending) estado = 'confirmando';
    else if (captura.isError) estado = 'error';
    else if (captura.data.estado === 'APROBADO') estado = 'exito';
    else if (captura.data.estado === 'PENDIENTE') estado = 'acreditando';
    else estado = 'sin-pagar';
  } else if (grupoPagoId) {
    const estadoCompra = consulta.data?.estado;
    if (consulta.isError) estado = 'error';
    else if (!estadoCompra) estado = 'confirmando';
    else if (estadoCompra === 'APROBADO') estado = 'exito';
    else if (estadoCompra === 'RECHAZADO' || estadoCompra === 'EXPIRADO') estado = 'rechazado';
    else estado = esperaAgotada ? 'acreditando' : 'confirmando';
  } else {
    estado = 'sin-datos';
  }

  // El carrito se vacía solo si el pago se hizo o está acreditándose; si no, queda para reintentar.
  useEffect(() => {
    // Google Analytics: la compra se registra con lo que había en el carrito (antes de vaciarlo).
    // Al recargar esta página el carrito ya está vacío, así que no se cuenta dos veces.
    if (estado === 'exito') {
      const items = useCartStore.getState().cartItems;
      const moneda = idOrdenPaypal ? 'USD' : 'ARS';
      if (items.length) {
        registrarCompra({
          id: grupoPagoId || idOrdenPaypal || `compra-${Date.now()}`,
          moneda,
          items: items.map((item) => ({
            id: item.id,
            nombre: item.titulo,
            precio: Number(moneda === 'USD' ? item.precioUsd : item.precioArs) || 0,
          })),
        });
      }
    }
    if (estado === 'exito' || estado === 'acreditando') clearCart();
    // Las clases nuevas tienen que aparecer en "Mis clases" sin esperar a que venza la caché.
    if (estado === 'exito') queryClient.invalidateQueries({ queryKey: ['mis-clases'] });
  }, [estado, clearCart, queryClient, grupoPagoId, idOrdenPaypal]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const verClases = { to: '/mis-clases', label: 'Empezar entrenamiento' };
  const alCarrito = { to: '/carrito', label: 'Volver al carrito' };

  switch (estado) {
    case 'confirmando':
      return (
        <ResultadoPago
          tono="cargando"
          titulo={<>Confirmando <Resaltado>pago…</Resaltado></>}
          texto="Estamos confirmando tu pago. Esto tarda unos segundos, no cierres esta página."
        />
      );
    case 'exito':
      return (
        <ResultadoPago
          tono="exito"
          titulo={<>¡Pago <Resaltado>exitoso!</Resaltado></>}
          texto={<>Ya tenés acceso a tus clases de <span className="font-semibold text-[#131313]">Flex Studio</span>. Te enviamos el comprobante por mail.</>}
          accion={verClases}
          extra={idOperacion && (
            <div className="inline-flex items-center gap-3 rounded-xl border border-neutral-400 px-5 py-3 text-neutral-700">
              <Receipt size={16} className="text-[#131313]" />
              <span className="text-xs font-bold uppercase tracking-widest">
                N° de operación: <span className="text-[#131313] font-mono ml-1">{idOperacion}</span>
              </span>
            </div>
          )}
        />
      );
    case 'acreditando':
      return (
        <ResultadoPago
          tono="espera"
          titulo={<>Pago en <Resaltado>proceso</Resaltado></>}
          texto="Tu pago se está acreditando. Cuando se confirme te llega el comprobante por mail y tus clases aparecen en Mis clases."
          accion={{ to: '/mis-clases', label: 'Ir a mis clases' }}
        />
      );
    case 'rechazado':
      return (
        <ResultadoPago
          tono="error"
          titulo={<>Pago no <Resaltado tono="error">aprobado</Resaltado></>}
          texto="La pasarela no aprobó el pago. Tus clases siguen en el carrito para que lo intentes con otro medio."
          accion={alCarrito}
        />
      );
    case 'sin-pagar':
      return (
        <ResultadoPago
          tono="error"
          titulo={<>Pago no <Resaltado tono="error">completado</Resaltado></>}
          texto="PayPal no completó el cobro. Tus clases siguen en el carrito para que lo intentes de nuevo."
          accion={alCarrito}
        />
      );
    case 'sin-datos':
      return (
        <ResultadoPago
          tono="espera"
          titulo={<>¿Completaste <Resaltado>el pago?</Resaltado></>}
          texto="Si pagaste, tus clases aparecen en Mis clases en unos minutos y te llega el comprobante por mail."
          accion={{ to: '/mis-clases', label: 'Ir a mis clases' }}
          accionSecundaria={{ to: '/carrito', label: 'Volver al carrito' }}
        />
      );
    case 'error':
      return (
        <ResultadoPago
          tono="error"
          titulo={<>No pudimos <Resaltado tono="error">confirmarlo</Resaltado></>}
          texto={mensajeDeError(captura.error ?? consulta.error, ERROR_CONFIRMACION)}
          accion={{ to: '/mis-clases', label: 'Ir a mis clases' }}
          accionSecundaria={{ to: '/carrito', label: 'Volver al carrito' }}
        />
      );
  }
};
