import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { ShoppingCart, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export const FloatingCart = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  
  const [minimizado, setMinimizado] = useState(false);

  if (cartItems.length === 0) return null;

  const totalArs = cartItems.reduce((acc, item) => acc + Number(item.precioArs || 0), 0);

  return (
    // 👇 Cambiamos bottom-6 por bottom-0 para anclarlo al ras de la pantalla
    <div className="fixed bottom-0 right-4 md:right-5 z-[100] flex flex-col items-end">
      <Transition show={!minimizado} as={Fragment} enter="transform transition ease-out duration-300" enterFrom="translate-y-full opacity-0" enterTo="translate-y-0 opacity-100" leave="transform transition ease-in duration-200" leaveFrom="translate-y-0 opacity-100" leaveTo="translate-y-full opacity-0">
 
        <div className="w-80 md:w-96 overflow-hidden rounded-t-2xl bg-[#1a1a1a] border-t border-l border-r border-white/10">
          
          <div className="flex items-center justify-between bg-[#131313] px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-[#d7f250] font-principal font-bold tracking-wider">
              <ShoppingCart size={20} />
              <span>TU CARRITO ({cartItems.length})</span>
            </div>
            <button 
              onClick={() => setMinimizado(true)}
              className="text-[#a1a1aa] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 👇 max-h-[50vh] le da hasta el 50% del alto de la pantalla para listar items */}
          <div className="max-h-[50vh] overflow-y-auto p-5 flex flex-col gap-4 custom-scrollbar">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white leading-tight">{item.titulo}</p>
                  <p className="text-xs text-[#a1a1aa] mt-1">{item.tipoAcceso}</p>
                </div>
                <div className="text-right flex flex-col items-end flex-shrink-0">
                  <p className="text-sm font-bold text-[#d7f250]">${item.precioArs}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-[10px] text-red-400 hover:text-red-300 mt-1.5 uppercase font-bold tracking-wide transition-colors"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#131313] p-5 border-t border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#a1a1aa]">Total estimado:</span>
              <span className="text-xl font-principal font-bold text-white">${totalArs}</span>
            </div>
            <button
              onClick={() => navigate('/carritoMP')}
              className="w-full flex justify-center items-center gap-2 rounded-full bg-[#d7f250] py-3 text-sm font-bold text-black font-principal hover:bg-white transition-colors"
            >
              FINALIZAR COMPRA <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Transition>

      {/* PESTAÑA MINIMIZADA (Anclada al borde) */}
      <Transition
        show={minimizado}
        as={Fragment}
        enter="transform transition ease-out duration-300 delay-200"
        enterFrom="translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transform transition ease-in duration-200"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-full opacity-0"
      >
        {/* 👇 Ahora es una pestaña rectangular anclada abajo, no un círculo flotante */}
        <button
          onClick={() => setMinimizado(false)}
          className="flex h-12 items-center justify-center gap-2 rounded-t-xl px-6 bg-[#d7f250] text-black shadow-[0_-5px_20px_rgba(215,242,80,0.2)] hover:bg-white transition-colors border-t border-l border-r border-[#d7f250]/50"
        >
          <ShoppingCart size={18} />
          <span className="font-principal font-bold text-sm tracking-wider">
            VER CARRITO ({cartItems.length})
          </span>
        </button>
      </Transition>
    </div>
  );
};