import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, RotateCcw, GraduationCap } from 'lucide-react';
import { useMisClases } from '../hooks/useMisClases';
import { ClaseCard } from '../components/ClaseCard';
import { claseTarjeta, claseBotonPrincipal } from './auth/estilos';

// Botón principal del sitio, del ancho de su texto (no de toda la tarjeta).
const botonAncho = claseBotonPrincipal.replace('w-full', 'w-auto');

export const MisClasesPage = () => {
  const { clases, cargando, error, reintentar } = useMisClases();

  return (
    <main className="px-4 md:px-8 pb-16 pt-28 text-[#131313]">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-principal text-4xl md:text-5xl uppercase leading-tight mb-10">
          Mis <span className="bg-[#d7f250] px-2">clases</span>
        </h1>

        {cargando ? (
          <div className="flex min-h-[40vh] items-center justify-center" aria-busy>
            <Loader2 className="h-10 w-10 animate-spin text-[#131313]" />
          </div>
        ) : error ? (
          <div role="alert" className={`${claseTarjeta} mx-auto max-w-lg p-8 text-center flex flex-col items-center gap-4`}>
            <AlertTriangle className="h-10 w-10 text-red-600" />
            <p className="font-semibold">{error}</p>
            <button type="button" onClick={reintentar} className={botonAncho}>
              <RotateCcw size={18} /> Reintentar
            </button>
          </div>
        ) : clases.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {clases.map((clase) => (
              <ClaseCard key={clase.id} clase={clase} />
            ))}
          </div>
        ) : (
          <div className={`${claseTarjeta} mx-auto max-w-lg flex flex-col items-center py-14 px-6 text-center`}>
            <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#d7f250]">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h2 className="mb-2 font-principal text-2xl uppercase">Todavía no tenés clases</h2>
            <p className="mb-8 text-neutral-600">Explorá el catálogo y empezá tu entrenamiento.</p>
            <Link to="/#clases" className={botonAncho}>
              Ver clases disponibles
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};
