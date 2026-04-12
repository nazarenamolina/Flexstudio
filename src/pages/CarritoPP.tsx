import { Lock, ShieldCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore'; 
import { BotonPayPal } from '../components/BotonPayPal';  

const CarritoPP = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.precioUsd || 0), 0);
  const impuestos = 0.00;
  const total = subtotal + impuestos;

  return (
    <section className="min-h-screen pt-25 px-6 md:pt-25">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#131313] tracking-tight mb-2">Tus clases (Internacional): </h1>
        <p className="text-[#131313]/70 text-sm max-w-2xl"> Revisá las clases seleccionadas antes de proceder al pago seguro. </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* COLUMNA IZQUIERDA: Lista de Clases */}
          <div className="lg:col-span-7 flex flex-col pt-8 gap-3">
            <h2 className="mb-4 rounded-full bg-[#131313]/80 px-4 py-1 text-sm font-bold text-[#d7f250] uppercase w-fit">
              Clases Seleccionadas ( {cartItems.length} )
            </h2>

            {cartItems.length === 0 ? (
              <div className="py-20 text-center rounded-xl bg-[#b6b5b9bb]">
                <p className="text-[#131313]/60 text-sm mb-10">Tu carrito está vacío.</p>
                <Link to={`/`} className="w-full rounded-full bg-[#d7f250] px-4 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313] cursor-pointer transition hover:bg-[#c4e03b] duration-700 hover:-translate-y-1 inline-block">
                  <span>Explorar Clases</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-5 rounded-xl border border-transparent hover:border-[#d7f250]/30 bg-[#1a1a1a] transition-all group relative">
                    <div className="w-full sm:w-40 aspect-video sm:aspect-square bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                       <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent"></div>
                    </div>
                    
                    <div className="flex flex-col justify-center flex-1">
                      <span className="text-[10px] text-[#d7f250] font-bold uppercase tracking-widest mb-2 block">
                        {item.tipoAcceso || 'Acceso Vitalicio'}
                      </span>
                      <h3 className="text-lg font-bold leading-tight mb-2 pr-8 text-white">
                        {item.titulo}
                      </h3>
                      {/* 👇 CAMBIO 2: Mostramos U$D y precioUsd */}
                      <span className="text-xl font-bold text-[#ffffff] mt-auto">
                        U$D {Number(item.precioUsd || 0).toFixed(2)}
                      </span>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="absolute top-5 right-5 p-2 text-[#a1a1aa] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all sm:opacity-0 sm:group-hover:opacity-100">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Resumen y PayPal */}
          <aside className="lg:col-span-5">
            <div className="bg-[#131313] rounded-xl p-8 sticky top-8 text-white">
              <h3 className="text-xs text-[#d7f250] font-bold tracking-widest uppercase mb-8">
                Resumen de Orden
              </h3>

              <div className="space-y-4 border-b border-white/10 pb-6 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a1a1aa]">Subtotal</span>
                  <span className="font-semibold">U$D {subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-bold uppercase tracking-widest">Total a pagar</span>
                <span className="text-4xl font-bold text-[#d7f250]">U$D {total.toFixed(2)}</span>
              </div>

              {/* 👇 CAMBIO 3: Renderizamos el Botón Inteligente de PayPal */}
              <div className="mt-6">
                {cartItems.length > 0 ? (
                  <BotonPayPal />
                ) : (
                  <button disabled className="w-full bg-gray-600 text-gray-400 font-bold uppercase tracking-widest text-sm py-5 rounded cursor-not-allowed">
                    Carrito Vacío
                  </button>
                )}
              </div>

              <div className="border-t border-white/10 pt-8 mt-8">
                <div className="flex justify-center gap-8 text-[#a1a1aa]">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase"><Lock className="w-4 h-4" /> SSL Encrypted</div>
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase"><ShieldCheck className="w-4 h-4" /> PayPal Secure</div>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default CarritoPP;