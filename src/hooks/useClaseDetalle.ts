import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obtenerDetalleClase } from '../api/compras';
import {obtenerProgresoCategoriaRequest, marcarVideoCompletadoRequest, obtenerCredencialesReproduccion} from '../api/videos';

export const useClaseDetalle = (idCategoria: string | undefined) => {
  const queryClient = useQueryClient();
  const [videoActivo, setVideoActivoInternal] = useState<any>(null);
  const [credencialesSeguras, setCredencialesSeguras] = useState<{ playbackId: string, token: string } | null>(null);
  const [cargandoVideo, setCargandoVideo] = useState(false);
  const { data: clase, isLoading: cargandoClase, error: errorClase } = useQuery({
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

  useEffect(() => {
    if (clase?.videos && clase.videos.length > 0 && !videoActivo) {
      const videosOrdenados = [...clase.videos].sort((a, b) => a.orden - b.orden);
      const proximoVideo = videosOrdenados.find(v => !progresoIds.includes(v.id)) || videosOrdenados[0];
      
      setVideoActivoInternal(proximoVideo);
    }
  }, [clase, progresoIds, videoActivo]);
 
  useEffect(() => {
    const solicitarLlaves = async () => {
      if (!videoActivo?.id) return;
      setCargandoVideo(true);
      setCredencialesSeguras(null);
      try {
        const credenciales = await obtenerCredencialesReproduccion(videoActivo.id);
        setCredencialesSeguras(credenciales);
      } catch (err) {
        console.error("Error al obtener llaves de Mux:", err);
      } finally {
        setCargandoVideo(false);
      }
    };
    solicitarLlaves();
  }, [videoActivo?.id]);
 
  const mutacionCompletar = useMutation({
    mutationFn: (idVideo: string) => marcarVideoCompletadoRequest(idVideo),
    onSuccess: (_, idVideo) => {
      queryClient.setQueryData(['progreso', idCategoria], (old: string[] = []) => [...old, idVideo]);
    }
  });

  const cambiarVideoActivo = (video: any) => {
    setVideoActivoInternal(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    clase,
    cargando: cargandoClase || cargandoProgreso,
    error: errorClase ? 'Error al cargar la clase' : null,
    videoActivo,
    setVideoActivo: cambiarVideoActivo,
    credencialesSeguras,
    cargandoVideo,
 
    videosCompletados: new Set(progresoIds),
    marcarCompletado: (idVideo: string) => mutacionCompletar.mutate(idVideo)
  };
};