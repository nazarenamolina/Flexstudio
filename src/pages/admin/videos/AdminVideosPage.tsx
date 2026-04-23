import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Agregamos "Play" a las importaciones 👇
import { Search, Plus, Loader2, Edit2, Trash2, Image as ImageIcon, Play } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';

import { obtenerTodosLosVideosRequest, eliminarVideoRequest, type Video } from '../../../api/videos';
import { obtenerCategoriasRequest, type Categoria } from '../../../api/categoria';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal'; 

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AdminVideosPage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos los Videos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [videoAEliminar, setVideoAEliminar] = useState<{ id: string, titulo: string } | null>(null);
  const [estaEliminando, setEstaEliminando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const resVideos = await obtenerTodosLosVideosRequest();
      setVideos(resVideos);
      const resCategorias = await obtenerCategoriasRequest();
      setCategorias(resCategorias);
    } catch (error) {
      if (!silencioso) toast.error("Error al cargar la librería de videos");
    } finally {
      if (!silencioso) setCargando(false);
    }
  };

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

  return (
    <div className="w-full h-full flex flex-col font-sans overflow-hidden relative">
      <Toaster position="top-right" />

      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1 tracking-tight">Librería de Videos</h1>
          <p className="text-gray-400 text-sm md:text-base">Gestiona, organiza y publica el contenido de tus clases.</p>
        </div>
        <button
          onClick={() => navigate('/admin/videos/nuevo')}
          className="bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-transform duration-200 hover:scale-105 shadow-lg whitespace-nowrap"
        >
          <Plus size={20} /> Subir Nuevo Video
        </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col xl:flex-row gap-4 mb-8 shrink-0">
        <div className="relative w-full xl:w-80 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar videos por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] rounded-full pl-12 pr-4 py-3 text-white outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 custom-scrollbar flex-1">
          {['Todos los Videos', ...categorias.map(c => c.titulo)].map(cat => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-5 py-2.5 rounded-full border text-sm font-bold whitespace-nowrap transition-all duration-200 ${filtroCategoria === cat
                ? 'bg-[#d7f250] border-[#d7f250] text-[#131313] shadow-md'
                : 'bg-[#131313] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRILLA DE VIDEOS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {cargando ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-[#d7f250]">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-bold animate-pulse">Cargando librería...</p>
          </div>
        ) : videosFiltrados.length === 0 ? (
          <div className="w-full py-20 text-center border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-gray-700 mb-3" />
            <p className="text-gray-500 font-medium text-lg">No hay videos para mostrar.</p>
            <p className="text-gray-600 text-sm mt-1">Intenta cambiar los filtros o sube uno nuevo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videosFiltrados.map(video => (
              <div key={video.id} className="bg-[#131313] rounded-[30px] overflow-hidden border border-gray-800 shadow-sm flex flex-col hover:border-gray-700 transition-colors group">
                
                {/* 👇 SECCIÓN DEL REPRODUCTOR / MINIATURA MODIFICADA 👇 */}
                <div className="w-full aspect-video bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden">
                  
                  {/* ESTADO: PROCESANDO */}
                  {(video as any).estado === 'PROCESANDO' || !video.playbackId ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      {video.imagenUrl && (
                        <img src={video.imagenUrl} alt="Fondo" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                      )}
                      <Loader2 className="w-8 h-8 animate-spin text-[#d7f250] relative z-10 mb-2" />
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] relative z-10">Procesando</p>
                    </div>
                  ) : (
                    /* ESTADO: LISTO (Mostramos imagen + Badge en lugar de MuxPlayer) */
                    <div className="absolute inset-0 w-full h-full">
                      {video.imagenUrl ? (
                        <img 
                          src={video.imagenUrl} 
                          alt={video.titulo} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700">
                           <ImageIcon size={40} />
                        </div>
                      )}
                      
                      {/* Overlay decorativo de Play al hacer hover */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-[#d7f250] p-3 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                           <Play size={20} className="text-black fill-black ml-0.5" />
                        </div>
                      </div>

                      {/* BADGE DE DURACIÓN (Estilo Youtube) */}
                      {video.duracionFormateada && (
                        <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-20">
                          {video.duracionFormateada}
                        </span>
                      )}
                    </div>
                  )}

                  {/* BADGE DE CATEGORÍA */}
                  <span className="absolute top-3 left-3 z-20 bg-[#d7f250] text-[#131313] text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-md pointer-events-none">
                    {video.categoria?.titulo || 'Sin categoría'}
                  </span>
                </div>
                {/* 👆 FIN DE SECCIÓN MODIFICADA 👆 */}

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-4">
                    {video.titulo}
                  </h3>

                  <div className="mt-auto flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/admin/videos/editar/${video.id}`)}
                      className="flex-1 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 text-sm shadow-md"
                    >
                      <Edit2 size={18} /> Editar
                    </button>

                    <button
                      onClick={() => abrirModalEliminacion(video.id, video.titulo)}
                      className="p-2.5 bg-[#1a1a1a] hover:bg-red-500 text-gray-400 hover:text-white border border-gray-700 hover:border-red-500 rounded-xl transition-all duration-200 hover:-translate-y-1 shadow-md"
                      title="Eliminar Video"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmarEliminarModal
        isOpen={modalAbierto}
        onClose={() => !estaEliminando && setModalAbierto(false)}
        onConfirm={ejecutarEliminacion}
        tituloItem={videoAEliminar?.titulo || ''}
        estaEliminando={estaEliminando}
      />
    </div>
  );
};