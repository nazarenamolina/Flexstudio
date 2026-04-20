import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { obtenerCategoriasRequest, eliminarCategoriaRequest, type Categoria } from '../../../api/categoria';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal';

interface CategoriaConVideos extends Categoria {
  videos?: any[];
}

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<CategoriaConVideos[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<{ id: string, titulo: string } | null>(null);
  const [estaEliminando, setEstaEliminando] = useState(false);

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategoriasRequest();
      if (Array.isArray(data)) setCategorias(data);
      else if (data && Array.isArray((data as any).categorias)) setCategorias((data as any).categorias);
      else setCategorias([]);
    } catch (error) {
      toast.error('No se pudieron cargar las categorías.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const abrirModalEliminacion = (id: string, titulo: string) => {
    setCategoriaAEliminar({ id, titulo });
    setModalAbierto(true);
  };

  const ejecutarEliminacion = async () => {
    if (!categoriaAEliminar) return;
    setEstaEliminando(true);
    try {
      await eliminarCategoriaRequest(categoriaAEliminar.id);
      setCategorias(categorias.filter(cat => cat.id !== categoriaAEliminar.id));
      toast.success('Categoría eliminada exitosamente');
      setModalAbierto(false);
    } catch (error) {
      toast.error('Ocurrió un error al eliminar la categoría');
    } finally {
      setEstaEliminando(false);
      setTimeout(() => setCategoriaAEliminar(null), 300);
    }
  };

  const getBentoClasses = (index: number) => {
    const pos = index % 3;
    if (pos === 0) return 'md:col-span-2 md:row-span-2 min-h-[200px]';
    if (pos === 1) return 'md:col-span-1 md:row-span-2 min-h-[200px]';
    if (pos === 4) return 'md:col-span-2 md:row-span-1 min-h-[150px]';
    return 'md:col-span-1 md:row-span-1 min-h-[150px]';
  };

  if (cargando) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-[#d7f250] text-xl font-bold animate-pulse">Cargando categorías...</div>
      </div>
    );
  }

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
          onClick={() => navigate('/admin/categorias/nueva')}
          className="bg-[#d7f250] hover:bg-[#D7F250] text-[#131313] px-8 py-4 rounded-full font-bold text-sm tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          AÑADIR CATEGORÍA <Plus size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10 auto-rows-fr">
        {categorias.map((cat, index) => {
          const tituloMostrar = cat.titulo.includes('|')
            ? cat.titulo.split('|').map((s) => s.trim())
            : cat.titulo;

          return (
            <div
              key={cat.id}
              onClick={() => navigate(`/admin/categorias/editar/${cat.id}`)}
              className={`relative rounded-[32px] overflow-hidden group cursor-pointer border border-white/5 hover:border-[#d7f250]/50 transition-all duration-500 ${getBentoClasses(index)}`}
            >
              {/* IMAGEN DE FONDO */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: cat.imagenTarjeta ? `url(${cat.imagenTarjeta})` : 'none',
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-90" />

              <div className="absolute top-6 right-6 flex gap-2 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/admin/categorias/editar/${cat.id}`); }}
                  className="bg-black/50 backdrop-blur-md hover:bg-white border border-white/20 hover:border-white p-2.5 rounded-full cursor-pointer transition-colors group/edit" title="Editar">
                  <Edit2 size={16} className="text-white group-hover/edit:text-black" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); abrirModalEliminacion(`${cat.id}`, `${tituloMostrar}`); }}
                  className="bg-black/50 backdrop-blur-md hover:bg-red-500 border border-white/20 hover:border-red-500 p-2.5 rounded-full cursor-pointer transition-colors" title="Eliminar">
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full border border-[#d7f250]/50 bg-[#d7f250]/10 text-[#d7f250] text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm">
                    {cat.videos?.length || 0} VIDEOS
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tight leading-none mb-3">
                  {tituloMostrar}
                </h3>

                <p className="text-gray-400 text-sm md:text-base line-clamp-2 max-w-[85%] font-light">
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