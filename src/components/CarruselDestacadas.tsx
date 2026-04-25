import { Star } from 'lucide-react';
import { TarjetaClase } from './TarjetaClase';  
import { type Categoria } from '../api/categoria';

interface Props {
  categorias: Categoria[];
  flippedCard: string | number | null;
  setFlippedCard: (id: string | null) => void;
}

export const CarruselDestacadas = ({ categorias, flippedCard, setFlippedCard }: Props) => {
  if (categorias.length === 0) return null;

  return (
    <section className="container mx-auto px-6 pt-20">
      {/* Título decorativo */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px bg-gray-200 flex-1" />
        <h2 className="text-xl font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
          <Star className="text-[#d7f250]" fill="#d7f250" size={20} /> Más Elegidas
        </h2>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      {/* Contenedor del Carrusel (Tailwind Puro) */}
      <div className="w-full relative">
        <div 
          className="flex overflow-x-auto gap-8 pb-10 px-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {categorias.map((servicio) => (
           <div key={servicio.id} className="snap-center shrink-0 w-[85vw] sm:w-[400px] md:w-[416px]">
              <TarjetaClase
                servicio={servicio}
                flippedCard={flippedCard}
                setFlippedCard={setFlippedCard}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};