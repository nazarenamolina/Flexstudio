// src/pages/.../carrito/components/Paso3Resumen.tsx
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore'; 
import { useCheckout } from '../../../hooks/useCheckout'; 
import { type CheckoutPerfilData } from '../../../api/usuario';

interface Props {
  formData: CheckoutPerfilData;
  usuario: any;
  metodoPago: string;
  setMetodoPago: (metodo: string) => void;
  onPrev: () => void;
}

const Paso3Resumen = ({ formData, usuario, metodoPago, setMetodoPago, onPrev }: Props) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const { procesarCheckout, cargando, error } = useCheckout();

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.precioArs || 0), 0);
  const costoServicio = subtotal * 0.15;
  const total = subtotal + costoServicio;

  const handleConfirmar = async () => {
    const idsCategorias = cartItems.map((item) => item.id);
    
 
    await procesarCheckout(idsCategorias, formData);
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
        <div className="pt-4 space-y-1">
          <p className="text-sm text-neutral-400">Subtotal: $ {subtotal.toLocaleString('es-AR')}</p>
          <p className="text-sm text-neutral-400">Costo de plataforma: $ {costoServicio.toLocaleString('es-AR')}</p>
        </div>
      </div>

      {/* Total Gigante */}
      <div className="w-full border-t border-b border-neutral-800 py-4 text-center mb-8">
        <p className="text-2xl font-bold text-[#d7f250]">Total a pagar: $ {total.toLocaleString('es-AR')}</p>
      </div>

      <h3 className="font-bold text-lg mb-4 text-white">Elegí el medio de pago</h3>
      
      {/* Selectores de Pago */}
      <div className="w-full border border-neutral-800 rounded-xl overflow-hidden mb-8">
        <div 
          onClick={() => setMetodoPago('mercadopago')}
          className={`p-4 flex items-center gap-4 cursor-pointer border-b border-neutral-800 transition-colors ${metodoPago === 'mercadopago' ? 'bg-[#1a1a1a]' : 'hover:bg-[#111]'}`}
        >
          <div className="w-10 h-10 bg-[#009EE3] rounded-md flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">MP</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-white">Mercado Pago</h4>
            <p className="text-xs text-neutral-400">Tarjetas, Rapipago o dinero en cuenta</p>
          </div>
          {metodoPago === 'mercadopago' ? <CheckCircle2 className="text-[#8b5cf6]" /> : <Circle className="text-neutral-600" />}
        </div>

        <div 
          onClick={() => setMetodoPago('modo')}
          className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${metodoPago === 'modo' ? 'bg-[#1a1a1a]' : 'hover:bg-[#111]'}`}
        >
          <div className="w-10 h-10 bg-[#00A99D] rounded-md flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">M</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-white">MODO</h4>
            <p className="text-xs text-neutral-400">Paga con tu banco</p>
          </div>
          {metodoPago === 'modo' ? <CheckCircle2 className="text-[#8b5cf6]" /> : <Circle className="text-neutral-600" />}
        </div>
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