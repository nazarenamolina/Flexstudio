import { useState } from 'react';
import { PencilLine, LayoutGrid, List, ArchiveRestore, ChevronDown } from 'lucide-react';
import { useCategorias } from '../../../hooks/useCategorias';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoriaCard } from '../../../components/CategoriaCard';
import { AddCategoriaCard } from '../../../components/AddCategoriaCard';
import { ErrorCargaAdmin } from '../../../components/ErrorCargaAdmin';

export const CategoriasPage = () => {
  const {
    categorias, isLoading, isError, isFetching, refetch, estaEliminando, handleEliminar, navigateANueva, navigateAEditar,
    categoriasEliminadas, handleRestaurar, estaRestaurando,
  } = useCategorias();
  const [verEliminadas, setVerEliminadas] = useState(false);
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
        </motion.div>

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

      {isError && (
        <ErrorCargaAdmin que="las clases" onReintentar={() => refetch()} reintentando={isFetching} />
      )}

      {/* GRILLA / LISTA CONTENEDORA */}
      {!isError && <AnimatePresence mode="wait">
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
      </AnimatePresence>}

      {/* DADAS DE BAJA: siguen visibles para quienes las compraron y se pueden restaurar */}
      {categoriasEliminadas.length > 0 && (
        <div className="mt-12 border-t border-white/5 pt-6">
          <button
            onClick={() => setVerEliminadas((v) => !v)}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <ChevronDown size={16} className={`transition-transform ${verEliminadas ? 'rotate-180' : ''}`} />
            Dadas de baja ({categoriasEliminadas.length})
          </button>

          {verEliminadas && (
            <ul className="mt-4 space-y-3">
              {categoriasEliminadas.map((cat) => (
                <li
                  key={cat.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 border border-white/5 rounded-2xl p-4"
                >
                  <div>
                    <p className="text-white font-bold">{cat.titulo}</p>
                    <p className="text-gray-500 text-xs">
                      Fuera del catálogo. Quienes la compraron la siguen viendo.
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestaurar(cat.id)}
                    disabled={estaRestaurando}
                    className="flex items-center justify-center gap-2 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                  >
                    <ArchiveRestore size={14} /> Restaurar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ConfirmarEliminarModal
        isOpen={modalAbierto}
        onClose={() => !estaEliminando && setModalAbierto(false)}
        onConfirm={ejecutarEliminacion}
        tituloItem={categoriaAEliminar?.titulo || ''}
        estaEliminando={estaEliminando}
        titulo="Dar de baja la clase"
        textoConfirmar="Sí, dar de baja"
        mensaje={
          <>
            <strong className="text-white">"{categoriaAEliminar?.titulo}"</strong> deja de aparecer en el catálogo y no se
            puede comprar. Quienes ya la compraron la siguen viendo, y la podés restaurar cuando quieras desde
            "Dadas de baja".
          </>
        }
      />
    </div>
  );
};