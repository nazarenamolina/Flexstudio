import { useEffect, useState } from 'react';
import { CloudUpload, CheckCircle2, AlertTriangle, X, ChevronDown, ChevronUp, WifiOff, Ban } from 'lucide-react';
import { useSubidasStore, hayCargasActivas, type Subida } from '../store/subidasStore';

const ETIQUETA_TIPO: Record<Subida['tipo'], string> = {
  video: 'Video nuevo',
  reemplazo: 'Reemplazo de archivo',
  muestra: 'Video de muestra',
};

const EstadoTexto = ({ subida }: { subida: Subida }) => {
  switch (subida.estado) {
    case 'subiendo':
      return <span className="text-[#d7f250]">{subida.progreso}%</span>;
    case 'pausada':
      return <span className="flex items-center gap-1 text-amber-300"><WifiOff size={12} aria-hidden="true" /> Sin conexión, en pausa</span>;
    case 'completada':
      return <span className="flex items-center gap-1 text-[#d7f250]"><CheckCircle2 size={12} aria-hidden="true" /> Subido, Mux lo procesa</span>;
    case 'error':
      return <span className="flex items-center gap-1 text-red-400"><AlertTriangle size={12} aria-hidden="true" /> Falló la subida</span>;
    case 'cancelada':
      return <span className="flex items-center gap-1 text-gray-400"><Ban size={12} aria-hidden="true" /> Cancelada</span>;
  }
};

/**
 * Subidas a Mux en curso, en una esquina del admin. Permite seguir usando el panel mientras se
 * suben videos grandes, cancelar una subida y, al terminar, cerrar el aviso.
 */
export const PanelSubidas = () => {
  const subidas = useSubidasStore((s) => s.subidas);
  const cancelar = useSubidasStore((s) => s.cancelar);
  const quitar = useSubidasStore((s) => s.quitar);
  const [minimizado, setMinimizado] = useState(false);
  const activas = hayCargasActivas(subidas);

  // Cerrar o recargar la pestaña corta la subida: el navegador pregunta antes.
  useEffect(() => {
    if (!activas) return;
    const avisar = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', avisar);
    return () => window.removeEventListener('beforeunload', avisar);
  }, [activas]);

  if (subidas.length === 0) return null;

  const enCurso = subidas.filter((s) => s.estado === 'subiendo' || s.estado === 'pausada');
  const progresoTotal = enCurso.length
    ? Math.floor(enCurso.reduce((total, s) => total + s.progreso, 0) / enCurso.length)
    : 100;

  return (
    <section
      aria-label="Subidas a Mux"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 rounded-2xl border border-white/10 bg-[#131313]/95 backdrop-blur shadow-2xl text-white overflow-hidden"
    >
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <CloudUpload className={`w-5 h-5 shrink-0 ${activas ? 'text-[#d7f250] animate-pulse' : 'text-gray-400'}`} aria-hidden="true" />
        <p className="flex-1 text-sm font-bold" aria-live="polite">
          {activas
            ? `Subiendo ${enCurso.length} ${enCurso.length === 1 ? 'archivo' : 'archivos'} · ${progresoTotal}%`
            : 'Subidas terminadas'}
        </p>
        <button
          type="button"
          onClick={() => setMinimizado((m) => !m)}
          aria-label={minimizado ? 'Mostrar las subidas' : 'Minimizar las subidas'}
          aria-expanded={!minimizado}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {minimizado ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </header>

      {!minimizado && (
        <ul className="max-h-72 overflow-y-auto divide-y divide-white/5">
          {subidas.map((s) => {
            const enMarcha = s.estado === 'subiendo' || s.estado === 'pausada';
            return (
              <li key={s.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{ETIQUETA_TIPO[s.tipo]}</p>
                    <p className="text-sm font-bold truncate" title={s.titulo}>{s.titulo}</p>
                    <p className="text-xs text-gray-500 truncate" title={s.nombreArchivo}>{s.nombreArchivo}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => (enMarcha ? cancelar(s.id) : quitar(s.id))}
                    aria-label={enMarcha ? `Cancelar la subida de ${s.titulo}` : `Quitar ${s.titulo} de la lista`}
                    title={enMarcha ? 'Cancelar subida' : 'Quitar de la lista'}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div
                  className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={s.progreso}
                  aria-label={`Progreso de ${s.titulo}`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      s.estado === 'error' ? 'bg-red-500' : s.estado === 'cancelada' ? 'bg-gray-600' : s.estado === 'pausada' ? 'bg-amber-300' : 'bg-[#d7f250]'
                    }`}
                    style={{ width: `${s.progreso}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs font-semibold"><EstadoTexto subida={s} /></p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
