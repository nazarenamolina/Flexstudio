import { useState } from 'react';
import { Search, Loader2, LayoutGrid, List, PlaySquare, ChevronDown, Filter, Plus, Video } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal';
import { useAdminVideos } from '../../../hooks/useAdminVideos';
import { VideoCard } from '../../../components/VideoCard';
import { AddVideoCard } from '../../../components/AddVideoCard';

export const AdminVideosPage = () => {
  const { navigate, cargando, categorias, busqueda, setBusqueda, filtroCategoria, setFiltroCategoria, videosFiltrados, modalAbierto, setModalAbierto, videoAEliminar, estaEliminando, abrirModalEliminacion, ejecutarEliminacion } = useAdminVideos();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 overflow-hidden font-sans relative">
      {/* CABECERA Y SWITCHER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 tracking-tighter font-principal">
            <PlaySquare className="text-[#d7f250] w-8 h-8 md:w-12 md:h-12 shrink-0" />
            <span className="leading-none mt-1">Librería de videos</span>
          </h1>
        </div>

        {/* SWITCHER */}
        <div className="flex bg-zinc-900/80 p-1 rounded-full border border-white/5 blur-s shadow-2xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 px-4 rounded-full transition-all duration-300 flex items-center gap-2 ${viewMode === 'grid' ? 'bg-[#d7f250] text-[#131313] shadow-lg scale-95' : 'text-gray-500 hover:text-white'}`}
          >
            <LayoutGrid size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Galeria</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 px-4 rounded-full transition-all duration-300 flex items-center gap-2 ${viewMode === 'list' ? 'bg-[#d7f250] text-[#131313] shadow-lg scale-95' : 'text-gray-500 hover:text-white'}`}
          >
            <List size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Lista</span>
          </button>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col xl:flex-row gap-4 mb-10 items-start xl:items-center">
        <div className="relative w-full xl:w-80 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#131313] border border-white/10 focus:border-[#d7f250] rounded-full pl-11 pr-4 py-3 text-white text-sm outline-none transition-all shadow-sm focus:shadow-[0_0_15px_rgba(215,242,80,0.15)]"
          />
        </div>

        {/* DROPDOWN DE CATEGORÍAS */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-[11px] uppercase tracking-widest font-black transition-all duration-300 bg-[#131313] border-white/5 text-gray-400 hover:border-white/20 hover:text-white">
            <Filter size={14} />
            <span className="hidden sm:inline">{filtroCategoria === 'Todos los Videos' ? 'Todas las Categorías' : filtroCategoria.split('|')[1]?.trim() || filtroCategoria}</span>
            <span className="sm:hidden">Categoría</span>
            <ChevronDown size={14} className="transition-transform ui-open:rotate-180" />
          </Menu.Button>

          <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-xl bg-[#1a1a1a] border border-white/10 shadow-xl overflow-hidden z-50 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setFiltroCategoria('Todos los Videos')}
                  className={`w-full px-4 py-3 text-left text-xs uppercase tracking-widest font-black transition-colors flex items-center gap-2 ${active ? 'bg-[#d7f250] text-[#131313]' : filtroCategoria === 'Todos los Videos' ? 'bg-white/5 text-[#d7f250]' : 'text-gray-400'
                    }`}
                >
                  Todas las Categorías
                  {filtroCategoria === 'Todos los Videos' && <span className="ml-auto">✓</span>}
                </button>
              )}
            </Menu.Item>
            {categorias.map(cat => {
              const tituloCorto = cat.titulo.includes('|') ? cat.titulo.split('|')[1].trim() : cat.titulo;
              return (
                <Menu.Item key={cat.id}>
                  {({ active }) => (
                    <button
                      onClick={() => setFiltroCategoria(cat.titulo)}
                      className={`w-full px-4 py-3 text-left text-xs uppercase tracking-widest font-black transition-colors flex items-center gap-2 ${active ? 'bg-[#d7f250] text-[#131313]' : filtroCategoria === cat.titulo ? 'bg-white/5 text-[#d7f250]' : 'text-gray-400'
                        }`}
                    >
                      {tituloCorto}
                      {filtroCategoria === cat.titulo && <span className="ml-auto">✓</span>}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
      </div>

      {/* ZONA DE CARGA O CONTENIDO */}
      {cargando ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-[#d7f250]">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Cargando librería de videos...</p>
        </div>
      ) : (
        /* GRILLA / LISTA CONTENEDORA (Animada) */
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
          >

            {/* SI HAY VIDEOS, MOSTRAMOS ADDCARD + VIDEOS */}
            {videosFiltrados.length > 0 ? (
              <>
                <AddVideoCard viewMode={viewMode} onClick={() => navigate('/admin/videos/nuevo')} />
                {videosFiltrados.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    viewMode={viewMode}
                    onEdit={(id) => navigate(`/admin/videos/editar/${id}`)}
                    onDelete={abrirModalEliminacion}
                  />
                ))}
              </>
            ) : (

              <div className={`w-full flex flex-col items-center justify-center text-center border-2 border-dashed border-white/10 rounded-[32px] bg-[#131313]/50 p-6 md:col-span-full
                ${viewMode === 'grid' ? 'h-[350px] sm:h-[400px]' : 'h-[250px]'}`}>

                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5 border border-white/5 shadow-inner">
                  <Video className="w-8 h-8 text-gray-500" />
                </div>

                <p className="text-white font-black tracking-widest uppercase text-lg sm:text-xl mb-2">No hay videos aquí</p>
                <p className="text-gray-500 text-xs sm:text-sm max-w-sm mb-8">No se encontraron videos para esta búsqueda o categoría. ¿Deseas subir uno nuevo?</p>

                <button
                  onClick={() => navigate('/admin/videos/nuevo')}
                  className="bg-[#d7f250] text-[#131313] px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-transform duration-200 hover:scale-105 uppercase tracking-widest text-xs cursor-pointer hover:bg-[#fff] hover:text-[#1a1a1a] "
                >
                  <Plus size={18} /> Subir Nuevo Video
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

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