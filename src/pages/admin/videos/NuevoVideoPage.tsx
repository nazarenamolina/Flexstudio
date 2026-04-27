import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudUpload, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import * as UpChunk from '@mux/upchunk';
import { solicitarUrlSubidaRequest } from '../../../api/videos'; 
import { obtenerCategoriasRequest, type Categoria } from '../../../api/categoria';

export const NuevoVideoPage = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [datos, setDatos] = useState({
    titulo: '',
    descripcion: '',
    idCategoria: '',
    duracion: '',
    orden: '',
  });

  const [archivos, setArchivos] = useState({
    video: null as File | null,
    imagen: null as File | null,
  });

 
  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'PIDIENDO_URL' | 'SUBIENDO' | 'COMPLETADO'>('IDLE');
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await obtenerCategoriasRequest();
        setCategorias(Array.isArray(res) ? res : (res as any).categorias || []);
      } catch (error) {
        toast.error("Error al cargar categorías");
      }
    };
    cargarCategorias();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, tipo: 'video' | 'imagen') => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos({ ...archivos, [tipo]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!archivos.video || !datos.titulo || !datos.idCategoria) {
      toast.error('El título, la categoría y el video son obligatorios');
      return;
    }

    try {
      setEstadoSubida('PIDIENDO_URL');
      const formData = new FormData();
      formData.append('titulo', datos.titulo);
      if (datos.descripcion) {formData.append('descripcion', datos.descripcion);}
      formData.append('idCategoria', datos.idCategoria);
      formData.append('duracion', datos.duracion || '0');
      formData.append('orden', datos.orden || '1');
      if (archivos.imagen) {
        formData.append('imagen', archivos.imagen);  
      }

      const { uploadUrl } = await solicitarUrlSubidaRequest(formData);
      setEstadoSubida('SUBIENDO');
      const upload = UpChunk.createUpload({
        endpoint: uploadUrl,
        file: archivos.video,
        chunkSize: 5120,
      });

      upload.on('progress', (progressEvent) => {
        setProgreso(Math.floor(progressEvent.detail));
      });

      upload.on('success', () => {
        setEstadoSubida('COMPLETADO');
        setProgreso(100);
        toast.success('¡Video subido exitosamente!');
        setTimeout(() => navigate('/admin/videos'), 2000);
      });

      upload.on('error', () => {
        toast.error('Error al subir el video a Mux. Reintentando...');
      });

    } catch (error) {
      toast.error('Error al contactar con el servidor');
      setEstadoSubida('IDLE');
    }
  };

  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-gray-400 mb-2";
  if (estadoSubida === 'SUBIENDO' || estadoSubida === 'COMPLETADO') {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-[#131313] border border-gray-800 p-10 rounded-[24px] shadow-2xl w-full max-w-xl text-center">
          {estadoSubida === 'SUBIENDO' ? (
            <CloudUpload className="w-20 h-20 text-[#d7f250] animate-bounce mx-auto mb-6" />
          ) : (
            <CheckCircle2 className="w-20 h-20 text-[#d7f250] mx-auto mb-6" />
          )}
          <h2 className="text-2xl font-black text-white mb-2">
            {estadoSubida === 'SUBIENDO' ? 'Subiendo clase a la nube...' : '¡Subida completada!'}
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
      
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={() => navigate('/admin/videos')} className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Nuevo Video</h1>
          <p className="text-gray-400 text-sm">Sube una nueva clase al catálogo.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
        
        {/* COLUMNA IZQUIERDA: Textos */}
        <div className="flex-1 space-y-6 bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-4">Detalles de la Clase</h3>
          
          <div>
            <label className={labelClass}>Título del Video *</label>
            <input type="text" name="titulo" required placeholder="Ej: Clase 1 - Introducción" value={datos.titulo} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Descripción / Resumen de la Clase</label>
            <textarea 
              name="descripcion" 
              rows={4} 
              placeholder="Ej: En esta clase aprenderemos los fundamentos técnicos de la coreografía, enfocándonos en la postura y el control del núcleo..." 
              value={datos.descripcion} 
              onChange={handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>} 
              className={`${inputClass} resize-none`} 
            />
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
              <input type="number" name="duracion" min="0" placeholder="Ej: 45" value={datos.duracion} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>N° de Orden</label>
              <input type="number" name="orden" min="1" placeholder="Ej: 1" value={datos.orden} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Archivos */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Archivos Multimedia</h3>
            
            {/* Input Miniatura */}
            <div>
              <label className={labelClass}>Miniatura / Captura (Opcional)</label>
              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagen')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {archivos.imagen && <img src={URL.createObjectURL(archivos.imagen)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className={`h-8 w-8 mb-2 ${archivos.imagen ? 'text-white' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${archivos.imagen ? 'text-white' : 'text-gray-500'}`}>{archivos.imagen ? 'Cambiar Miniatura' : 'Subir Imagen'}</span>
                </div>
              </div>
            </div>

            {/* Input Video */}
            <div>
              <label className={labelClass}>Archivo de Video (.mp4) *</label>
              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] group">
                <input type="file" accept="video/mp4,video/x-m4v,video/*" required onChange={(e) => handleFileChange(e, 'video')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <CloudUpload className={`h-8 w-8 mb-2 ${archivos.video ? 'text-[#d7f250]' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium text-center px-4 truncate w-full ${archivos.video ? 'text-[#d7f250]' : 'text-gray-500'}`}>
                  {archivos.video ? archivos.video.name : 'Haz clic o arrastra el video aquí'}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={estadoSubida === 'PIDIENDO_URL'} className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 shadow-lg disabled:opacity-70 uppercase tracking-widest">
            {estadoSubida === 'PIDIENDO_URL' ? <><Loader2 className="w-6 h-6 animate-spin" /> Conectando...</> : 'Comenzar Subida'}
          </button>
        </div>
      </form>
    </div>
  );
};