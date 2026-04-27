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
        <div className="fixed inset-0 z-50 flex justify-end">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/30"
              onClick={() => setMinimizado(true)}
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative w-full sm:max-w-md h-full bg-white shadow-2xl flex flex-col pointer-events-auto">
              <div className="px-6 pt-24 pb-5 border-b border-gray-100 relative bg-gradient-to-r from-gray-50 to-white">
                <button
                  onClick={() => setMinimizado(true)}
                  className="absolute top-6 right-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                >
                  <X size={20} strokeWidth={2} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d7f250] to-[#b8d940] flex items-center justify-center shadow-sm">
                    <BagHeart className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                      Tu Carrito
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      {cartItems.length} {cartItems.length === 1 ? 'clase' : 'clases'} seleccionadas
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A0A]">
                {cartItems.map((item) => {
                  const precioItem = moneda === 'ARS' ? item.precioArs : item.precioUsd;
                  const precioItemFormateado = moneda === 'ARS'
                    ? Number(precioItem || 0).toLocaleString('es-AR')
                    : Number(precioItem || 0).toFixed(2);

                  return (
                    <div
                      key={item.id}
                      className="relative bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1776544346/bg-card_dfxwsn.png')] bg-cover bg-center w-full rounded-2xl p-4 flex gap-4 shadow-sm border border-white/10 hover:shadow-md hover:border-[#d7f250]/30 transition-all duration-300 group"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-white/20">
                        <img
                          src={item.imagenTarjeta || 'https://placehold.co/150x150/111111/FFFFFF?text=Flex+Studio'}
                          alt={item.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="pr-8">
                          <h3 className="text-sm font-bold text-[#131313] uppercase leading-tight line-clamp-2">
                            {item.titulo}
                          </h3>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">
                            DESCRIPCION
                          </p>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                          <p className="text-lg font-bold text-[#d7f250]">
                            <span className="text-[10px] font-medium text-gray-400 mr-0.5">{simbolo}</span>
                            {precioItemFormateado}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-lg text-gray-900 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Quitar clase"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="px-6 py-5 bg-[#111111] border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="text-2xl font-bold text-white">
                    <span className="text-sm font-medium text-gray-400 mr-0.5">{simbolo}</span>
                    {totalFormateado}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setMinimizado(true);
                    navigate('/carrito');
                  }}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#d7f250] to-[#c4e038] py-4 font-bold text-gray-900 text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#d7f250]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Finalizar Compra
                  <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
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
        enterFrom="scale-0 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transform transition ease-in duration-200"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-0 opacity-0"
      >
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
          <button
            onClick={() => setMinimizado(false)}
            className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d7f250] to-[#c4e038] text-gray-900 hover:shadow-lg hover:shadow-[#d7f250]/30 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <ShoppingCart size={24} className="sm:w-[26px] sm:h-[26px]" strokeWidth={2} />

            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-bold text-white shadow-lg">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </Transition>
    </>
  );
};
