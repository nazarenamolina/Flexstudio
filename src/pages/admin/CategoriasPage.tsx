import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Plus, Edit2, Trash2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { obtenerCategoriasRequest, eliminarCategoriaRequest, type Categoria } from '../../api/categoria';
interface CategoriaConVideos extends Categoria {
  videos?: any[]; 
}

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<CategoriaConVideos[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const colores = ['#1f2937', '#374151', '#111827', '#0f172a', '#1e293b'];

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

  useEffect(() => { cargarCategorias(); }, []);

  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría? Se borrarán sus imágenes y videos de la base de datos.')) return;
    
    try {
      await eliminarCategoriaRequest(id);
      setCategorias(categorias.filter(cat => cat.id !== id));
      toast.success('Categoría eliminada exitosamente');
    } catch (error) {
      toast.error('Ocurrió un error al eliminar la categoría');
    }
  };

  const totalVideosSubidos = categorias.reduce((total, cat) => total + (cat.videos?.length || 0), 0);

  if (cargando) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-[#d7f250] text-xl font-bold animate-pulse">Cargando disciplinas...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-8 font-sans overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#d7f250]/50 pr-2">
      
      {/* CABECERA PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1 tracking-tight">Disciplinas Flex Studio</h1>
          <p className="text-gray-400 text-sm md:text-base">Administra las categorías de tu estudio.</p>
        </div>
        
        <button 
          onClick={() => navigate('/admin/categorias/nueva')}
          className="bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-transform duration-200 hover:scale-105 shadow-lg"
        >
          <Plus size={20} /> Añadir Nueva Categoría
        </button>
      </div>

      {/* CUADRÍCULA RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Tarjeta Resumen 1 */}
        <div className="bg-[#131313] p-6 rounded-[20px] border border-gray-800 shadow-sm">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Categorías Registradas</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">{categorias.length}</h2>
        </div>
        
        {/* Tarjeta Resumen 2 */}
        <div className="bg-[#131313] p-6 rounded-[20px] border border-gray-800 shadow-sm">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Videos Subidos</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">{totalVideosSubidos}</h2>
        </div>

      </div>

      {/* CUADRÍCULA TARJETAS (auto-fill minmax 220px aprox) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-2 pb-10">
        
        {categorias.map((cat, index) => {
          const tituloMostrar = cat.titulo.includes('|') 
            ? cat.titulo.split('|')[0].trim() 
            : cat.titulo;

          return (
            <div 
              key={cat.id} 
              className="bg-[#131313] rounded-[24px] overflow-hidden border border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative group flex flex-col"
            >
              
              {/* BOTONES FLOTANTES (Editar / Eliminar) */}
              <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  onClick={() => navigate(`/admin/categorias/editar/${cat.id}`)} 
                  className="bg-white/10 backdrop-blur-md hover:bg-white border border-white/20 hover:border-white p-2 rounded-lg cursor-pointer transition-colors shadow-lg group/edit"
                  title="Editar"
                >
                  <Edit2 size={16} className="text-white group-hover/edit:text-[#131313]" />
                </button>
                <button 
                  onClick={() => handleEliminar(cat.id)} 
                  className="bg-red-500/80 backdrop-blur-md hover:bg-red-500 border border-red-500/20 p-2 rounded-lg cursor-pointer transition-colors shadow-lg"
                  title="Eliminar"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>

              {/* IMAGEN DE LA CATEGORÍA */}
              <div 
                className="h-[140px] w-full rounded-t-[24px] bg-cover bg-center" 
                style={{ 
                  backgroundImage: cat.imagenTarjeta ? `url(${cat.imagenTarjeta})` : 'none',
                  backgroundColor: cat.imagenTarjeta ? 'transparent' : colores[index % colores.length],
                }}
              >
                {/* Overlay oscuro para que los botones floten sobre cualquier imagen */}
                <div className="w-full h-full bg-gradient-to-b from-black/50 to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              {/* INFO DE LA CATEGORÍA */}
              <div className="p-5 flex justify-between items-center flex-1">
                <div>
                  <h4 className="m-0 text-lg font-bold text-white leading-tight">{tituloMostrar}</h4>
                  <span className="text-[13px] text-gray-400 mt-1 block font-medium">
                    {cat.videos ? cat.videos.length : 0} Videos
                  </span>
                </div>
                <ChevronRight size={20} className="text-gray-500 group-hover:text-[#d7f250] transition-colors" />
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};