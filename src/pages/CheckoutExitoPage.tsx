import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export const CheckoutExitoPage = () => {
  const clearCart = useCartStore((state) => state.clearCart);
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    clearCart();
    window.scrollTo(0, 0);
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313] px-6">
      <div className="max-w-md w-full bg-[#1a1a1a] p-8 md:p-12 rounded-[2rem] border border-gray-800 text-center shadow-2xl">
        
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          Tu pago se ha procesado correctamente. Ya tienes acceso vitalicio a tus nuevas clases en Flex Studio.
        </p>

        {paymentId && (
          <div className="bg-black p-4 rounded-xl mb-8 border border-gray-800">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
              Nº de Comprobante
            </span>
            <span className="text-[#d7f250] font-mono">{paymentId}</span>
          </div>
        )}

        <Link 
          to="/mi-perfil"  
          className="w-full inline-flex items-center justify-center gap-2 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] font-bold py-4 rounded-xl transition-all hover:-translate-y-1 uppercase tracking-widest"
        >
          Ir a mis clases <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};