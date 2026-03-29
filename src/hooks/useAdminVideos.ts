import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { obtenerTodosLosVideosRequest, eliminarVideoRequest, type Video } from '../api/videos'; // Ajusta la ruta si es necesario
import { obtenerCategoriasRequest, type Categoria } from '../api/categoria'; // Ajusta la ruta si es necesario

const SOCKET_URL = 'http://localhost:3000';

export const useAdminVideos = () => {
  const navigate = useNavigate();
 
  const [videos, setVideos] = useState<Video[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
 
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos los Videos');
 
  const [modalAbierto, setModalAbierto] = useState(false);
  const [videoAEliminar, setVideoAEliminar] = useState<{ id: string, titulo: string } | null>(null);
  const [estaEliminando, setEstaEliminando] = useState(false);
 
  const cargarDatos = async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const resVideos = await obtenerTodosLosVideosRequest();
      setVideos(Array.isArray(resVideos) ? resVideos : (resVideos as any).data || []);
      const resCategorias = await obtenerCategoriasRequest();
      setCategorias(Array.isArray(resCategorias) ? resCategorias : (resCategorias as any).categorias || []);
    } catch (error) {
      if (!silencioso) toast.error("Error al cargar la librería de videos");
    } finally {
      if (!silencioso) setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);
 
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('videoActualizado', (videoActualizado: Video) => {
      setVideos((videosActuales) =>
        videosActuales.map((v) => v.id === videoActualizado.id ? { ...v, ...videoActualizado } : v)
      );
      toast.success(`¡El video "${videoActualizado.titulo}" ya está listo!`);
    });
    return () => { socket.disconnect(); };
  }, []);
 
  const abrirModalEliminacion = (id: string, titulo: string) => {
    setVideoAEliminar({ id, titulo });
    setModalAbierto(true);
  };

  const ejecutarEliminacion = async () => {
    if (!videoAEliminar) return;

    setEstaEliminando(true);
    try {
      await eliminarVideoRequest(videoAEliminar.id);
      setVideos(videos.filter(v => v.id !== videoAEliminar.id));
      toast.success('Video eliminado permanentemente');
      setModalAbierto(false);  
    } catch (error) {
      toast.error('Ocurrió un error al eliminar el video');
    } finally {
      setEstaEliminando(false);
      setTimeout(() => setVideoAEliminar(null), 300); 
    }
  };

 
  const videosFiltrados = videos.filter(video => {
    const coincideBusqueda = video.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === 'Todos los Videos' || video.categoria?.titulo === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

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
    estaEliminando,
    abrirModalEliminacion,
    ejecutarEliminacion
  };
};