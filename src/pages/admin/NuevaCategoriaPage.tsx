import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Loader2, Film, CloudUpload, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import * as UpChunk from '@mux/upchunk';
import { crearCategoriaRequest } from '../../api/categoria';

export const NuevaCategoriaPage = () => {
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);
  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'CREANDO_CATEGORIA' | 'SUBIENDO_VIDEO' | 'COMPLETADO'>('IDLE');
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, tipo: 'imagenTarjeta' | 'imagenHero' | 'videoMuestra') => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos({ ...archivos, [tipo]: e.target.files[0] });
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!datos.titulo || !datos.precio) {
      toast.error('El título y el precio son obligatorios');
      return;
    }

    setGuardando(true);
    setEstadoSubida('CREANDO_CATEGORIA');
    const loadingToast = toast.loading('Guardando datos y fotos...');

    try {
      const formData = new FormData();
      formData.append('titulo', datos.titulo);
      formData.append('precio', datos.precio);
      if (datos.descripcionCard) formData.append('descripcionCard', datos.descripcionCard);
      if (datos.descripcionBreve) formData.append('descripcionBreve', datos.descripcionBreve);
      if (datos.descripcionDetallada) formData.append('descripcionDetallada', datos.descripcionDetallada);
      if (archivos.imagenTarjeta) formData.append('imagenTarjeta', archivos.imagenTarjeta);
      if (archivos.imagenHero) formData.append('imagenHero', archivos.imagenHero);
      if (archivos.videoMuestra) {
        formData.append('necesitaVideoMuestra', 'true');
      }
      const respuestaBackend = await crearCategoriaRequest(formData);
      const uploadUrl = respuestaBackend.uploadUrl;
      toast.success('¡Categoría base creada!', { id: loadingToast });
      if (archivos.videoMuestra && uploadUrl) {
        setEstadoSubida('SUBIENDO_VIDEO');
        
        const upload = UpChunk.createUpload({
          endpoint: uploadUrl,
          file: archivos.videoMuestra,
          chunkSize: 5120,
        });

        upload.on('progress', (progressEvent) => {
          setProgreso(Math.floor(progressEvent.detail));
        });

        upload.on('success', () => {
          setEstadoSubida('COMPLETADO');
          setProgreso(100);
          toast.success('¡Video de muestra subido exitosamente!');
          setTimeout(() => navigate('/admin/categorias'), 2000);
        });

        upload.on('error', () => {
          toast.error('Error al subir el video a Mux. La categoría se creó sin video.');
          setGuardando(false);
          setEstadoSubida('IDLE');
          navigate('/admin/categorias');
        });
        
        return;
      }
      navigate('/admin/categorias');
    } catch (error: any) {
      const mensaje = error.response?.data?.message || 'Error al contactar con el servidor';
      toast.error(Array.isArray(mensaje) ? mensaje[0] : mensaje, { id: loadingToast });
      setGuardando(false);
      setEstadoSubida('IDLE');
    }
  };
  const labelClass = "block text-sm font-bold text-gray-400 mb-2";
  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";
  if (estadoSubida === 'SUBIENDO_VIDEO' || estadoSubida === 'COMPLETADO') {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-[#131313] border border-gray-800 p-10 rounded-[24px] shadow-2xl w-full max-w-xl text-center">
          {estadoSubida === 'SUBIENDO_VIDEO' ? (
            <CloudUpload className="w-20 h-20 text-[#d7f250] animate-bounce mx-auto mb-6" />
          ) : (
            <CheckCircle2 className="w-20 h-20 text-[#d7f250] mx-auto mb-6" />
          )}
          <h2 className="text-2xl font-black text-white mb-2">
            {estadoSubida === 'SUBIENDO_VIDEO' ? 'Subiendo video de muestra...' : '¡Subida completada!'}
          </h2>
          <p className="text-gray-400 mb-8">Por favor, no cierres esta ventana hasta que termine el proceso.</p>
  
          <div className="w-full bg-gray-800 rounded-full h-4 mb-2 overflow-hidden">
            <div className="bg-[#d7f250] h-4 rounded-full transition-all duration-300" style={{ width: `${progreso}%` }}></div>
          </div>
          <p className="text-right text-[#d7f250] font-black text-xl">{progreso}%</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col font-sans overflow-y-auto custom-scrollbar pr-2 pb-10">
      
      {/* CABECERA */}
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button 
          onClick={() => navigate('/admin/categorias')}
          type="button"
          disabled={guardando}
          className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Nueva Disciplina</h1>
          <p className="text-gray-400 text-sm">Crea una nueva categoría para tus videos.</p>
        </div>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="flex-1 space-y-6 bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-4">Información General</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Título de la Disciplina *</label>
              <input type="text" name="titulo" required placeholder="Ej: Clases de Danza" value={datos.titulo} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Precio Mensual ($) *</label>
              <input type="number" name="precio" required min="0" step="0.01" placeholder="Ej: 5000" value={datos.precio} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Descripción para la Tarjeta (Corta)</label>
            <textarea name="descripcionCard" rows={2} placeholder="Aparecerá en la cuadrícula principal..." value={datos.descripcionCard} onChange={handleChange} className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className={labelClass}>Descripción Breve (Página de detalle)</label>
            <textarea name="descripcionBreve" rows={2} placeholder="Un resumen rápido de la clase..." value={datos.descripcionBreve} onChange={handleChange} className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className={labelClass}>Descripción Detallada (Larga)</label>
            <textarea name="descripcionDetallada" rows={5} placeholder="Explica a fondo de qué trata la disciplina..." value={datos.descripcionDetallada} onChange={handleChange} className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Archivos Multimedia</h3>
            
            {/* Imagen Tarjeta */}
            <div>
              <label className={labelClass}>Imagen para la Tarjeta</label>
              <div className="relative w-full h-40 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenTarjeta')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {archivos.imagenTarjeta && <img src={URL.createObjectURL(archivos.imagenTarjeta)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className={`h-8 w-8 mb-2 ${archivos.imagenTarjeta ? 'text-white' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${archivos.imagenTarjeta ? 'text-white' : 'text-gray-500'}`}>
                    {archivos.imagenTarjeta ? 'Cambiar Imagen' : 'Subir Portada (Vertical)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Imagen Hero */}
            <div>
              <label className={labelClass}>Imagen de Fondo (Banner)</label>
              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenHero')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {archivos.imagenHero && <img src={URL.createObjectURL(archivos.imagenHero)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className={`h-8 w-8 mb-2 ${archivos.imagenHero ? 'text-white' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${archivos.imagenHero ? 'text-white' : 'text-gray-500'}`}>
                    {archivos.imagenHero ? 'Cambiar Imagen' : 'Subir Banner (Horizontal)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Video de Muestra (Upchunk) */}
            <div className="border-t border-gray-800 pt-4">
              <label className={labelClass}>Video de Muestra (Opcional)</label>
              <div className="relative w-full h-24 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] group cursor-pointer">
                <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleFileChange(e, 'videoMuestra')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <Film className={`h-6 w-6 mb-2 ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium px-4 truncate w-full text-center ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`}>
                  {archivos.videoMuestra ? archivos.videoMuestra.name : 'Subir video corto promocional'}
                </span>
              </div>
            </div>
          </div>
          <button type="submit" disabled={guardando} className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 shadow-lg disabled:opacity-70 disabled:hover:translate-y-0 uppercase tracking-widest">
            {guardando ? <><Loader2 className="w-6 h-6 animate-spin" /> Procesando...</> : <><Save className="w-6 h-6" /> Guardar Disciplina</>}
          </button>
        </div>
      </form>
    </div>
  );
};