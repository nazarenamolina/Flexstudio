import { Search, Plus, Loader2, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import MuxPlayer from '@mux/mux-player-react';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal'; 
import { useAdminVideos } from '../../../hooks/useAdminVideos'; 

export const AdminVideosPage = () => {
 
  const {navigate, cargando, categorias, busqueda, setBusqueda, filtroCategoria, setFiltroCategoria, videosFiltrados, modalAbierto, setModalAbierto, videoAEliminar, estaEliminando, abrirModalEliminacion, ejecutarEliminacion} = useAdminVideos();

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
              <div key={video.id} className="bg-[#131313] rounded-[30px] overflow-hidden border border-gray-800 shadow-sm flex flex-col hover:border-gray-700 transition-colors">
                <div className="w-full aspect-video bg-[#0a0a0a] relative group flex items-center justify-center overflow-hidden">
                  {(video as any).estado === 'PROCESANDO' || !video.playbackId ? (
                    <div className="relative w-full h-[full] flex flex-col items-center justify-center">
                      {video.imagenUrl && (
                        <img src={video.imagenUrl} alt="Fondo" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                      )}
                      <Loader2 className="w-8 h-8 animate-spin text-[#d7f250] relative z-10 mb-2" />
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest relative z-10 shadow-black">Procesando</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-10">
                      <MuxPlayer
                        playbackId={video.playbackId}
                        poster={video.imagenUrl || undefined}
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
                <div className="p-5 flex-1 flex flex-col">
                  {/* Título de la clase */}
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-4">
                    {video.titulo}
                  </h3>

                  {/* Contenedor de botones */}
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