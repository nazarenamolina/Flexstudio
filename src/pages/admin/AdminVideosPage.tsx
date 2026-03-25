import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Search, CloudUpload, MoreVertical, X, Loader2, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import MuxPlayer from '@mux/mux-player-react';
import * as UpChunk from '@mux/upchunk'; // 👈 Importamos la magia de Mux

import { obtenerTodosLosVideosRequest, solicitarUrlSubidaRequest, type Video } from '../../api/videos';
import { obtenerCategoriasRequest, type Categoria } from '../../api/categoria';

export const AdminVideosPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos los Videos');
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'PIDIENDO_URL' | 'SUBIENDO' | 'PROCESANDO_MUX'>('IDLE');
  const [progreso, setProgreso] = useState(0);
  
  const [nuevoVideo, setNuevoVideo] = useState({
    titulo: '',
    idCategoria: '',
    duracion: '',
    orden: '',
    archivo: null as File | null
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const resVideos = await obtenerTodosLosVideosRequest();
      setVideos(Array.isArray(resVideos) ? resVideos : (resVideos as any).data || []);
      const resCategorias = await obtenerCategoriasRequest();
      setCategorias(Array.isArray(resCategorias) ? resCategorias : (resCategorias as any).categorias || []);
    } catch (error) {
      toast.error("Error al cargar la librería");
    } finally {
      setCargando(false);
    }
  };

  const handleArchivoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNuevoVideo({ ...nuevoVideo, archivo: e.target.files[0] });
    }
  };

  const handleCerrarModal = () => {
    if (estadoSubida === 'SUBIENDO') return;  
    setModalAbierto(false);
    setEstadoSubida('IDLE');
    setProgreso(0);
    setNuevoVideo({ titulo: '', idCategoria: '', duracion: '', orden: '', archivo: null });
  };

 
  const handleSubirVideo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nuevoVideo.archivo || !nuevoVideo.titulo || !nuevoVideo.idCategoria) return;

    try {
      // 1. Pedir permiso al Backend (Etapa 1)
      setEstadoSubida('PIDIENDO_URL');
      const datosParaBackend = {
        titulo: nuevoVideo.titulo,
        idCategoria: nuevoVideo.idCategoria,
        duracion: parseInt(nuevoVideo.duracion) || 0,
        orden: parseInt(nuevoVideo.orden) || 1,
      };

      const { uploadUrl } = await solicitarUrlSubidaRequest(datosParaBackend);
 
      setEstadoSubida('SUBIENDO');
      const upload = UpChunk.createUpload({
        endpoint: uploadUrl,
        file: nuevoVideo.archivo,
        chunkSize: 5120, 
      });

      // Escuchamos el progreso
      upload.on('progress', (progressEvent) => {
        setProgreso(Math.floor(progressEvent.detail));
      });

      // ¡Se subió con éxito!
      upload.on('success', () => {
        setEstadoSubida('PROCESANDO_MUX');
        setProgreso(100);
        toast.success('¡Video subido! Mux lo está procesando.');
        
        // Refrescamos los datos para que aparezca en estado "PROCESANDO"
        cargarDatos(); 
        
        // Cerramos el modal después de 3 segundos
        setTimeout(() => {
          handleCerrarModal();
        }, 3000);
      });

      // Si hay error en la subida
      upload.on('error', (err) => {
        console.error('Error en Upchunk:', err);
        toast.error('La conexión falló. Reintentando...');
        // Opcional: UpChunk reintenta solo por defecto, pero podrías pausar/cancelar aquí
      });

    } catch (error: any) {
      toast.error('Error al contactar con el servidor');
      setEstadoSubida('IDLE');
    }
  };

  const videosFiltrados = videos.filter(video => {
    const coincideBusqueda = video.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === 'Todos los Videos' || video.categoria?.titulo === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-all";
  const labelClass = "block text-sm font-bold text-gray-400 mb-2";

  return (
    <div className="w-full h-full flex flex-col font-sans overflow-hidden">
      <Toaster position="top-right" />

      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1 tracking-tight">Librería de Videos</h1>
          <p className="text-gray-400 text-sm md:text-base">Gestiona, organiza y publica el contenido de tus clases.</p>
        </div>
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-transform duration-200 hover:scale-105 shadow-lg whitespace-nowrap"
        >
          <CloudUpload size={20} /> Subir Nuevo Video
        </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col xl:flex-row gap-4 mb-8 shrink-0">
        <div className="relative w-full xl:w-80 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar videos..."
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
              className={`px-5 py-2.5 rounded-full border text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                filtroCategoria === cat 
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
          <div className="w-full py-20 text-center border-2 border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500 font-medium">No se encontraron videos con esos filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videosFiltrados.map(video => (
              <div key={video.id} className="bg-[#131313] rounded-[20px] overflow-hidden border border-gray-800 shadow-sm flex flex-col">
                
                {/* REPRODUCTOR O ESTADO DE PROCESAMIENTO */}
                <div className="w-full aspect-video bg-[#0a0a0a] relative group flex items-center justify-center">
                  
                  {/* SI EL VIDEO AÚN ESTÁ PROCESANDO */}
                  {(video as any).estado === 'PROCESANDO' || !video.playbackId ? (
                    <div className="text-center p-4">
                      <Loader2 className="w-8 h-8 animate-spin text-[#d7f250] mx-auto mb-2" />
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Procesando en Mux</p>
                      <p className="text-[10px] text-gray-500 mt-1">Estará listo en unos minutos</p>
                    </div>
                  ) : (
                    /* SI EL VIDEO ESTÁ LISTO */
                    <div className="absolute inset-0 z-10">
                      <MuxPlayer
                        playbackId={video.playbackId}
                        metadataVideoTitle={video.titulo}
                        primaryColor="#D4F85E"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  )}
                  
                  <span className="absolute top-3 left-3 z-20 bg-[#d7f250] text-[#131313] text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-md pointer-events-none">
                    {video.categoria?.titulo || 'Sin categoría'}
                  </span>
                </div>

                {/* INFO DEL VIDEO */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{video.titulo}</h3>
                    <button className="text-gray-500 hover:text-white transition-colors mt-1 shrink-0">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">Clase número {video.orden} del programa.</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE SUBIDA */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-gray-800 w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#131313]">
              <h2 className="text-2xl font-black text-white tracking-tight">Subir Nuevo Video</h2>
              <button 
                onClick={handleCerrarModal} 
                disabled={estadoSubida === 'SUBIENDO'}
                className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors bg-gray-800/50 hover:bg-gray-800 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* SI ESTAMOS SUBIENDO, MOSTRAMOS LA BARRA DE PROGRESO */}
            {estadoSubida === 'SUBIENDO' || estadoSubida === 'PROCESANDO_MUX' ? (
              <div className="p-10 flex flex-col items-center justify-center space-y-6">
                
                {estadoSubida === 'SUBIENDO' ? (
                  <CloudUpload className="w-16 h-16 text-[#d7f250] animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-16 h-16 text-[#d7f250]" />
                )}

                <div className="text-center w-full">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {estadoSubida === 'SUBIENDO' ? 'Subiendo video de forma segura...' : '¡Subida completada!'}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {estadoSubida === 'SUBIENDO' 
                      ? 'Por favor, no cierres esta ventana hasta que termine.' 
                      : 'Mux está procesando el video para distintas resoluciones. Puedes cerrar esto, aparecerá en tu galería en breve.'}
                  </p>

                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-800 rounded-full h-4 mb-2 overflow-hidden">
                    <div 
                      className="bg-[#d7f250] h-4 rounded-full transition-all duration-300 ease-out" 
                      style={{ width: `${progreso}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-[#d7f250] font-black">{progreso}%</p>
                </div>

              </div>
            ) : (

              /* FORMULARIO NORMAL */
              <form onSubmit={handleSubirVideo} className="p-6 md:p-8 space-y-6">
                <div>
                  <label className={labelClass}>Título de la Clase *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Yoga Avanzado - Clase 1"
                    value={nuevoVideo.titulo}
                    onChange={e => setNuevoVideo({ ...nuevoVideo, titulo: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Categoría / Disciplina *</label>
                  <select
                    required
                    value={nuevoVideo.idCategoria}
                    onChange={e => setNuevoVideo({ ...nuevoVideo, idCategoria: e.target.value })}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>Selecciona una categoría...</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.titulo}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Duración (minutos)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Ej: 45"
                      value={nuevoVideo.duracion}
                      onChange={e => setNuevoVideo({ ...nuevoVideo, duracion: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>N° de Orden en la lista</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ej: 1"
                      value={nuevoVideo.orden}
                      onChange={e => setNuevoVideo({ ...nuevoVideo, orden: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Archivo de Video (.mp4, .mov) *</label>
                  <div className="relative w-full border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl p-8 text-center transition-colors bg-[#131313]/50 cursor-pointer">
                    <input
                      type="file"
                      accept="video/mp4,video/x-m4v,video/*"
                      required
                      onChange={handleArchivoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <CloudUpload className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-white">
                      {nuevoVideo.archivo ? (
                        <span className="text-[#d7f250]">{nuevoVideo.archivo.name}</span>
                      ) : (
                        "Haz clic o arrastra un video aquí"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={handleCerrarModal}
                    className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={estadoSubida === 'PIDIENDO_URL'}
                    className="bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] px-8 py-3 rounded-xl font-bold transition-all hover:-translate-y-1 shadow-lg disabled:opacity-70 flex items-center gap-2"
                  >
                    {estadoSubida === 'PIDIENDO_URL' ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Conectando...</>
                    ) : (
                      'Subir Video'
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};