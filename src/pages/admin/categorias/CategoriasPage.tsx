import { useState } from 'react';
import { PencilLine, LayoutGrid, List } from 'lucide-react';
import { useCategorias } from '../../../hooks/useCategorias';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoriaCard } from '../../../components/CategoriaCard';
import { AddCategoriaCard } from '../../../components/AddCategoriaCard';

export const CategoriasPage = () => {
  const { categorias, isLoading, estaEliminando, handleEliminar, navigateANueva, navigateAEditar } = useCategorias();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<{ id: string, titulo: string } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-20 flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <PencilLine className="text-[#d7f250] w-12 h-12 opacity-20" />
        </motion.div>
      </div>
    );
  }

  const abrirModalConConfirmacion = (id: string, titulo: string) => {
    setCategoriaAEliminar({ id, titulo });
    setModalAbierto(true);
  };

  const ejecutarEliminacion = async () => {
    if (!categoriaAEliminar) return;
    handleEliminar(categoriaAEliminar.id);
    setModalAbierto(false);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <motion.div layout className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 font-principal">
            <PencilLine className="text-[#d7f250] w-8 h-8 md:w-10 md:h-10 shrink-0" />
            <span className="leading-none mt-1">Categorias</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium tracking-wide">
            Administrando <span className="text-gray-300">{categorias.length}</span> categorías activas.
          </p>
        </motion.div>

        {/* SWITCHER */}
        <div className="flex bg-zinc-900/80 p-1 rounded-full border border-white/5 backdrop-blur-md shadow-2xl">
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

      {/* GRILLA / LISTA CONTENEDORA */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={viewMode}
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
        >
          <AddCategoriaCard viewMode={viewMode} onClick={navigateANueva} />

          {categorias.map((cat) => (
            <CategoriaCard
              key={cat.id}
              categoria={cat}
              viewMode={viewMode}
              onEdit={navigateAEditar}
              onDelete={abrirModalConConfirmacion}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <ConfirmarEliminarModal
        isOpen={modalAbierto}
        onClose={() => !estaEliminando && setModalAbierto(false)}
        onConfirm={ejecutarEliminacion}
        tituloItem={categoriaAEliminar?.titulo || ''}
        estaEliminando={estaEliminando}
      />
    </div>
  );
};