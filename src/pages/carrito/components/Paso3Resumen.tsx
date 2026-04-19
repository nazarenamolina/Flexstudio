import { Loader2 } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { useCheckout } from '../../../hooks/useCheckout';
import { type CheckoutPerfilData } from '../../../api/usuario';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import toast from 'react-hot-toast';

interface Props {
  formData: CheckoutPerfilData;
  usuario: any;
  metodoPago: string;
  setMetodoPago: (metodo: string) => void;
  onPrev: () => void;
}

const Paso3Resumen = ({ formData, usuario, onPrev }: Props) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const { procesarCheckout, cargando, error } = useCheckout();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const esArgentina = usuario?.pais?.toLowerCase() === 'argentina' || usuario?.pais?.toLowerCase() === 'ar';
  const total = cartItems.reduce((acc, item) => {
    const precio = esArgentina ? item.precioArs : item.precioUsd;
    return acc + Number(precio || 0);
  }, 0);

  const moneda = esArgentina ? '$' : 'U$D';
  const totalFormateado = esArgentina ? total.toLocaleString('es-AR') : total.toFixed(2);

  const handleConfirmar = async () => {
    if (!executeRecaptcha) {
      toast.error('Verificando conexión segura, por favor espera...');
      return;
    }

    const captchaToken = await executeRecaptcha('compra');
    const idsCategorias = cartItems.map((item) => item.id);
    const payloadCompra = {
      idsCategorias,
      plataforma: esArgentina ? 'MERCADOPAGO' : 'PAYPAL',
      captchaToken
    };

    await procesarCheckout(payloadCompra, formData);
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center bg-white bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312699/fondo_hwrosv.png')] border border-neutral-100 p-6 md:p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col transition-shadow hover:shadow-[0_8px_30px_rgba(215,242,80,0.15)]">
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
        <p className="font-principal font-bold text-[#131313] mb-2">Tus clases seleccionadas:</p>
        {cartItems.map(item => (
          <p key={item.id} className="text-sm text-neutral-800">1 x {item.titulo}</p>
        ))}
      </div>

      {/* Total Gigante Dinámico */}
      <div className="w-full rounded-xl border-[1px] border-neutral-400 p-3 text-center mb-6 bg-[#131313]/90">
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
                src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1776553638/idQ3WnPeIo_1776553596063_frvubq.png"
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

            <div className="w-[22px] h-[22px] rounded-full border-[2.5px] border-[#009EE3]  flex items-center justify-center shrink-0">
              <div className="w-[10px] h-[10px] bg-[#009EE3] rounded-full"></div>
            </div>
          </div>
        ) : (
          // Vista para el resto del mundo
          <div className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1776554878/Paypal_2014_logo_xjlksb.png"
                alt="PayPal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[16px] text-[#131313] tracking-wide">PayPal</h4>
              <p className="text-[14px] text-[#131313]/60 mt-0.">Pagos internacionales (USD)</p>
            </div>
            <div className="w-[22px] h-[22px] rounded-full border-[2.5px] border-[#009EE3]  flex items-center justify-center shrink-0">
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

      {/* Botones Finales */}
      <div className="flex justify-center items-center gap-4 w-full">
        <button
          onClick={onPrev}
          disabled={cargando}
          className="flex items-center justify-center gap-3 rounded-full bg-[#131313]/60 px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#fff]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer"
        >
          Anterior
        </button>
        <button
          onClick={handleConfirmar}
          disabled={cargando}
          className="flex items-center justify-center gap-3 rounded-full bg-neon-pink px-3 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer"
        >
          {cargando ? <><Loader2 className="animate-spin w-4 h-4" /> Procesando</> : 'Confirmar y Pagar'}
        </button>
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