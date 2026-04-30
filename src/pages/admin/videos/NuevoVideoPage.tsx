import { useState } from 'react';
import { ArrowLeft, CloudUpload, Image as ImageIcon, Loader2, CheckCircle2, Library, Trash2, Film } from 'lucide-react';
import { useNuevoVideo } from '../../../hooks/useNuevoVideoPage';
import { GaleriaModal } from '../../../components/GaleriaModal'; 

export const NuevoVideoPage = () => {
  const {register, handleSubmit, errors, categorias, cargandoCategorias, archivos, estadoSubida, progreso, handleFileChange, handleSelectFromGallery, handleEliminarMiniatura, navigate} = useNuevoVideo();
  const [isGaleriaOpen, setIsGaleriaOpen] = useState(false);
  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-gray-400 mb-2";
  const getPreviewUrl = (archivo: File | string | null) => {
    if (!archivo) return null;
    return typeof archivo === 'string' ? archivo : URL.createObjectURL(archivo);
  };

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
      
      {/* Modal de la Galería */}
      <GaleriaModal 
        isOpen={isGaleriaOpen}
        onClose={() => setIsGaleriaOpen(false)}
        onSelectImagen={(url) => handleSelectFromGallery(url)}
      />

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
            <input type="text" {...register('titulo', { required: 'El título es obligatorio' })} placeholder="Ej: Clase 1 - Introducción" className={inputClass} />
            {errors.titulo && <span className="text-red-500 text-xs mt-1">{errors.titulo.message}</span>}
          </div>

          <div>
            <label className={labelClass}>Descripción / Resumen de la Clase</label>
            <textarea 
              {...register('descripcion')}
              rows={4} 
              placeholder="Ej: En esta clase aprenderemos los fundamentos técnicos de la coreografía..." 
              className={`${inputClass} resize-none scrollbar-hide`} 
            />
          </div>

          <div>
            <label className={labelClass}>Categoría / Disciplina *</label>
            <select {...register('idCategoria', { required: 'Debes elegir una categoría' })} className={`${inputClass} appearance-none cursor-pointer`}>
              <option value="" disabled selected>Selecciona una categoría...</option>
              {cargandoCategorias ? (
                <option disabled>Cargando...</option>
              ) : (
                categorias.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.titulo}</option>)
              )}
            </select>
            {errors.idCategoria && <span className="text-red-500 text-xs mt-1">{errors.idCategoria.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Duración (minutos)</label>
              <input type="number" {...register('duracion')} min="0" placeholder="Ej: 45" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>N° de Orden</label>
              <input type="number" {...register('orden')} min="1" placeholder="Ej: 1" className={inputClass} />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Archivos */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Archivos Multimedia</h3>
            
            {/* Input Miniatura */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-400">Miniatura (Opcional)</label>
                <button 
                  type="button" 
                  onClick={() => setIsGaleriaOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-[#d7f250] hover:text-white transition-colors"
                >
                  <Library size={14} /> Galería
                </button>
              </div>

              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagen')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                
                {archivos.imagen && (
                  <>
                    <img src={getPreviewUrl(archivos.imagen)!} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEliminarMiniatura(); }}
                      className="absolute top-2 right-2 z-30 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                
                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className={`h-8 w-8 mb-2 ${archivos.imagen ? 'text-white' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${archivos.imagen ? 'text-white shadow-black drop-shadow-md' : 'text-gray-500'}`}>
                    {archivos.imagen ? 'Cambiar Imagen' : 'Subir Imagen'}
                  </span>
                </div>
              </div>
            </div>

            {/* Input Video */}
            <div className="border-t border-gray-800 pt-4">
              <label className={labelClass}>Archivo de Video (.mp4) *</label>
              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] group cursor-pointer">
                <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleFileChange(e, 'video')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                
                {archivos.video && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleFileChange({ target: { files: null } } as any, 'video'); }}
                    className="absolute top-2 right-2 z-30 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <Film className={`h-8 w-8 mb-2 ${archivos.video ? 'text-[#d7f250]' : 'text-gray-500'}`} />
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