import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { obtenerDetalleClase } from '../api/compras';
import { obtenerProgresoCategoriaRequest, marcarVideoCompletadoRequest, obtenerCredencialesReproduccion, registrarReproduccionRequest } from '../api/videos';
import { type ModuloConEstado } from '../modulos';

export interface VideoClase {
  id: string;
  idModulo: string;
  titulo: string;
  descripcion?: string | null;
  orden: number;
  duracionFormateada?: string | null;
  imagenUrl?: string | null;
}

export interface ClaseDetalle {
  id: string;
  titulo: string;
  descripcionDetallada?: string | null;
  // Vienen ordenados por mes: solo los de los meses con acceso vigente.
  videos?: VideoClase[];
  modulos?: ModuloConEstado[];
}

// Margen para pedir credenciales nuevas antes de que venzan los tokens de Mux.
const MARGEN_RENOVACION_MS = 10 * 60 * 1000;

export const useClaseDetalle = (idCategoria: string | undefined) => {
  const queryClient = useQueryClient();
  // Video elegido por el alumno. Se guarda con la clase: al pasar a otra clase no queda activo un
  // video de la anterior (antes el estado sobrevivía al cambio de ruta).
  const [elegido, setElegido] = useState<{ idCategoria?: string; idVideo: string } | null>(null);
  const reproduccionesRegistradas = useRef(new Set<string>());

  const { data: clase, isLoading: cargandoClase, error: errorClase } = useQuery<ClaseDetalle>({
    queryKey: ['clase', idCategoria],
    queryFn: () => obtenerDetalleClase(idCategoria!),
    enabled: !!idCategoria,
    staleTime: 1000 * 60 * 10,
  });

  const { data: progresoIds = [], isLoading: cargandoProgreso } = useQuery({
    queryKey: ['progreso', idCategoria],
    queryFn: () => obtenerProgresoCategoriaRequest(idCategoria!),
    enabled: !!idCategoria,
  });

  // Activo: el que eligió el alumno en esta clase o, si no eligió, el primero sin completar.
  // El back ya los manda ordenados por mes y, dentro de cada mes, por orden.
  const videosOrdenados = clase?.videos ?? [];
  const videoElegido = elegido?.idCategoria === idCategoria ? videosOrdenados.find(v => v.id === elegido?.idVideo) : undefined;
  const videoActivo: VideoClase | null =
    videoElegido ?? videosOrdenados.find(v => !progresoIds.includes(v.id)) ?? videosOrdenados[0] ?? null;

  // Credenciales firmadas del video activo. Los tokens duran unas horas: se consideran vencidas un
  // rato antes de expirar, así que al volver a la pestaña (o al reintentar) se piden nuevas.
  const credenciales = useQuery({
    queryKey: ['credenciales-video', videoActivo?.id],
    queryFn: () => obtenerCredencialesReproduccion(videoActivo!.id),
    enabled: !!videoActivo?.id,
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: (q) => {
      const expiraEn = q.state.data?.expiraEn;
      return expiraEn ? Math.max(0, expiraEn - Date.now() - MARGEN_RENOVACION_MS) : 60 * 60 * 1000;
    },
  });

  const mutacionCompletar = useMutation({
    mutationFn: (idVideo: string) => marcarVideoCompletadoRequest(idVideo),
    onSuccess: (respuesta, idVideo) => {
      queryClient.setQueryData(['progreso', idCategoria], (old: string[] = []) => (old.includes(idVideo) ? old : [...old, idVideo]));
      // Terminar un mes habilita la compra del siguiente: el detalle y el catálogo tienen que enterarse.
      if (respuesta.moduloTerminado) {
        queryClient.invalidateQueries({ queryKey: ['clase', idCategoria] });
        queryClient.invalidateQueries({ queryKey: ['estados-modulos'] });
        queryClient.invalidateQueries({ queryKey: ['mis-clases'] });
      }
    },
    onError: () => toast.error('No pudimos guardar tu progreso. Se va a reintentar la próxima vez que termines el video.'),
  });

  const cambiarVideoActivo = (video: VideoClase) => {
    setElegido({ idCategoria, idVideo: video.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    clase,
    cargando: cargandoClase || cargandoProgreso,
    error: errorClase,
    videoActivo,
    setVideoActivo: cambiarVideoActivo,
    alEmpezarReproduccion: () => {
      if (!videoActivo) return;
      // Fija el video que se está viendo, para que al completarlo no salte solo al siguiente.
      if (!videoElegido) setElegido({ idCategoria, idVideo: videoActivo.id });
      // Sirve para resolver pedidos de arrepentimiento. Si falla no se avisa: no afecta lo que se está
      // viendo, y se reintenta la próxima vez que empiece a reproducirse.
      if (!reproduccionesRegistradas.current.has(videoActivo.id)) {
        const idVideo = videoActivo.id;
        reproduccionesRegistradas.current.add(idVideo);
        registrarReproduccionRequest(idVideo).catch(() => reproduccionesRegistradas.current.delete(idVideo));
      }
    },
    credencialesSeguras: credenciales.data ?? null,
    cargandoVideo: credenciales.isPending && !!videoActivo?.id,
    errorVideo: credenciales.isError ? credenciales.error : null,
    // Pide credenciales nuevas (botón "Reintentar" o error del reproductor por token vencido).
    renovarCredenciales: () => credenciales.refetch(),
    videosCompletados: new Set(progresoIds),
    marcarCompletado: (idVideo: string) => mutacionCompletar.mutate(idVideo),
  };
};
