import { Link } from 'react-router-dom';
import { Loader2, Tag } from 'lucide-react';
import { validarCuponRequest } from '../../../api/cupones';
import { mensajeDeError } from '../../../api/errores';
import { RUTA_ARREPENTIMIENTO } from '../../../legal';
import { MESES_ACCESO } from '../../../modulos';
import { useCartStore } from '../../../store/cartStore';
import { useCheckout } from '../../../hooks/useCheckout';
import { type CheckoutPerfilData } from '../../../api/usuario';
import { type Usuario } from '../../../api/auth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import toast from 'react-hot-toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useMoneda } from '../../../hooks/useMoneda';
import { useSincronizarCarrito } from '../../../hooks/useSincronizarCarrito';
import { tituloVisible } from '../../../titulos';
import { PagoEnProceso } from '../../../components/PagoEnProceso';
import { useAlAcreditarPago } from '../../../hooks/useAlAcreditarPago';

interface Props {
  formData: CheckoutPerfilData;
  usuario: Usuario | null;
  onPrev: () => void;
}

const Paso3Resumen = ({ formData, usuario, onPrev }: Props) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const { procesarCheckout, cargando, error } = useCheckout();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { esArgentina, pasarela, cargandoMoneda } = useMoneda();
  const [redirigiendo, setRedirigiendo] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const cupon = useCartStore((state) => state.cupon);
  const setCupon = useCartStore((state) => state.setCupon);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [errorCupon, setErrorCupon] = useState<string | null>(null);
  const [validandoCupon, setValidandoCupon] = useState(false);
  const { sincronizando, pagoEnProceso } = useSincronizarCarrito();
  const alAcreditar = useAlAcreditarPago();
  // "Empezar un pago nuevo": se deja el link pendiente (el back lo anula) y se paga con otro.
  const [linkNuevo, setLinkNuevo] = useState(false);
  const mostrarPagoEnProceso = !!pagoEnProceso && !linkNuevo;
  const ocupado = cargando || redirigiendo || cargandoMoneda || sincronizando;

  const total = cartItems.reduce((acc, item) => {
    const precio = esArgentina ? item.precioArs : item.precioUsd;
    return acc + Number(precio || 0);
  }, 0);

  // El cupón se calculó para una moneda: si cambiara, no se aplica.
  const cuponVigente = cupon && cupon.moneda === (esArgentina ? 'ARS' : 'USD') ? cupon : null;
  const totalAPagar = cuponVigente?.montoFinal ?? total;
  const moneda = esArgentina ? '$' : 'U$D';
  const formatear = (valor: number) => (esArgentina ? valor.toLocaleString('es-AR') : valor.toFixed(2));
  const totalFormateado = formatear(totalAPagar);

  // El cupón aplicado queda guardado en el navegador junto con el carrito: puede haber vencido, haberse
  // agotado o cambiado desde que se aplicó. Se revisa al llegar a este paso y si el pago falla; si ya
  // no vale, se quita y se dice por qué. Un error de conexión no lo quita.
  const idModulo = cartItems[0]?.id;
  const revalidarCupon = useCallback(async (codigo: string) => {
    if (!idModulo) return;
    try {
      setCupon(await validarCuponRequest({ codigo, idModulo, plataforma: pasarela }));
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 400) {
        setCupon(null);
        setErrorCupon(`Quitamos el cupón ${codigo}: ${mensajeDeError(e, 'ya no se puede usar.')}`);
      }
    }
  }, [idModulo, pasarela, setCupon]);

  const codigoGuardado = cuponVigente?.codigo;
  const revisado = useRef<string | null>(null);
  useEffect(() => {
    if (!codigoGuardado || !idModulo || cargandoMoneda) return;
    const clave = `${codigoGuardado}-${idModulo}-${pasarela}`;
    if (revisado.current === clave) return;
    revisado.current = clave;
    revalidarCupon(codigoGuardado);
  }, [codigoGuardado, idModulo, pasarela, cargandoMoneda, revalidarCupon]);

  const aplicarCupon = async () => {
    const codigo = codigoCupon.trim();
    if (!codigo || validandoCupon || cartItems.length === 0) return;
    setErrorCupon(null);
    setValidandoCupon(true);
    try {
      setCupon(await validarCuponRequest({ codigo, idModulo: cartItems[0].id, plataforma: pasarela }));
      setCodigoCupon('');
    } catch (e) {
      setErrorCupon(mensajeDeError(e, 'No pudimos revisar el cupón. Intentá de nuevo.'));
    } finally {
      setValidandoCupon(false);
    }
  };

  const handleConfirmar = async () => {
    if (!executeRecaptcha) {
      toast.error('Verificando conexión segura, por favor espera...');
      return;
    }
    
    if (ocupado || !aceptaTerminos || cartItems.length === 0) return;

    try {
      const captchaToken = await executeRecaptcha('compra');
      const idModulo = cartItems[0].id;
      const respuesta = await procesarCheckout({ idModulo, cupon: cuponVigente?.codigo, plataforma: pasarela, aceptaTerminos: true, captchaToken, ...(linkNuevo ? { linkNuevo: true } : {}) }, formData);
      // Si el pago no arrancó y había un cupón, puede ser que el cupón ya no valga: se revisa.
      if (!respuesta && cuponVigente) await revalidarCupon(cuponVigente.codigo);
      // Al revisar, apareció acreditado un pago anterior de este mes: no se paga otra vez.
      if (respuesta && 'yaPagado' in respuesta) {
        alAcreditar(idModulo, respuesta.idCategoria);
        return;
      }
      const urlDePago = respuesta?.url;
      // Se paga en la misma pestaña (flujo estándar de MercadoPago y PayPal): al volver, las
      // páginas de resultado vacían o conservan el carrito según cómo terminó el pago. Abrir otra
      // pestaña dejaba esta con el carrito lleno (se podía pagar dos veces) y Safari en iOS la
      // bloqueaba o la dejaba en blanco.
      if (urlDePago) {
        setRedirigiendo(true);
        window.location.assign(urlDePago);
      }
    } catch {
      toast.error('No pudimos conectar con la pasarela de pago. Intentá de nuevo.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center bg-white bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto/v1774312699/fondo_hwrosv.png')] border border-neutral-100 p-6 md:p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col transition-shadow hover:shadow-[0_8px_30px_rgba(215,242,80,0.15)]">
      <h2 className="text-3xl font-principal font-bold mb-6 text-[#131313]">¡Ya casi es tuyo! Revisa tus datos</h2>

      {/* Datos del Cliente */}
      <div className="w-full text-center space-y-1 text-neutral-800 p-2 mb-6 rounded-xl border-[1px] border-neutral-400">
        <p><strong className="font-principal text-[#131313]">Titular: </strong> {usuario?.nombre} {usuario?.apellido}</p>
        <p><strong className="font-principal text-[#131313]">Contacto: </strong> {usuario?.correo} | {formData.telefono || 'Sin teléfono'}</p>
        {formData.documentoIdentidad && (
          <p><strong className="font-principal text-[#131313]">Documento: </strong> {formData.documentoIdentidad}</p>
        )}
        {formData.direccion && (
          <p><strong className="font-principal text-[#131313]">Facturación: </strong> {formData.direccion}, {formData.ciudad || ''} {formData.provincia ? `(${formData.provincia})` : ''}</p>
        )}
      </div>

      {/* Resumen de la Orden */}
      <div className="w-full border-t border-neutral-400 p-3 text-center space-y-2">
        <p className="font-principal font-bold text-[#131313] mb-2">Estás comprando:</p>
        {cartItems.map(item => (
          <p key={item.id} className="text-sm text-neutral-800">{tituloVisible(item.titulo)}, {item.nombreModulo}</p>
        ))}
        <p className="text-sm font-semibold text-neutral-800">Acceso por {MESES_ACCESO} meses desde que se acredita el pago.</p>
      </div>

      {/* Cupón */}
      <div className="w-full mb-4">
        {cuponVigente ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-400 bg-[#d7f250]/40 p-3 text-sm text-[#131313]">
            <span className="inline-flex items-center gap-2 font-semibold">
              <Tag size={16} aria-hidden="true" /> Cupón {cuponVigente.codigo}: {moneda} {formatear(cuponVigente.descuento)} de descuento
            </span>
            <button type="button" onClick={() => setCupon(null)} disabled={ocupado} className="font-bold underline underline-offset-2 cursor-pointer disabled:opacity-60">
              Quitar
            </button>
          </div>
        ) : (
          <>
            <label htmlFor="checkout-cupon" className="mb-1 block text-sm font-semibold text-[#131313]">¿Tenés un cupón?</label>
            <div className="flex gap-2">
              <input
                id="checkout-cupon"
                type="text"
                maxLength={30}
                autoComplete="off"
                value={codigoCupon}
                onChange={(e) => { setCodigoCupon(e.target.value); setErrorCupon(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); aplicarCupon(); } }}
                aria-invalid={!!errorCupon}
                aria-describedby={errorCupon ? 'checkout-cupon-error' : undefined}
                placeholder="Código"
                className="min-w-0 flex-1 rounded-xl border border-neutral-400 bg-white px-4 py-2.5 uppercase text-[#131313] placeholder:normal-case placeholder-neutral-400 focus:border-[#131313] focus:outline-none focus:ring-4 focus:ring-[#d7f250]/50"
              />
              <button
                type="button"
                onClick={aplicarCupon}
                disabled={!codigoCupon.trim() || validandoCupon || ocupado}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#131313] px-4 py-2.5 font-bold text-white transition-colors hover:bg-[#d7f250] hover:text-[#131313] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
              >
                {validandoCupon && <Loader2 className="h-4 w-4 animate-spin" />} Aplicar
              </button>
            </div>
            {errorCupon && <p id="checkout-cupon-error" role="alert" className="mt-1.5 ml-1 text-xs font-semibold text-red-600">{errorCupon}</p>}
          </>
        )}
      </div>

      {/* Total Gigante Dinámico */}
      <div className="w-full rounded-xl border-[1px] border-neutral-400 p-3 text-center mb-6 bg-[#131313]/90">
        {cuponVigente && (
          <p className="text-sm text-white/70 line-through">{moneda} {formatear(cuponVigente.montoOriginal)}</p>
        )}
        <p className="text-2xl font-principal font-bold text-[#d7f250]">
          Total a pagar: {moneda} {totalFormateado}
        </p>
      </div>

      <h3 className="font-bold font-principal text-xl pt-4 mb-4 text-[#131313] border-t w-full text-center border-neutral-400">Medio de pago: </h3>

      <div className="w-full border border-neutral-400 rounded-xl overflow-hidden mb-8">
        {esArgentina ? (
          <div className="p-4 flex items-center gap-[14px] rounded-[14px] w-full cursor-pointer">
            <div className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto,c_limit,w_300/v1776553638/idQ3WnPeIo_1776553596063_frvubq.png"
                alt="Mercado Pago"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <h4 className="font-semibold text-[16px] text-[#131313] tracking-wide">
                Mercado Pago
              </h4>
              <p className="text-[14px] text-[#131313]/60 mt-0.5">
                Tarjeta de crédito, débito o dinero en cuenta.
              </p>
            </div>

            <div className="w-[22px] h-[22px] rounded-full border-[2.5px] border-[#009EE3] flex items-center justify-center shrink-0">
              <div className="w-[10px] h-[10px] bg-[#009EE3] rounded-full"></div>
            </div>
          </div>
        ) : (
          // Vista para el resto del mundo
          <div className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto,c_limit,w_300/v1776554878/Paypal_2014_logo_xjlksb.png"
                alt="PayPal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[16px] text-[#131313] tracking-wide">PayPal</h4>
              <p className="text-[14px] text-[#131313]/60 mt-0.">Pagos internacionales (USD)</p>
            </div>
            <div className="w-[22px] h-[22px] rounded-full border-[2.5px] border-[#009EE3] flex items-center justify-center shrink-0">
              <div className="w-[10px] h-[10px] bg-[#009EE3] rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* Manejo de Errores del Backend */}
      {error && (
        <div className="w-full bg-red-500/10 border border-red-500 text-red-500 text-sm p-4 rounded-lg mb-6 text-center font-medium shadow-lg">
          {error}
        </div>
      )}

      {/* Información y aceptación inmediatamente antes de confirmar (art. 1111 del Código Civil y Comercial). */}
      <div className="w-full mb-6 space-y-4">
        {/* Mismo contenido que el punto 2 bis de los Términos (plazo de acceso y volver a comprar). */}
        <p className="rounded-xl border border-neutral-400 bg-neutral-50 p-4 text-sm font-medium leading-relaxed text-neutral-800">
          <strong className="font-bold text-[#131313]">Duración del acceso:</strong> podés ver los videos de este mes durante {MESES_ACCESO} meses desde que se acredita el pago. Al terminar ese plazo dejan de estar disponibles en tu cuenta, sin reembolso por el vencimiento. Si querés volver a verlos, podés comprar el mes otra vez al precio vigente, y tu avance se conserva.
        </p>
        <p className="rounded-xl border border-neutral-400 bg-neutral-50 p-4 text-sm font-medium leading-relaxed text-neutral-800">
          <strong className="font-bold text-[#131313]">Derecho de arrepentimiento:</strong> tenés 10 días corridos para revocar esta compra, sin costo y sin dar motivos, siempre que no hayas empezado más de un video de este mes. Podés hacerlo desde el{' '}
          <Link to={RUTA_ARREPENTIMIENTO} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">Botón de arrepentimiento</Link>.
        </p>
        <label htmlFor="checkout-terminos" className="flex items-start gap-3 text-sm leading-relaxed text-neutral-800 cursor-pointer">
          <input
            id="checkout-terminos"
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#131313]"
          />
          <span>
            Leí y acepto los{' '}
            <Link to="/terminos-condiciones" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">Términos y Condiciones</Link> y la{' '}
            <Link to="/politica-de-privacidad" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">Política de Privacidad</Link>.
          </span>
        </label>
      </div>

      {mostrarPagoEnProceso && cartItems[0] && (
        <div className="w-full mb-6">
          <PagoEnProceso idModulo={cartItems[0].id} idCategoria={cartItems[0].idCategoria} pago={pagoEnProceso} variante="completo" onEmpezarDeNuevo={() => setLinkNuevo(true)} />
        </div>
      )}

      {/* Botones Finales */}
      <div className="flex justify-center items-center gap-4 w-full">
        <button
          onClick={onPrev}
          disabled={ocupado}
          className="flex items-center justify-center gap-3 rounded-full bg-[#131313]/60 px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#fff]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer disabled:pointer-events-none disabled:opacity-60"
        >
          Anterior
        </button>
        {!mostrarPagoEnProceso && <button
          onClick={handleConfirmar}
          disabled={ocupado || !aceptaTerminos}
          className="flex items-center justify-center gap-3 rounded-full bg-neon-pink px-3 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer disabled:pointer-events-none disabled:opacity-60"
        >
          {cargando || redirigiendo ? <><Loader2 className="animate-spin w-4 h-4" /> {redirigiendo ? 'Abriendo el pago' : 'Procesando'}</> : 'Confirmar y Pagar'}
        </button>}
      </div>
      <p className="text-[10px] text-gray-500 text-center leading-tight mt-6 max-w-sm">
        Este sitio está protegido por reCAPTCHA y se aplican la{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#131313] underline font-medium">Política de privacidad</a> y los{' '}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#131313] underline font-medium">Términos de servicio</a> de Google.
      </p>
    </div>
  );
};

export default Paso3Resumen;