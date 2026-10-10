import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { obtenerTodosLosVideosRequest, eliminarVideoRequest, type Video } from '../api/videos';
import { mensajeDeError } from '../api/errores';
import { useCategoriasPublicas } from './useCategoriasPublicas';
import { API_URL } from '../config';

const SOCKET_URL = API_URL;

/** Clave de la lista de videos del admin: la usan también el alta y la edición para refrescarla. */
export const CLAVE_VIDEOS_ADMIN = ['videos-admin'] as const;

export const useAdminVideos = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estados locales para la UI
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos los Videos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [videoAEliminar, setVideoAEliminar] = useState<{ id: string, titulo: string } | null>(null);

  const { data: videos = [], isLoading: cargandoVideos, isLoadingError: errorVideos, refetch: reintentarVideos, isFetching: buscandoVideos } = useQuery<Video[]>({
    queryKey: CLAVE_VIDEOS_ADMIN,
    queryFn: obtenerTodosLosVideosRequest,
  });
  const { data: categorias = [], isLoading: cargandoCategorias } = useCategoriasPublicas();

  const cargando = cargandoVideos || cargandoCategorias;

  // Mux avisa por el back cuando termina (o falla) el procesamiento de un video.
  useEffect(() => {
    // withCredentials: manda la cookie de sesión; el back solo acepta administradores.
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on('videoActualizado', (videoActualizado: Video) => {
      const lista = queryClient.getQueryData<Video[]>(CLAVE_VIDEOS_ADMIN);
      if (lista?.some((v) => v.id === videoActualizado.id)) {
        queryClient.setQueryData<Video[]>(CLAVE_VIDEOS_ADMIN, (anteriores = []) =>
          anteriores.map((v) => (v.id === videoActualizado.id ? { ...v, ...videoActualizado } : v)),
        );
      } else {
        // Video que esta pantalla todavía no tenía (subido desde otra pestaña): se pide la lista.
        queryClient.invalidateQueries({ queryKey: CLAVE_VIDEOS_ADMIN });
      }
      // Cantidad de videos y duración de cada clase (tarjetas de la home).
      queryClient.invalidateQueries({ queryKey: ['categorias'] });

      if (videoActualizado.estado === 'ERROR') {
        toast.error(`Mux no pudo procesar el video "${videoActualizado.titulo}". Borralo y volvé a subirlo.`, { duration: 8000 });
      } else if (videoActualizado.estado === 'LISTO') {
        toast.success(`¡El video "${videoActualizado.titulo}" ya está listo!`);
      }
    });

    socket.on('reemplazoFallido', (video: { id: string; titulo: string }) => {
      toast.error(`Mux no pudo procesar el archivo nuevo de "${video.titulo}". El video sigue con el archivo anterior.`, { duration: 8000 });
    });

    return () => { socket.disconnect(); };
  }, [queryClient]);

  // Eliminar con actualización optimista: desaparece al instante y vuelve si el back falla.
  const eliminarMutation = useMutation({
    mutationFn: eliminarVideoRequest,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: CLAVE_VIDEOS_ADMIN });
      const previousVideos = queryClient.getQueryData<Video[]>(CLAVE_VIDEOS_ADMIN);
      queryClient.setQueryData<Video[]>(CLAVE_VIDEOS_ADMIN, (old = []) => old.filter((v) => v.id !== id));
      return { previousVideos };
    },
    onSuccess: () => {
      toast.success('Video eliminado permanentemente');
    },
    onError: (error, _id, context) => {
      queryClient.setQueryData(CLAVE_VIDEOS_ADMIN, context?.previousVideos);
      toast.error(mensajeDeError(error, 'No se pudo eliminar el video.'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CLAVE_VIDEOS_ADMIN });
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      setTimeout(() => setVideoAEliminar(null), 300);
    },
  });

  const abrirModalEliminacion = (id: string, titulo: string) => {
    setVideoAEliminar({ id, titulo });
    setModalAbierto(true);
  };

  const ejecutarEliminacion = () => {
    if (!videoAEliminar) return;
    setModalAbierto(false); // Cerramos el modal instantáneamente
    eliminarMutation.mutate(videoAEliminar.id);
  };

  const videosFiltrados = useMemo(() => {
    return videos.filter(video => {
      const coincideBusqueda = video.titulo.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = filtroCategoria === 'Todos los Videos' || video.categoria?.titulo === filtroCategoria;
      return coincideBusqueda && coincideCategoria;
    });
  }, [videos, busqueda, filtroCategoria]);

  return {
    navigate,
    cargando,
    errorVideos,
    reintentarVideos,
    buscandoVideos,
    categorias,
    busqueda,
    setBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    videosFiltrados,
    modalAbierto,
    setModalAbierto,
    videoAEliminar,
    estaEliminando: eliminarMutation.isPending,
    abrirModalEliminacion,
    ejecutarEliminacion
  };
};
