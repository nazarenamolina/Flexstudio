import { AlertTriangle, RotateCw } from 'lucide-react';

interface Props {
  /** Qué no se pudo cargar: "las clases", "los videos"… */
  que: string;
  onReintentar: () => void;
  reintentando?: boolean;
}

/**
 * Falla al cargar una lista del admin. Sin esto la pantalla quedaba vacía y parecía que no había
 * nada cargado (por ejemplo, ninguna clase), lo que invitaba a crear todo de nuevo.
 */
export const ErrorCargaAdmin = ({ que, onReintentar, reintentando = false }: Props) => (
  <div role="alert" className="flex flex-col items-center text-center gap-4 py-16 px-6 rounded-3xl border border-red-500/20 bg-red-500/5">
    <AlertTriangle className="w-10 h-10 text-red-400" aria-hidden="true" />
    <div>
      <p className="text-white font-bold text-lg">No pudimos cargar {que}</p>
      <p className="text-gray-400 text-sm mt-1">Revisá tu conexión o que el servidor esté funcionando, y volvé a intentar.</p>
    </div>
    <button
      type="button"
      onClick={onReintentar}
      disabled={reintentando}
      className="inline-flex items-center gap-2 rounded-full bg-[#d7f250] px-5 py-2.5 text-sm font-black uppercase tracking-widest text-[#131313] transition-colors hover:bg-[#c4dd46] disabled:opacity-60"
    >
      <RotateCw size={16} className={reintentando ? 'animate-spin' : ''} aria-hidden="true" /> Reintentar
    </button>
  </div>
);
