import { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { useCategorias } from '../../../hooks/useCategorias';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal';

export const CategoriasPage = () => {
  const {
    categorias,
    isLoading,
    estaEliminando,
    // 👇 Eliminamos 'abrirModalEliminacion' de aquí porque ya no se usa
    handleEliminar,
    navigateANueva,
    navigateAEditar,
  } = useCategorias();

  // 👇 Agregamos el useState que faltaba aquí
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<{ id: string, titulo: string } | null>(null);

  // 👇 PATRÓN BENTO GRID
  const getBentoClasses = (index: number) => {
    const pos = index % 5;

    if (pos === 0) return 'md:col-span-2 md:row-span-2';
    if (pos === 1) return 'md:col-span-1 md:row-span-1';
    if (pos === 2) return 'md:col-span-1 md:row-span-1';
    if (pos === 3) return 'md:col-span-1 md:row-span-1';
    if (pos === 4) return 'md:col-span-2 md:row-span-1';

    return 'col-span-1 row-span-1';
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#1a1a1a] rounded-2xl p-6 md:p-10 font-sans">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="h-20 w-64 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-12 w-40 bg-gray-800 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10 auto-rows-[280px] grid-flow-row-dense">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`relative rounded-[32px] overflow-hidden bg-gray-800/50 animate-pulse ${getBentoClasses(i)}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && categorias.length === 0) {
    return (
      <div className="w-full min-h-screen bg-[#1a1a1a] rounded-2xl p-6 md:p-10 font-sans flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <Plus className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Sin categorías</h2>
          <p className="text-gray-400 mb-8">
            No hay categorías creadas aún. Comienza añadiendo la primera categoría para organizar tus videos.
          </p>
          <button
            onClick={navigateANueva}
            className="bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] px-8 py-4 rounded-full font-bold text-sm tracking-widest inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Crear primera categoría <Plus size={18} />
          </button>
        </div>
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

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] rounded-2xl p-6 md:p-10 font-sans overflow-y-auto relative">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            EDITAR
            <br />
            <span className="text-[#d7f250] italic">CATEGORÍAS</span>
          </h1>
        </div>

        <button
          onClick={navigateANueva}
          className="bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] px-8 py-4 rounded-full font-bold text-sm tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          AÑADIR CATEGORÍA <Plus size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10 auto-rows-[280px] grid-flow-row-dense">
        {categorias.map((cat, index) => {
          const tituloMostrar = cat.titulo.includes('|')
            ? cat.titulo.split('|').map((s) => s.trim())
            : cat.titulo;

          return (
            <div
              key={cat.id}
              onClick={() => navigateAEditar(cat.id)}
              className={`relative rounded-[32px] overflow-hidden group cursor-pointer border border-white/5 hover:border-[#d7f250]/50 transition-all duration-500 ${getBentoClasses(index)}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: cat.imagenTarjeta ? `url(${cat.imagenTarjeta})` : 'none',
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute top-6 right-6 flex gap-2 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => { e.stopPropagation(); navigateAEditar(cat.id); }}
                  className="bg-black/50 hover:bg-white border border-white/20 hover:border-white p-2.5 rounded-full cursor-pointer transition-colors group/edit" title="Editar">
                  <Edit2 size={16} className="text-white group-hover/edit:text-black" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); abrirModalConConfirmacion(`${cat.id}`, `${tituloMostrar}`); }}
                  className="bg-black/50 backdrop-blur-md hover:bg-red-500 border border-white/20 hover:border-red-500 p-2.5 rounded-full cursor-pointer transition-colors" title="Eliminar">
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full border border-[#d7f250]/50 bg-[#d7f250]/10 text-[#d7f250] text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm shadow-black/50">
                    {cat.videos?.length || 0} VIDEOS
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tight leading-none mb-3 drop-shadow-md">
                  {tituloMostrar}
                </h3>

                <p className="text-gray-400 text-sm md:text-base line-clamp-2 max-w-[85%] font-light drop-shadow-md">
                  Edita los contenidos, videos de muestra y beneficios de esta categoría.
                </p>

                <div className="mt-6 flex items-center text-[#d7f250] text-xs font-bold tracking-widest uppercase">
                  Ver Categoría <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

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