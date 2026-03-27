import { ArrowLeft, Save, Image as ImageIcon, Loader2, Film, CloudUpload, CheckCircle2 } from 'lucide-react';
import { useNuevaCategoria } from '../../../hooks/useNuevaCategoria';

export const NuevaCategoriaPage = () => {
  const { register, handleSubmit, errors, isSubmitting, estadoSubida, progreso, archivos, handleFileChange, navigate } = useNuevaCategoria();
  const labelClass = "block text-sm font-bold text-gray-400 mb-2";
  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";
  if (estadoSubida === 'SUBIENDO_VIDEO' || estadoSubida === 'COMPLETADO') {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-[#131313] border border-gray-800 p-10 rounded-[24px] shadow-2xl w-full max-w-xl text-center">
          {estadoSubida === 'SUBIENDO_VIDEO' ? <CloudUpload className="w-20 h-20 text-[#d7f250] animate-bounce mx-auto mb-6" /> : <CheckCircle2 className="w-20 h-20 text-[#d7f250] mx-auto mb-6" />}
          <h2 className="text-2xl font-black text-white mb-2">{estadoSubida === 'SUBIENDO_VIDEO' ? 'Subiendo video...' : '¡Subida completada!'}</h2>
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
        <button onClick={() => navigate('/admin/categorias')} type="button" disabled={isSubmitting} className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors disabled:opacity-50"><ArrowLeft size={24} /></button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Nueva Disciplina</h1>
          <p className="text-gray-400 text-sm">Crea una nueva categoría usando React Hook Form.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-6 bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-4">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Título *</label>
              <input type="text" {...register('titulo', { required: 'El título es obligatorio' })} placeholder="Ej: Danza Inicial" className={inputClass} />
              {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Precio ($) *</label>
              <input type="number" step="0.01" {...register('precio', { required: 'El precio es obligatorio', min: { value: 0, message: 'Debe ser mayor a 0' } })} placeholder="Ej: 5000" className={inputClass} />
              {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>Descripción Tarjeta</label>
            <textarea rows={2} {...register('descripcionCard')} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Descripción Breve</label>
            <textarea rows={2} {...register('descripcionBreve')} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Descripción Detallada</label>
            <textarea rows={5} {...register('descripcionDetallada')} className={`${inputClass} resize-none`} />
          </div>
        </div>
        {/* COLUMNA DERECHA (Archivos) */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Multimedia</h3>
            {/* Imagen Tarjeta */}
            <div>
              <label className={labelClass}>Imagen Tarjeta</label>
              <div className="relative w-full h-40 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenTarjeta')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {archivos.imagenTarjeta && <img src={URL.createObjectURL(archivos.imagenTarjeta)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                <div className="z-10 flex flex-col items-center pointer-events-none"><ImageIcon className="h-8 w-8 mb-2 text-white" /><span className="text-sm font-medium text-white">Subir Portada</span></div>
              </div>
            </div>
            {/* Imagen Hero */}
            <div>
              <label className={labelClass}>Imagen Banner</label>
              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenHero')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {archivos.imagenHero && <img src={URL.createObjectURL(archivos.imagenHero)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                <div className="z-10 flex flex-col items-center pointer-events-none"><ImageIcon className="h-8 w-8 mb-2 text-white" /><span className="text-sm font-medium text-white">Subir Banner</span></div>
              </div>
            </div>
            {/* Video */}
            <div className="border-t border-gray-800 pt-4">
              <label className={labelClass}>Video de Muestra</label>
              <div className="relative w-full h-24 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] group cursor-pointer">
                <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'videoMuestra')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <Film className={`h-6 w-6 mb-2 ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium px-4 truncate w-full text-center ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`}>{archivos.videoMuestra ? archivos.videoMuestra.name : 'Video promocional'}</span>
              </div>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting || estadoSubida !== 'IDLE'} className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform shadow-lg disabled:opacity-70 uppercase">
            {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Procesando...</> : <><Save className="w-6 h-6" /> Guardar Disciplina</>}
          </button>
        </div>
      </form>
    </div>
  );
};