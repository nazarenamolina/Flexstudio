import { Link } from 'react-router-dom';
import type { ClaseComprada } from '../api/compras';
import { IMAGEN_RESPALDO_CLASE, optimizarCloudinary } from '../imagenes';

interface Props {
  clase: ClaseComprada;
}

export const ClaseCard = ({ clase }: Props) => { 
  const portada = optimizarCloudinary(clase.imagenTarjeta || clase.imagenHero || IMAGEN_RESPALDO_CLASE, 800);

  return (
    <Link 
      to={`/mis-clases/${clase.id}`} 
      className="group relative flex flex-col overflow-hidden rounded-[24px] bg-[#131313] text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#d7f250]/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d7f250]"
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-800">
        <img 
          src={portada} 
          alt={clase.titulo}
          className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/40 to-transparent"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-5">
        <h3 className="mb-1 font-principal text-2xl uppercase leading-tight text-white drop-shadow-md">
          {clase.titulo}
        </h3>
        
        {clase.descripcionCard && (
          <p className="line-clamp-1 text-sm text-gray-300">
            {clase.descripcionCard}
          </p>
        )}
        
        <div className="mt-3 flex items-center gap-2 font-principal uppercase tracking-wide text-[#d7f250] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Empezar a ver
        </div>
      </div>
    </Link>
  );
};