import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Loader2, Film, CloudUpload, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import * as UpChunk from '@mux/upchunk';
import { obtenerCategoriaPorIdRequest, actualizarCategoriaRequest } from '../../api/categoria';

export const EditarCategoriaPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'ACTUALIZANDO_CATEGORIA' | 'SUBIENDO_VIDEO' | 'COMPLETADO'>('IDLE');
  const [progreso, setProgreso] = useState(0);
  const [datos, setDatos] = useState({
    titulo: '',
    precio: '',
    descripcionCard: '',
    descripcionBreve: '',
    descripcionDetallada: '',
  });

  const [archivos, setArchivos] = useState({
    imagenTarjeta: null as File | null,
    imagenHero: null as File | null,
    videoMuestra: null as File | null,
  });

  // URLs de las imágenes actuales (las que vienen de Cloudinary)
  const [imagenesActuales, setImagenesActuales] = useState({
    imagenTarjeta: '',
    imagenHero: '',
    tieneVideo: false,
  });

  // 1. CARGA INICIAL
  useEffect(() => {
    const cargarCategoria = async () => {
      try {
        if (!id) return;
        const cat = await obtenerCategoriaPorIdRequest(id);
        
        setDatos({
          titulo: cat.titulo || '',
          precio: cat.precio?.toString() || '',
          descripcionCard: cat.descripcionCard || '',
          descripcionBreve: cat.descripcionBreve || '',
          descripcionDetallada: cat.descripcionDetallada || '',
        });

        setImagenesActuales({
          imagenTarjeta: cat.imagenTarjeta || '',
          imagenHero: cat.imagenHero || '',
          tieneVideo: !!cat.playbackIdMuestra,
        });

      } catch (error) {
        toast.error('Error al cargar la categoría');
        navigate('/admin/categorias');
      } finally {
        setCargandoDatos(false);
      }
    };
    cargarCategoria();
  }, [id, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, tipo: 'imagenTarjeta' | 'imagenHero' | 'videoMuestra') => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos({ ...archivos, [tipo]: e.target.files[0] });
    }
  };

  // 2. FUNCIÓN DE ACTUALIZACIÓN
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setGuardando(true);
    setEstadoSubida('ACTUALIZANDO_CATEGORIA');
    const loadingToast = toast.loading('Guardando cambios...');

    try {
      const formData = new FormData();
      formData.append('titulo', datos.titulo);
      formData.append('precio', datos.precio);
      formData.append('descripcionCard', datos.descripcionCard);
      formData.append('descripcionBreve', datos.descripcionBreve);
      formData.append('descripcionDetallada', datos.descripcionDetallada);
      
      if (archivos.imagenTarjeta) formData.append('imagenTarjeta', archivos.imagenTarjeta);
      if (archivos.imagenHero) formData.append('imagenHero', archivos.imagenHero);

      if (archivos.videoMuestra) {
        formData.append('necesitaVideoMuestra', 'true');
      }

      const respuestaBackend = await actualizarCategoriaRequest(id, formData);
      const uploadUrl = respuestaBackend.uploadUrl;

      toast.success('¡Textos y fotos actualizados!', { id: loadingToast });
      if (archivos.videoMuestra && uploadUrl) {
        setEstadoSubida('SUBIENDO_VIDEO');
        
        const upload = UpChunk.createUpload({
          endpoint: uploadUrl,
          file: archivos.videoMuestra,
          chunkSize: 5120, 
        });

        upload.on('progress', (e) => setProgreso(Math.floor(e.detail)));

        upload.on('success', () => {
          setEstadoSubida('COMPLETADO');
          setProgreso(100);
          toast.success('¡Video actualizado!');
          setTimeout(() => navigate('/admin/categorias'), 2000);
        });

        upload.on('error', () => {
          toast.error('Error al subir el nuevo video. Lo demás sí se guardó.');
          navigate('/admin/categorias');
        });
        
        return; 
      }

      navigate('/admin/categorias');

    } catch (error: any) {
      const mensaje = error.response?.data?.message || 'Error al actualizar';
      toast.error(Array.isArray(mensaje) ? mensaje[0] : mensaje, { id: loadingToast });
      setGuardando(false);
      setEstadoSubida('IDLE');
    }
  };

  const labelClass = "block text-sm font-bold text-gray-400 mb-2";
  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";

  if (cargandoDatos) {
    return <div className="w-full h-full flex items-center justify-center text-[#d7f250]"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  }

  if (estadoSubida === 'SUBIENDO_VIDEO' || estadoSubida === 'COMPLETADO') {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-[#131313] border border-gray-800 p-10 rounded-[24px] shadow-2xl w-full max-w-xl text-center">
          {estadoSubida === 'SUBIENDO_VIDEO' ? <CloudUpload className="w-20 h-20 text-[#d7f250] animate-bounce mx-auto mb-6" /> : <CheckCircle2 className="w-20 h-20 text-[#d7f250] mx-auto mb-6" />}
          <h2 className="text-2xl font-black text-white mb-2">{estadoSubida === 'SUBIENDO_VIDEO' ? 'Actualizando video de muestra...' : '¡Actualización completada!'}</h2>
          <div className="w-full bg-gray-800 rounded-full h-4 mb-2 overflow-hidden mt-6">
            <div className="bg-[#d7f250] h-4 rounded-full transition-all duration-300" style={{ width: `${progreso}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col font-sans overflow-y-auto custom-scrollbar pr-2 pb-10">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={() => navigate('/admin/categorias')} type="button" disabled={guardando} className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors disabled:opacity-50"><ArrowLeft size={24} /></button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Editar Disciplina</h1>
          <p className="text-gray-400 text-sm">Modifica los datos de la categoría.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-6 bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-4">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>Título</label><input type="text" name="titulo" required value={datos.titulo} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Precio ($)</label><input type="number" name="precio" required min="0" step="0.01" value={datos.precio} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Descripción Tarjeta</label><textarea name="descripcionCard" rows={2} value={datos.descripcionCard} onChange={handleChange} className={`${inputClass} resize-none`} /></div>
          <div><label className={labelClass}>Descripción Breve</label><textarea name="descripcionBreve" rows={2} value={datos.descripcionBreve} onChange={handleChange} className={`${inputClass} resize-none`} /></div>
          <div><label className={labelClass}>Descripción Detallada</label><textarea name="descripcionDetallada" rows={5} value={datos.descripcionDetallada} onChange={handleChange} className={`${inputClass} resize-none`} /></div>
        </div>

        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Archivos Multimedia</h3>
            
            {/* Tarjeta */}
            <div>
              <label className={labelClass}>Imagen Tarjeta</label>
              <div className="relative w-full h-40 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenTarjeta')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {(archivos.imagenTarjeta || imagenesActuales.imagenTarjeta) && (
                  <img src={archivos.imagenTarjeta ? URL.createObjectURL(archivos.imagenTarjeta) : imagenesActuales.imagenTarjeta} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                )}
                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className="h-8 w-8 mb-2 text-white" />
                  <span className="text-sm font-medium text-white shadow-black drop-shadow-md">Cambiar Imagen</span>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div>
              <label className={labelClass}>Imagen Hero</label>
              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenHero')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {(archivos.imagenHero || imagenesActuales.imagenHero) && (
                  <img src={archivos.imagenHero ? URL.createObjectURL(archivos.imagenHero) : imagenesActuales.imagenHero} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                )}
                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className="h-8 w-8 mb-2 text-white" />
                  <span className="text-sm font-medium text-white shadow-black drop-shadow-md">Cambiar Banner</span>
                </div>
              </div>
            </div>

            {/* Video */}
            <div className="border-t border-gray-800 pt-4">
              <label className={labelClass}>Video de Muestra</label>
              {imagenesActuales.tieneVideo && !archivos.videoMuestra && (
                <p className="text-xs text-[#d7f250] mb-2 font-bold">✓ Esta disciplina ya tiene un video. Sube otro para reemplazarlo.</p>
              )}
              <div className="relative w-full h-24 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] group cursor-pointer">
                <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleFileChange(e, 'videoMuestra')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <Film className={`h-6 w-6 mb-2 ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium px-4 truncate w-full text-center ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`}>
                  {archivos.videoMuestra ? archivos.videoMuestra.name : 'Reemplazar video (Opcional)'}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={guardando} className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 shadow-lg disabled:opacity-70 disabled:hover:translate-y-0 uppercase tracking-widest">
            {guardando ? <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</> : <><Save className="w-6 h-6" /> Guardar Cambios</>}
          </button>
        </div>
      </form>
    </div>
  );
};