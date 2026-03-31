import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast'
import { obtenerTodosLosVideosRequest, actualizarVideoRequest } from '../../../api/videos'; 
import { obtenerCategoriasRequest, type Categoria } from '../../../api/categoria';

export const EditarVideoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();  
  
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [datos, setDatos] = useState({
    titulo: '',
    idCategoria: '',
    duracion: '',
    orden: '',
  });

  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [imagenActual, setImagenActual] = useState('');
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!id) return;
 
        const resCat = await obtenerCategoriasRequest();
        setCategorias(Array.isArray(resCat) ? resCat : (resCat as any).categorias || [])
        const resVideos = await obtenerTodosLosVideosRequest();
        const videos = Array.isArray(resVideos) ? resVideos : (resVideos as any).data || [];
        const video = videos.find((v: any) => v.id === id);

        if (video) {
          setDatos({
            titulo: video.titulo,
            idCategoria: video.categoria?.id || video.idCategoria || '',
            duracion: video.duracion?.toString() || '0',
            orden: video.orden?.toString() || '1',
          });
          setImagenActual(video.imagenUrl || '');
        } else {
          toast.error('Video no encontrado');
          navigate('/admin/videos');
        }
      } catch (error) {
        toast.error('Error al cargar la información');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivoImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setGuardando(true);
    const loadingToast = toast.loading('Guardando cambios...');

    try {
      const formData = new FormData();
      formData.append('titulo', datos.titulo);
      formData.append('idCategoria', datos.idCategoria);
      formData.append('duracion', datos.duracion);
      formData.append('orden', datos.orden);

      if (archivoImagen) {
        formData.append('imagen', archivoImagen);
      }

      await actualizarVideoRequest(id, formData);

      toast.success('¡Video actualizado con éxito!', { id: loadingToast });
      navigate('/admin/videos');

    } catch (error) {
      toast.error('Error al guardar los cambios', { id: loadingToast });
    } finally {
      setGuardando(false);
    }
  };

  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-gray-400 mb-2";

  if (cargando) {
    return <div className="w-full h-full flex items-center justify-center text-[#d7f250]"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  }

  return (
    <div className="w-full h-full flex flex-col font-sans overflow-y-auto custom-scrollbar pr-2 pb-10">
      
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={() => navigate('/admin/videos')} type="button" disabled={guardando} className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors disabled:opacity-50">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Editar Clase</h1>
          <p className="text-gray-400 text-sm">Modifica los detalles y la miniatura del video.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
        
        {/* COLUMNA IZQUIERDA: Textos */}
        <div className="flex-1 space-y-6 bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-4">Detalles de la Clase</h3>
          
          <div>
            <label className={labelClass}>Título del Video *</label>
            <input type="text" name="titulo" required value={datos.titulo} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Categoría / Disciplina *</label>
            <select name="idCategoria" required value={datos.idCategoria} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
              <option value="" disabled>Selecciona una categoría...</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.titulo}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Duración (minutos)</label>
              <input type="number" name="duracion" min="0" value={datos.duracion} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>N° de Orden</label>
              <input type="number" name="orden" min="1" value={datos.orden} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Imagen */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Miniatura</h3>
            
            <div>
              <label className={labelClass}>Imagen de Portada</label>
              <div className="relative w-full h-40 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                
                {(archivoImagen || imagenActual) && (
                  <img src={archivoImagen ? URL.createObjectURL(archivoImagen) : imagenActual} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                )}
                
                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className="h-8 w-8 mb-2 text-white" />
                  <span className="text-sm font-medium text-white shadow-black drop-shadow-md">Cambiar Portada</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Recomendado: 1920x1080px (16:9)</p>
            </div>
          </div>

          <button type="submit" disabled={guardando} className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 shadow-lg disabled:opacity-70 uppercase tracking-widest">
            {guardando ? <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</> : <><Save className="w-6 h-6" /> Guardar Cambios</>}
          </button>
        </div>
      </form>
    </div>
  );
};