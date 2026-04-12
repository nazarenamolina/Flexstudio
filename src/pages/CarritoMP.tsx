import { ArrowRight, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useCheckout } from '../hooks/useCheckout';
import { CartX } from 'react-bootstrap-icons';

const CarritoMP = () => {

  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const { iniciarPagoMP, cargando, error } = useCheckout();
  const handleProcederAlPago = () => {
    const idsParaPagar = cartItems.map(item => item.id);
    iniciarPagoMP(idsParaPagar);
  };
  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.precioArs || 0), 0);
  const impuestos = 0.00;
  const total = subtotal + impuestos;

  return (
    <section className="min-h-screen pt-25 px-6 md:pt-25">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#131313] tracking-tight mb-2">Tus clases: </h1>
        <p className="text-[#131313]/70 text-sm max-w-2xl"> Revisá las clases seleccionadas antes de proceder al pago. </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-8">

          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {cartItems.length > 0 && (
              <h2 className="mb-4 rounded-full bg-[#d7f250]/80 px-4 py-1 text-sm font-bold text-[#131313]/80 uppercase w-fit">
                Clases Seleccionadas ( {cartItems.length} )
              </h2>
            )}
            {cartItems.length === 0 ? (
              <div className="bg-[#ebe9e9] rounded-xl p-6 sm:p-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 sm:gap-10">
                <div className="flex-shrink-0">
                  <CartX className="w-16 h-16 text-[#131313]/" />
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-xl font-bold text-[#131313] mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-sm text-[#131313]/70 max-w-[250px] mx-auto sm:mx-0">
                    Parece que aún no has seleccionado ninguna clase. Explora el catálogo y encuentra la clase perfecta para ti.
                  </p>
                </div>

                <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-center sm:justify-end">
                  <Link
                    to="/"
                    className="w-full sm:w-fit flex items-center justify-center gap-2 rounded-full bg-[#d7f250] px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg font-bold text-[#131313] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#131313] hover:text-[#d7f250] cursor-pointer"
                  >
                    <span>Descubrir clases</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-row gap-6 p-5 rounded-xl border-[3px] border-transparent hover:border-[#d7f250]/80 bg-[#131313] transition-all group relative">
                    <div className="w-22 sm:w-32 aspect-square rounded-lg overflow-hidden flex-shrink-0 relative">
                      {item.imagenTarjeta && (
                        <img
                          src={item.imagenTarjeta}
                          alt={`Portada de la clase ${item.titulo}`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                        />
                      )}
                    </div>

                    <div className="flex flex-col justify-start flex-1 pt-1">
                      <h3 className="text-base sm:text-lg md:text-md font-bold leading-tight mb-4 pr-2 sm:pr-8 text-[#d7f250] tracking-wider uppercase border-b border-neutral-700 pb-4">
                        {item.titulo}
                      </h3>
                      <span className="text-[15px] md:text-xl font-bold text-[#fff]">
                        ${Number(item.precioArs || 0).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-3 right-2 sm:top-5 sm:right-5 p-2 text-[#a1a1aa] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
                      title="Eliminar del carrito"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <aside className="lg:col-span-5">
            {cartItems.length === 0 ? (
              /* TARJETA VACÍA */
              <div className="bg-[#ebe9e9] rounded-xl border border-neutral-200/50 sticky top-8">
                <div className="px-6 py-5 border-b border-neutral-300">
                  <h3 className="text-[17px] font-bold text-[#84848c]">
                    Resumen de compra
                  </h3>
                </div>

                <div className="px-6 py-6 pb-10">
                  <p className="text-sm text-[#84848c]/90 leading-relaxed">
                    Acá verás el resumen detallado de tu compra. ¡Tu próxima clase está a solo unos clics de distancia!
                  </p>
                </div>
              </div>
            ) : (
              /* TARJETA DE RESUMEN COMPLETO */
              <div className="bg-[#131313] rounded-xl p-6 sm:p-8 md:p-10 sticky mb-10 lg:mt-14 text-white">
                <h3 className="text-xs text-[#d7f250] font-bold tracking-widest uppercase mb-8">
                  Resumen de Compra
                </h3>

                <div className="space-y-4 border-b border-white/10 pb-6 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a1a1aa]">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-end gap-2 mb-8">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest">Total a pagar</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#d7f250]">${total.toFixed(2)}</span>
                </div>

                {/* Mensaje de Error del Backend / MP */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 text-xs p-3 rounded mb-6 text-center">
                    {error}
                  </div>
                )}

                {/* Botón para avanzar a métodos de pago */}
                <button
                  onClick={handleProcederAlPago}
                  disabled={cargando}
                  className="w-full bg-[#d7f250] hover:bg-[#c4e03b] text-black font-bold uppercase tracking-wider sm:tracking-widest text-xs sm:text-sm py-4 sm:py-5 rounded transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {cargando ? (
                    <><Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" /> PROCESANDO...</>
                  ) : (
                    <>Continuar con la compra <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </aside>

        </div>
      </div>
    </section>
  );
}

export default CarritoMP;