import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Star } from 'lucide-react';
import { type Categoria } from '../api/categoria'; 

interface Props {
  servicio: Categoria;
  flippedCard: string | number | null;
  setFlippedCard: (id: string | null) => void;
}

export const TarjetaClase = ({ servicio, flippedCard, setFlippedCard }: Props) => {
  return (
    <div 
      className="relative w-full h-full group [perspective:1000px] cursor-pointer shrink-0"
      onClick={() => setFlippedCard(flippedCard === servicio.id ? null : servicio.id)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] rounded-[30px] lg:group-hover:[transform:rotateY(180deg)] ${
          flippedCard === servicio.id ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Frente de la Tarjeta */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[30px] overflow-hidden z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${servicio.imagenTarjeta || servicio.imagenHero || 'https://placehold.co/400x500/1a1a1a/FFF?text=Flex+Studio'})` }}
          />
          <div 
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(215, 242, 80, 0.48) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.2) 100%)' }}
          />

          <div className="relative flex flex-col justify-between h-full p-[24px]">
            <div className="flex justify-between items-center w-full">
              {servicio.destacada ? (
                <span className="bg-white text-black px-[12px] py-[5px] rounded-[20px] text-[0.7rem] font-black tracking-[1.5px] uppercase shadow-lg flex items-center gap-1 border-2 border-[#d7f250]">
                  <Star size={12} fill="currentColor" /> Destacada
                </span>
              ) : (
                <span className="bg-[#d7f250] text-[#0f172a] px-[12px] py-[5px] rounded-[20px] text-[0.75rem] font-extrabold tracking-[1.5px] uppercase shadow-sm">
                  Plan Mensual
                </span>
              )}
              <span className="flex items-center text-white text-[0.76rem] font-bold drop-shadow-md">
                <Clock className="w-[14px] h-[14px] mr-[6px] text-white" /> 1h 15min
              </span>
            </div>
            <h3 className="mt-auto text-white text-4xl md:text-5xl font-bold mb-[12px] leading-[1.1] drop-shadow-lg">
              {servicio.titulo}
            </h3>
          </div>
        </div>

        {/* Dorso de la Tarjeta */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)] z-20 rounded-[30px] overflow-hidden bg-[#161616] p-[32px] flex flex-col justify-center items-center text-center border border-[#d7f250]/20">
          <h4 className="text-[#d7f250] text-3xl font-bold mb-6">
            {servicio.titulo}
          </h4>
          <p className="text-white/80 text-base mb-10">
            {servicio.descripcionCard || 'Descripción no disponible.'}
          </p>
          <Link
            to={`/categorias/${servicio.id}`}
            onClick={(e) => e.stopPropagation()}
            className="group/btn relative z-30 flex items-center justify-center w-max bg-[#d7f250] text-[#161616] font-bold rounded-[50px] px-6 py-3 transition-all duration-300 hover:bg-white hover:scale-105"
          >
            <span className="mr-2">Ver Más</span>
            <ArrowRight className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};