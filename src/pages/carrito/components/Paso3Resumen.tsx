import { CheckCircle2, Loader2 } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore'; 
import { useCheckout } from '../../../hooks/useCheckout'; 
import { type CheckoutPerfilData } from '../../../api/usuario';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'; 
import toast from 'react-hot-toast';

interface Props {
  formData: CheckoutPerfilData;
  usuario: any;
  metodoPago: string; // Ya no lo usaremos para cambiar estado, pero lo dejamos por si la interfaz lo requiere
  setMetodoPago: (metodo: string) => void;
  onPrev: () => void;
}

const Paso3Resumen = ({ formData, usuario, onPrev }: Props) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const { procesarCheckout, cargando, error } = useCheckout();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // 👇 1. Detectamos el país
  const esArgentina = usuario?.pais?.toLowerCase() === 'argentina' || usuario?.pais?.toLowerCase() === 'ar';

  // 👇 2. Calculamos el total dinámicamente en ARS o USD según corresponda
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
    
    // 👇 3. Forzamos la plataforma en el payload para que el backend no tenga dudas
    const payloadCompra = {
      idsCategorias,
      plataforma: esArgentina ? 'MERCADOPAGO' : 'PAYPAL', 
      captchaToken
    };
    
    await procesarCheckout(payloadCompra, formData);
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-white">¡Ya casi es tuyo! Revisa tus datos</h2>

      {/* Datos del Cliente */}
      <div className="w-full text-center space-y-1 text-sm text-neutral-300 mb-8 bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800">
        <p><strong className="text-white">Titular:</strong> {usuario?.nombre} {usuario?.apellido}</p>
        <p><strong className="text-white">Contacto:</strong> {usuario?.correo} | {formData.telefono || 'Sin teléfono'}</p>
        {formData.documentoIdentidad && (
          <p><strong className="text-[#8b5cf6]">Documento (AFIP):</strong> {formData.documentoIdentidad}</p>
        )}
        {formData.direccion && (
          <p><strong className="text-white">Facturación:</strong> {formData.direccion}, {formData.ciudad || ''} {formData.provincia ? `(${formData.provincia})` : ''}</p>
        )}
      </div>

      {/* Resumen de la Orden */}
      <div className="w-full border-t border-neutral-800 pt-6 text-center space-y-2 mb-8">
        <p className="text-sm font-bold text-white mb-4">Tus clases seleccionadas:</p>
        {cartItems.map(item => (
          <p key={item.id} className="text-sm text-neutral-300">1 x {item.titulo}</p>
        ))}
      </div>

      {/* Total Gigante Dinámico */}
      <div className="w-full border-t border-b border-neutral-800 py-4 text-center mb-8">
        <p className="text-2xl font-bold text-[#d7f250]">
          Total a pagar: {moneda} {totalFormateado}
        </p>
      </div>

      <h3 className="font-bold text-lg mb-4 text-white">Medio de pago para tu región</h3>
      
      {/* 👇 4. Renderizado Condicional de Pasarelas */}
      <div className="w-full border border-neutral-800 rounded-xl overflow-hidden mb-8">
        {esArgentina ? (
          // Vista para ARGENTINA
          <div className="p-4 flex items-center gap-4 border-b border-neutral-800 bg-[#1a1a1a]">
            <div className="w-10 h-10 bg-[#009EE3] rounded-md flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">MP</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-white">Mercado Pago</h4>
              <p className="text-xs text-neutral-400">Pagos en Pesos Argentinos (ARS)</p>
            </div>
            <CheckCircle2 className="text-[#8b5cf6]" />
          </div>
        ) : (
          // Vista para RESTO DEL MUNDO
          <div className="p-4 flex items-center gap-4 bg-[#1a1a1a]">
            <div className="w-10 h-10 bg-[#003087] rounded-md flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">PP</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-white">PayPal</h4>
              <p className="text-xs text-neutral-400">Pagos internacionales (USD)</p>
            </div>
            <CheckCircle2 className="text-[#8b5cf6]" />
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
          className="w-1/2 max-w-[200px] bg-transparent border border-neutral-700 hover:border-neutral-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          Anterior
        </button>
        <button 
          onClick={handleConfirmar} 
          disabled={cargando} 
          className="w-1/2 max-w-[200px] bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {cargando ? <><Loader2 className="animate-spin w-4 h-4" /> Procesando</> : 'Confirmar y Pagar'}
        </button>
      </div>
    </div>
  );
};

export default Paso3Resumen;