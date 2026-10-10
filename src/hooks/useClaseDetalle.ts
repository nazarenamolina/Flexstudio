import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { obtenerDetalleClase } from '../api/compras';
import { obtenerProgresoCategoriaRequest, marcarVideoCompletadoRequest, obtenerCredencialesReproduccion } from '../api/videos';

export interface VideoClase {
  id: string;
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
  videos?: VideoClase[];
}

// Margen para pedir credenciales nuevas antes de que venzan los tokens de Mux.
const MARGEN_RENOVACION_MS = 10 * 60 * 1000;

export const useClaseDetalle = (idCategoria: string | undefined) => {
  const queryClient = useQueryClient();
  // Video elegido por el alumno. Se guarda con la clase: al pasar a otra clase no queda activo un
  // video de la anterior (antes el estado sobrevivía al cambio de ruta).
  const [elegido, setElegido] = useState<{ idCategoria?: string; idVideo: string } | null>(null);

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
  const videosOrdenados = [...(clase?.videos ?? [])].sort((a, b) => a.orden - b.orden);
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
    onSuccess: (_, idVideo) => {
      queryClient.setQueryData(['progreso', idCategoria], (old: string[] = []) => (old.includes(idVideo) ? old : [...old, idVideo]));
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
    // Fija el video que se está viendo, para que al completarlo no salte solo al siguiente.
    fijarVideoActivo: () => { if (videoActivo && !videoElegido) setElegido({ idCategoria, idVideo: videoActivo.id }); },
    credencialesSeguras: credenciales.data ?? null,
    cargandoVideo: credenciales.isPending && !!videoActivo?.id,
    errorVideo: credenciales.isError ? credenciales.error : null,
    // Pide credenciales nuevas (botón "Reintentar" o error del reproductor por token vencido).
    renovarCredenciales: () => credenciales.refetch(),
    videosCompletados: new Set(progresoIds),
    marcarCompletado: (idVideo: string) => mutacionCompletar.mutate(idVideo),
  };
};
