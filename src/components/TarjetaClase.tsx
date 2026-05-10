import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Star, PlaySquare, Infinity as InfinityIcon } from 'lucide-react';
import { type Categoria } from '../api/categoria';

interface Props {
  servicio: Categoria;
  flippedCard: string | number | null;
  setFlippedCard: (id: string | null) => void;
}

export const TarjetaClase = ({ servicio, flippedCard, setFlippedCard }: Props) => {
  const isFlipped = flippedCard === servicio.id;
  const imagenFondo = servicio.imagenTarjeta || servicio.imagenHero || 'https://placehold.co/400x500/1a1a1a/FFF?text=Flex+Studio';
  const cantidadVideos = servicio.cantidadVideos || 0;
  const duracionTotal = servicio.duracionTotalFormateada || '0m';

  return (
    <div
      className="relative w-full h-full group [perspective:1200px] cursor-pointer shrink-0"
      onClick={() => setFlippedCard(isFlipped ? null : servicio.id)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-[700ms] [transform-style:preserve-3d] rounded-[32px] lg:group-hover:[transform:rotateY(180deg)] shadow-xl ${isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
      >
        {/* =======================
            FRENTE DE LA TARJETA 
        ======================= */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[32px] overflow-hidden z-10 bg-[#0a0a0a]">

          {/* Imagen de fondo con respiración (zoom lento en hover) */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imagenFondo})` }}  />

          {/* Gradiente Dark Glass */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent opacity-95" />

          <div className="relative flex flex-col justify-between h-full p-6 sm:p-8">

            {/* Badges Glassmorphism */}
            <div className="flex justify-start items-start w-full">
              {servicio.destacada && (
                <span className="bg-black/40 border border-white/10 text-[#d7f250] px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.15em] uppercase shadow-lg flex items-center gap-1.5">
                  <Star size={12} fill="currentColor" /> Destacada
                </span>
              )}
            </div>

            {/* Títulos y CTA Visual */}
            <div className="mt-auto">
              <h3 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-[1.05] drop-shadow-2xl">
                {servicio.titulo}
              </h3>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)] z-20 rounded-[32px] overflow-hidden bg-[#0a0a0a]">
          <div
            className="absolute inset-0 bg-cover bg-center blur-xs scale-125 opacity-100 mix-blend-screen"
            style={{ backgroundImage: `url(${imagenFondo})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/20 via-[#0a0a0a]/80 to-[#0a0a0a]" />

          {/* Contenido */}
          <div className="relative z-10 h-full flex flex-col p-6 sm:p-8">

            {/* Bloque superior que desliza hacia arriba */}
            <div className={`flex-1 flex flex-col justify-center transition-all duration-800 delay-100 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 lg:group-hover:opacity-100 lg:group-hover:translate-y-0'}`}>
              <h4 className="text-[#d7f250] text-2xl sm:text-3xl font-black mb-4 leading-tight text-center drop-shadow-md">
                {servicio.titulo}
              </h4>
              <p className="text-gray-200 text-sm sm:text-[15px] mb-6 line-clamp-4 leading-relaxed font-medium drop-shadow-md wrap-break-word">
                {servicio.descripcionCard || 'Descripción no disponible.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-auto mb-6 sm:mb-10">
                <div className="flex flex-col justify-center bg-white/5 border border-white/10 rounded-[14px] sm:rounded-2xl p-2.5 sm:p-3 blur-s">
                  <PlaySquare className="text-[#d7f250] w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1 sm:mb-1.5" />
                  <span className="text-white font-black text-xs sm:text-sm">{cantidadVideos} VIDEOS</span>
                  <span className="text-gray-400 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold">Contenido</span>
                </div>
                <div className="flex flex-col justify-center bg-white/5 border border-white/10 rounded-[14px] sm:rounded-2xl p-2.5 sm:p-3 blur-s">
                  <Clock className="text-[#d7f250] w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1 sm:mb-1.5" />
                  <span className="text-white font-black text-xs sm:text-sm">{duracionTotal}</span>
                  <span className="text-gray-400 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold">Duración Total</span>
                </div>
                <div className="flex flex-col justify-center bg-white/5 border border-white/10 rounded-[14px] sm:rounded-2xl p-2.5 sm:p-3 blur-s col-span-2 sm:col-span-1">
                  <InfinityIcon className="text-[#d7f250] w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1 sm:mb-1.5" />
                  <span className="text-white font-black text-xs sm:text-sm">24/7</span>
                  <span className="text-gray-400 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold">Acceso</span>
                </div>

              </div>
            </div>

            {/* Botón Inferior Magnético */}
            <div className={`mt-auto transition-all duration-700 delay-200 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 lg:group-hover:opacity-100 lg:group-hover:translate-y-0'}`}>
              <Link
                to={`/categorias/${servicio.id}`}
                onClick={(e) => e.stopPropagation()}
                className="group/btn flex items-center justify-center w-full bg-[#d7f250] text-[#131313] font-black rounded-2xl px-6 py-4 sm:py-5 transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(215,242,80,0.3)] uppercase tracking-widest text-xs sm:text-sm"
              >
                Ver Masterclass
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-2" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};