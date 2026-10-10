import { create } from 'zustand';
import * as UpChunk from '@mux/upchunk';
import toast from 'react-hot-toast';

/**
 * Subidas a Mux en segundo plano. El formulario pide la URL al back, registra la subida acá y
 * vuelve a la lista: el archivo se sigue subiendo mientras el admin usa el resto del panel, y el
 * progreso se ve en el panel flotante (PanelSubidas). Solo se corta si se cierra la pestaña.
 */
export type TipoSubida = 'video' | 'reemplazo' | 'muestra';
export type EstadoSubida = 'subiendo' | 'pausada' | 'completada' | 'error' | 'cancelada';

export interface Subida {
  id: string;
  tipo: TipoSubida;
  titulo: string;
  nombreArchivo: string;
  progreso: number;
  estado: EstadoSubida;
  /** Id del video en el back (subidas de video nuevo o de reemplazo). */
  idVideo?: string;
}

interface NuevaSubida {
  tipo: TipoSubida;
  titulo: string;
  archivo: File;
  endpoint: string;
  idVideo?: string;
  /** Al terminar de subir (Mux todavía procesa el archivo): refrescar listas, etc. */
  alCompletar?: () => void;
  /** Si falla o se cancela: por ejemplo, borrar el video nuevo que quedó sin archivo. */
  alFallar?: (motivo: 'error' | 'cancelada') => void;
}

interface SubidasState {
  subidas: Subida[];
  iniciar: (datos: NuevaSubida) => string;
  cancelar: (id: string) => void;
  quitar: (id: string) => void;
}

// Las instancias de UpChunk no van en el estado (no son serializables ni hace falta re-renderizar).
const cargas = new Map<string, { upload: UpChunk.UpChunk; alFallar?: NuevaSubida['alFallar'] }>();

// Trozos de 30 MB (en KB, como pide UpChunk; es su valor por defecto): menos pedidos a Mux que con 5 MB.
// Cada trozo se reintenta solo si falla la conexión.
const TAMANO_TROZO_KB = 30720;

const TEXTO_TIPO: Record<TipoSubida, string> = {
  video: 'El video',
  reemplazo: 'El archivo nuevo de',
  muestra: 'El video de muestra de',
};

export const useSubidasStore = create<SubidasState>((set, get) => {
  const actualizar = (id: string, cambios: Partial<Subida>) =>
    set((s) => ({ subidas: s.subidas.map((x) => (x.id === id ? { ...x, ...cambios } : x)) }));

  return {
    subidas: [],

    iniciar: ({ tipo, titulo, archivo, endpoint, idVideo, alCompletar, alFallar }) => {
      const id = crypto.randomUUID();
      set((s) => ({
        subidas: [...s.subidas, { id, tipo, titulo, nombreArchivo: archivo.name, progreso: 0, estado: 'subiendo', idVideo }],
      }));

      const upload = UpChunk.createUpload({ endpoint, file: archivo, chunkSize: TAMANO_TROZO_KB });
      cargas.set(id, { upload, alFallar });

      // UpChunk avisa decenas de veces por segundo: solo se actualiza el estado cuando cambia el porcentaje entero.
      let ultimoProgreso = 0;
      upload.on('progress', (e) => {
        const progreso = Math.floor(e.detail);
        if (progreso === ultimoProgreso) return;
        ultimoProgreso = progreso;
        actualizar(id, { progreso });
      });
      upload.on('offline', () => actualizar(id, { estado: 'pausada' }));
      upload.on('online', () => actualizar(id, { estado: 'subiendo' }));
      upload.on('success', () => {
        cargas.delete(id);
        actualizar(id, { progreso: 100, estado: 'completada' });
        toast.success(`${TEXTO_TIPO[tipo]} "${titulo}" se subió. Mux lo está procesando: en unos minutos queda listo.`, { duration: 6000 });
        alCompletar?.();
      });
      upload.on('error', () => {
        // UpChunk ya reintentó cada trozo antes de rendirse.
        cargas.delete(id);
        actualizar(id, { estado: 'error' });
        toast.error(`No se pudo subir "${titulo}". Revisá la conexión y volvé a intentarlo.`, { duration: 8000 });
        alFallar?.('error');
      });
      return id;
    },

    cancelar: (id) => {
      const carga = cargas.get(id);
      if (!carga) return;
      carga.upload.abort();
      cargas.delete(id);
      actualizar(id, { estado: 'cancelada' });
      carga.alFallar?.('cancelada');
    },

    quitar: (id) => {
      get().cancelar(id);
      set((s) => ({ subidas: s.subidas.filter((x) => x.id !== id) }));
    },
  };
});

export const hayCargasActivas = (subidas: Subida[]) =>
  subidas.some((s) => s.estado === 'subiendo' || s.estado === 'pausada');
