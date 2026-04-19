import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { CartX } from 'react-bootstrap-icons';
import { useCartStore } from '../../../store/cartStore';
import { useMoneda } from '../../../hooks/useMoneda';

interface Props {
  onNext: () => void;
}

const Paso1Carrito = ({ onNext }: Props) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const { moneda } = useMoneda();
  const total = cartItems.reduce((acc, item) => {
    const precio = moneda === 'ARS' ? item.precioArs : item.precioUsd;
    return acc + Number(precio || 0);
  }, 0);

  const simbolo = moneda === 'ARS' ? '$' : 'U$D';
  const totalFormateado = moneda === 'ARS' ? total.toLocaleString('es-AR') : total.toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center w-full">
        <div className="bg-[#c9c5c5]/70 rounded-xl p-10 flex flex-col items-center text-center w-full border border-neutral-300">
          <CartX className="w-16 h-16 text-[#131313]/70 mb-4" />
          <h3 className="text-xl font-bold mb-2 text-[#131313]/70">Tu carrito está vacío</h3>
          <p className="text-sm text-neutral-500 mb-6">Parece que aún no has seleccionado ninguna clase.</p>
          <Link to="/" className="flex items-center justify-center gap-3 rounded-full bg-neon-pink px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer">
            Descubrir clases
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center w-full">
      <h2 className="text-4xl font-principal font-bold mb-8 text-[#131313]">Tus clases</h2>
      <div className="w-full space-y-6">
        <div className="border-2 border-[#131313]/50 rounded-xl overflow-hidden">
          {cartItems.map((item) => {
            const precioItem = moneda === 'ARS' ? item.precioArs : item.precioUsd;
            const precioFormateado = moneda === 'ARS'
              ? Number(precioItem || 0).toLocaleString('es-AR')
              : Number(precioItem || 0).toFixed(2);

            return (
              <div
                key={item.id}
                className="bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1776544346/bg-card_dfxwsn.png')] bg-cover bg-center w-full rounded-xl sm:rounded-2xl p-3 sm:p-5 flex gap-3 sm:gap-5 transition-all duration-300 group relative shadow-lg"
              >

                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl flex-shrink-0 overflow-hidden relative border border-white/10">
                  <img
                    src={item.imagenTarjeta || 'https://placehold.co/150x150/111111/FFFFFF?text=Flex+Studio'}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="pr-6 sm:pr-8">
                    <h3 className="text-[13px] sm:text-2xl font-principal font-bold text-[#131313] uppercase leading-tight line-clamp-2">
                      {item.titulo}
                    </h3>
                    <p className="text-[9px] sm:text-sm text-neutral-500 font-principal font-bold uppercase tracking-[0.15em] mt-1 flex items-center gap-1.5">
                      DESCRIPCION
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-2 sm:mt-4">
                    <p className="text-lg sm:text-2xl font-black text-[#131313]/90 tracking-tight">
                      <span className="text-[10px] sm:text-xs font-bold text-neutral-400 mr-1">{simbolo}</span>
                      {precioFormateado}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute bottom-2 right-2 sm:bottom-5 sm:right-4 p-1.5 sm:p-2 bg-black/50 rounded-lg text-neutral-900 hover:text-red-500 hover:bg-red-500/10 transition-all sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                  title="Quitar clase"
                >
                  <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-lg mx-auto flex flex-col">
          <h3 className="font-principal text-2xl mb-3 text-[#131313]">Resumen de compra:</h3>
          <div className="flex justify-between font-principal text-neutral-800">
            <span>Aca define la clase seleccionada:</span>
            <span>{simbolo} {totalFormateado}</span>
          </div>
          <div className="flex justify-between text-lg font-principal font-bold pt-4 text-[#131313] border-t border-neutral-400 mt-4">
            <span>Total a pagar:</span>
            <span className="text-[#131313]">{simbolo} {totalFormateado}</span>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={onNext}
            className="flex items-center justify-center gap-3 rounded-full bg-neon-pink px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paso1Carrito;