import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { ShoppingCart, X, ArrowRight, Trash2 } from 'lucide-react';  
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useMoneda } from '../hooks/useMoneda';
import { BagHeart } from 'react-bootstrap-icons';

export const FloatingCart = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const { moneda } = useMoneda(); 
  const [minimizado, setMinimizado] = useState(true);

  if (cartItems.length === 0) return null;

  const total = cartItems.reduce((acc, item) => {
    const precio = moneda === 'ARS' ? item.precioArs : item.precioUsd;
    return acc + Number(precio || 0);
  }, 0);

  const simbolo = moneda === 'ARS' ? '$' : 'U$D ';
  const totalFormateado = moneda === 'ARS' ? total.toLocaleString('es-AR') : total.toFixed(2);

  return (  
    <>
      <Transition show={!minimizado} as={Fragment}>
        <div className="fixed inset-0 z-10 flex justify-end pointer-events-none">
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div 
              className="fixed inset-0 bg-black/70 pointer-events-auto"  
              onClick={() => setMinimizado(true)} 
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-400 sm:duration-500"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative w-[85vw] sm:w-full sm:max-w-[450px] h-full bg-[#0A0A0A] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col border-l border-white/5 pointer-events-auto">

              <div className="px-5 sm:px-8 pt-25 sm:pt-25 pb-4 sm:pb-6 border-b border-white/10 relative bg-[#111111]">
                <button 
                  onClick={() => setMinimizado(true)}
                  className="absolute top-6 sm:top-8 right-4 sm:right-6 text-neutral-600 hover:text-[#d7f250] hover:scale-110 transition-all"
                >
                  <X size={24} className="sm:w-7 sm:h-7" strokeWidth={1.5} />
                </button>
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <BagHeart className="w-6 h-6 sm:w-8 sm:h-8 text-[#d7f250]" />
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter leading-none uppercase">
                    Carrito
                  </h2>
                </div>
                <p className="text-neutral-500 font-principal font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs uppercase pl-8 sm:pl-11">
                  Resumen de tus clases ({cartItems.length})
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-hide bg-[#0A0A0A]">
                {cartItems.map((item) => {
                  const precioItem = moneda === 'ARS' ? item.precioArs : item.precioUsd;
                  const precioItemFormateado = moneda === 'ARS' 
                    ? Number(precioItem || 0).toLocaleString('es-AR') 
                    : Number(precioItem || 0).toFixed(2);

                  return (
                    <div 
                      key={item.id} 
                      className="bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1776544346/bg-card_dfxwsn.png')] bg-cover bg-center w-full rounded-xl sm:rounded-2xl p-3 sm:p-5 flex gap-3 sm:gap-5 hover:border-[#d7f250]/30 transition-all duration-300 group relative shadow-lg"
                    >

                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl flex-shrink-0 overflow-hidden relative border border-white/10">
                        <img 
                          src={item.imagenTarjeta || 'https://placehold.co/150x150/111111/FFFFFF?text=Flex+Studio'} 
                          alt={item.titulo} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="pr-6 sm:pr-8">
                          <h3 className="text-[13px] sm:text-sm font-principal font-bold text-[#131313] uppercase leading-tight line-clamp-2">
                            {item.titulo}
                          </h3>
                          <p className="text-[9px] sm:text-[10px] text-neutral-500 font-principal font-bold uppercase tracking-[0.15em] mt-1 flex items-center gap-1.5">
                            DESCRIPCION
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-end mt-2 sm:mt-4">
                          <p className="text-lg sm:text-2xl font-black text-[#d7f250] tracking-tight">
                            <span className="text-[10px] sm:text-xs font-bold text-neutral-400 mr-1">{simbolo}</span>
                            {precioItemFormateado}
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute bottom-2 right-2 sm:bottom-5 sm:right-4 p-1.5 sm:p-2 bg-black/50 rounded-lg text-neutral-900 hover:text-red-500 hover:bg-red-500/10 transition-all sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                        title="Quitar clase"
                      >
                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5}/>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 sm:px-8 py-4 sm:py-2 bg-[#111111] border-t border-white/10">
                <div className="flex justify-between items-center mb-4 sm:mb-6 py-3 sm:py-4 border-b border-white/10">
                  <span className="text-neutral-500 tracking-[0.15em] sm:tracking-[0.2em] font-principal font-bold uppercase text-[11px] sm:text-sm">
                    Subtotal: 
                  </span>
                  <span className="text-2xl sm:text-4xl font-black text-white tracking-tighter shadow-neon-white">
                    <span className="text-sm sm:text-lg font-bold text-neutral-400 mr-1.5">{simbolo}</span>
                    {totalFormateado}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setMinimizado(true);
                    navigate('/carrito');
                  }}
                  className="w-full mb-2 sm:mb-4  gap-2 sm:gap-3 rounded-full bg-neon-pink px-4 sm:px-8 py-3.5 sm:py-3 font-principal text-sm sm:text-xl font-bold text-[#131313] flex items-center justify-center transition-all duration-400 hover:-translate-y-1 sm:hover:-translate-y-1.5 hover:bg-white active:translate-y-0 cursor-pointer uppercase "
                >
                  Finalizar Compra <ArrowRight size={20} strokeWidth={3} className="sm:w-[22px] sm:h-[22px] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>

      <Transition
        show={minimizado}
        as={Fragment}
        enter="transform transition ease-out duration-400 delay-300"
        enterFrom="scale-0 opacity-0 rotate-180"
        enterTo="scale-100 opacity-100 rotate-0"
        leave="transform transition ease-in duration-300"
        leaveFrom="scale-100 opacity-100 rotate-0"
        leaveTo="scale-0 opacity-0 rotate-180"
      >
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-10">
          <button
            onClick={() => setMinimizado(false)}
            className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#d7f250] text-black hover:bg-white hover:scale-110 transition-all duration-300 border-3 border-[#0A0A0A] cursor-pointer shadow-lg"
          >
            <ShoppingCart size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={2.5} />

             {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#111111] border-2 border-[#d7f250] text-[9px] sm:text-[11px] font-black text-white">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </Transition>
    </>
  );
};