import { useCheckout } from '../hooks/useCheckout';
import { Loader2 } from 'lucide-react';

export const CheckoutPage = () => {
  const { iniciarPagoMP, cargando, error } = useCheckout();

  // Por ahora lo hardcodeamos para la prueba. 
  // Luego esto lo sacaremos de la URL o del estado global.
  const ID_CATEGORIA_PRUEBA = '34e62e9d-034d-4f8c-92b7-40903dd6f5d1'; 
  
  const producto = {
    titulo: 'Suscripción Elite Training Program',
    precio: '$15.000 ARS',
  };

  const handlePagar = () => {
    iniciarPagoMP(ID_CATEGORIA_PRUEBA);
  };

  return (
    <div className="min-h-screen bg-bg-card flex items-center justify-center p-4 font-sans text-white">
      <div className="max-w-md w-full bg-[#131313] rounded-lg p-8 border border-[#d7f250]/20 shadow-2xl">
        
        <h1 className="text-3xl font-black text-[#d7f250] tracking-tighter mb-6 text-center">
          Finalizar Compra
        </h1>
        
        <div className="bg-black/40 rounded-md p-5 mb-6 border border-gray-800">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
            Resumen de tu plan
          </h2>
          
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">{producto.titulo}</span>
          </div>
          
          <div className="flex justify-between items-center text-[#d7f250] font-black text-xl mt-4 pt-4 border-t border-gray-800">
            <span>Total a pagar:</span>
            <span>{producto.precio}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-xs p-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handlePagar}
          disabled={cargando}
          className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-black font-black text-sm py-4 px-4 rounded transition-all duration-200 flex items-center justify-center disabled:opacity-70"
        >
          {cargando ? (
            <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> CONECTANDO...</>
          ) : (
            'PAGAR CON MERCADO PAGO'
          )}
        </button>
        
        <p className="text-center text-gray-500 text-[10px] mt-4 uppercase tracking-widest">
          Serás redirigido de forma segura a Mercado Pago
        </p>

      </div>
    </div>
  );
};