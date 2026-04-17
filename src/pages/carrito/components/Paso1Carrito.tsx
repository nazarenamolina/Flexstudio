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
        <div className="bg-[#1a1a1a] rounded-xl p-10 flex flex-col items-center text-center w-full border border-neutral-800">
          <CartX className="w-16 h-16 text-neutral-500 mb-4" />
          <h3 className="text-xl font-bold mb-2 text-white">Tu carrito está vacío</h3>
          <p className="text-sm text-neutral-400 mb-6">Parece que aún no has seleccionado ninguna clase.</p>
          <Link to="/" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-3 rounded font-bold transition-colors">
            Descubrir clases
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center w-full">
      <h2 className="text-3xl font-bold mb-8 text-white">Tus entradas</h2>
      <div className="w-full space-y-6">
        <div className="border border-neutral-800 rounded-xl overflow-hidden">
          {cartItems.map((item) => {
            const precioItem = moneda === 'ARS' ? item.precioArs : item.precioUsd;
            const precioFormateado = moneda === 'ARS' 
              ? Number(precioItem || 0).toLocaleString('es-AR') 
              : Number(precioItem || 0).toFixed(2);

            return (
              <div key={item.id} className="p-4 md:p-6 flex justify-between items-center bg-[#1a1a1a] border-b border-neutral-800 last:border-b-0">
                <div>
                  <h3 className="font-bold text-lg text-white">{item.titulo}</h3>
                  <p className="text-neutral-400 mt-1">{simbolo} {precioFormateado}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="text-neutral-500 hover:text-red-500 transition-colors"
                    title="Eliminar del carrito"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 space-y-3">
          <h4 className="font-bold mb-4 text-white">Resumen de compra:</h4>
          <div className="flex justify-between text-sm text-neutral-300">
            <span>{cartItems.length} x Clases seleccionadas</span>
            <span>{simbolo} {totalFormateado}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-4 text-white border-t border-neutral-800 mt-4">
            <span>Total a pagar:</span>
            <span className="text-[#d7f250]">{simbolo} {totalFormateado}</span>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={onNext}
            className="w-full md:w-64 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3 rounded-lg transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paso1Carrito;