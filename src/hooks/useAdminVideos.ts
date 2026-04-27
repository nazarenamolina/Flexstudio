import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { obtenerTodosLosVideosRequest, eliminarVideoRequest, type Video } from '../api/videos'; 
import { obtenerCategoriasRequest, type Categoria } from '../api/categoria'; 

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAdminVideos = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estados locales para la UI
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos los Videos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [videoAEliminar, setVideoAEliminar] = useState<{ id: string, titulo: string } | null>(null);

  // 👇 1. QUERIES: Descargamos Videos y Categorías en paralelo
  const { data: videos = [], isLoading: cargandoVideos } = useQuery<Video[]>({
    queryKey: ['videos-admin'],
    queryFn: obtenerTodosLosVideosRequest,
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

  const { data: categorias = [], isLoading: cargandoCategorias } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: async () => {
      const data = await obtenerCategoriasRequest();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray((data as any).categorias)) return (data as any).categorias;
      return [];
    },
    staleTime: 1000 * 60 * 60, // 1 hora de caché (las categorías casi no cambian)
  });

  const cargando = cargandoVideos || cargandoCategorias;

  // 👇 2. WEBSOCKET + TANSTACK QUERY
  useEffect(() => {
    const socket = io(SOCKET_URL);
    
    socket.on('videoActualizado', (videoActualizado: Video) => {
      // Modificamos el caché directamente cuando el websocket avisa
      queryClient.setQueryData<Video[]>(['videos-admin'], (videosAntiguos) => {
        if (!videosAntiguos) return [];
        return videosAntiguos.map((v) => 
          v.id === videoActualizado.id ? { ...v, ...videoActualizado } : v
        );
      });
      toast.success(`¡El video "${videoActualizado.titulo}" ya está listo!`);
    });

    return () => { socket.disconnect(); };
  }, [queryClient]);

  // 👇 3. MUTACIÓN: Eliminar Video con Actualización Optimista
  const eliminarMutation = useMutation({
    mutationFn: eliminarVideoRequest,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['videos-admin'] });
      const previousVideos = queryClient.getQueryData(['videos-admin']);
      
      // Borramos de la pantalla al instante
      queryClient.setQueryData<Video[]>(['videos-admin'], (old = []) =>
        old.filter((v) => v.id !== id)
      );
      
      return { previousVideos };
    },
    onSuccess: () => {
      toast.success('Video eliminado permanentemente');
      queryClient.invalidateQueries({ queryKey: ['videos-admin'] });
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(['videos-admin'], context?.previousVideos);
      toast.error('Ocurrió un error al eliminar el video');
    },
    onSettled: () => {
      setTimeout(() => setVideoAEliminar(null), 300); 
    }
  });

  // Funciones de la Interfaz
  const abrirModalEliminacion = (id: string, titulo: string) => {
    setVideoAEliminar({ id, titulo });
    setModalAbierto(true);
  };

  const ejecutarEliminacion = () => {
    if (!videoAEliminar) return;
    setModalAbierto(false); // Cerramos el modal instantáneamente
    eliminarMutation.mutate(videoAEliminar.id); // Lanzamos la mutación optimista
  };

  // 👇 4. FILTROS (Memoizados)
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