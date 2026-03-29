import { ArrowLeft, CloudUpload, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { useNuevoVideo } from '../../../hooks/useNuevoVideoPage'; // Ajusta la ruta

export const NuevoVideoPage = () => {

  const {register, handleSubmit, errors, isSubmitting, categorias, archivos, estadoSubida, progreso, handleFileChange, navigate } = useNuevoVideo();

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
        <button onClick={() => navigate('/admin/videos')} type="button" disabled={isSubmitting || estadoSubida === 'PIDIENDO_URL'} className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors disabled:opacity-50">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Nuevo Video</h1>
          <p className="text-gray-400 text-sm">Sube una nueva clase al catálogo.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-6 bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-4">Detalles de la Clase</h3>
          <div>
            <label className={labelClass}>Título del Video *</label>
            <input 
              type="text" 
              placeholder="Ej: Clase 1 - Introducción" 
              {...register('titulo', { required: 'El título es obligatorio' })} 
              className={inputClass} 
            />
            {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Categoría / Disciplina *</label>
            <select 
              {...register('idCategoria', { required: 'Debes seleccionar una categoría' })} 
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="" disabled>Selecciona una categoría...</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.titulo}</option>)}
            </select>
            {errors.idCategoria && <p className="text-red-500 text-xs mt-1">{errors.idCategoria.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Duración (minutos)</label>
              <input 
                type="number" 
                min="0" 
                placeholder="Ej: 45" 
                {...register('duracion')} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>N° de Orden</label>
              <input 
                type="number" 
                min="1" 
                placeholder="Ej: 1" 
                {...register('orden')} 
                className={inputClass} 
              />
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
                <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleFileChange(e, 'video')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
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