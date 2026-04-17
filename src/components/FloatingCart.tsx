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
        <div className="fixed inset-0 z-[150] flex justify-end">
          
 
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
              className="fixed inset-0 bg-black/70"  
              onClick={() => setMinimizado(true)} 
            />
          </Transition.Child>

          {/* 👇 SIDEBAR PANEL */}
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-400 sm:duration-500"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative w-full max-w-[450px] h-full bg-[#0A0A0A] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col z-[160] border-l border-white/5">
              
              {/* HEADER: Spacing limpio y tipografía fuerte */}
              <div className="px-8 pt-10 pb-6 border-b border-white/10 relative bg-[#111111]">
                <button 
                  onClick={() => setMinimizado(true)}
                  className="absolute top-8 right-6 text-neutral-600 hover:text-[#d7f250] hover:scale-110 transition-all"
                >
                  <X size={28} strokeWidth={1.5} />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <BagHeart className="w-8 h-8 text-[#d7f250]" />
                  <h2 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">
                    Carrito
                  </h2>
                </div>
                <p className="text-neutral-500 font-principal font-bold tracking-[0.25em] text-xs uppercase pl-11">
                  Resumen de tus clases ({cartItems.length})
                </p>
              </div>

              {/* LISTA DE PRODUCTOS */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#0A0A0A]">
                {cartItems.map((item) => {
                  const precioItem = moneda === 'ARS' ? item.precioArs : item.precioUsd;
                  const precioItemFormateado = moneda === 'ARS' 
                    ? Number(precioItem || 0).toLocaleString('es-AR') 
                    : Number(precioItem || 0).toFixed(2);

                  return (
                    /* 👇 3. ITEM CARD: Con Gradiente sutil y borde neón al hover */
                    <div 
                      key={item.id} 
                      className="bg-gradient-to-br from-neutral-900 via-[#1a1a1a] to-neutral-900 rounded-2xl p-5 flex gap-5 hover:border-[#d7f250]/30 transition-all duration-300 group relative shadow-lg"
                    >
                      {/* Imagen con overlay gradiente */}
                      <div className="w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden relative border border-white/10">
                        <img 
                          src={item.imagenTarjeta || 'https://placehold.co/150x150/111111/FFFFFF?text=Flex+Studio'} 
                          alt={item.titulo} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>

                      {/* Info del Producto */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="pr-8">
                          <h3 className="text-lg font-bold text-white uppercase leading-tight tracking-tight">
                            {item.titulo}
                          </h3>
                          <p className="text-[10px] text-neutral-500 font-principal font-bold uppercase tracking-[0.15em] mt-1.5 flex items-center gap-1.5">DESCRIPCION</p>
                        </div>
                        
                        <div className="flex justify-between items-end mt-4">
                          {/* Precio destacado en Amarillo Neón */}
                          <p className="text-2xl font-black text-[#d7f250] tracking-tight">
                            <span className="text-xs font-bold text-neutral-400 mr-1">{simbolo}</span>
                            {precioItemFormateado}
                          </p>
                        </div>
                      </div>

                      {/* Botón Eliminar Estilizado */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute bottom-5 right-4 p-2 bg-black/50 rounded-lg text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Quitar clase"
                      >
                        <Trash2 size={18} strokeWidth={1.5}/>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER: Premium, oscuro, total gigante */}
              <div className="px-8 py-2 bg-[#111111] border-t border-white/10">
                <div className="flex justify-between items-center mb-6 py-4 border-b border-white/10">
                  <span className="text-neutral-500 tracking-[0.2em] font-principal font-bold uppercase text-sm">
                    Total a pagar
                  </span>
                  <span className="text-4xl font-black text-white tracking-tighter shadow-neon-white">
                    <span className="text-lg font-bold text-neutral-400 mr-2">{simbolo}</span>
                    {totalFormateado}
                  </span>
                </div>
                
                {/* Botón Finalizar Compra con Rosa Neón de Flex Studio */}
                <button
                  onClick={() => {
                    setMinimizado(true);
                    navigate('/carrito');
                  }}
                  className="mb-4 flex items-center justify-center gap-3 w-full rounded-full bg-neon-pink px-8 py-5 font-principal text-xl font-bold text-[#131313] transition-all duration-400 hover:-translate-y-1.5 hover:bg-white active:translate-y-0 cursor-pointer uppercase tracking-wider"
                >
                  Finalizar Compra <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>

      {/* --- BOTÓN FLOTANTE "GLOBITO" (CERRADO) --- */}
      {/* Mantenemos tu lógica pero mejoramos el estilo visual */}
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
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[140]">
          <button
            onClick={() => setMinimizado(false)}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#d7f250] text-black shadow-[0_10px_40px_rgba(215,242,80,0.4)] hover:bg-white hover:scale-110 transition-all duration-300 border-3 border-[#0A0A0A]"
          >
            <ShoppingCart size={26} strokeWidth={2.5} />
            
            {/* Burbuja de cantidad mejorada */}
             {cartItems.length > 0 && (

              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] border-2 border-[#d7f250] text-[11px] font-black text-white">

                {cartItems.length}

              </span>
            )}
          </button>
        </div>
      </Transition>
    </>
  );
};


