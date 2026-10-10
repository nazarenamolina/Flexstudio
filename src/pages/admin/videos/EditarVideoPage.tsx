import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Loader2, Library, Trash2, Film, X } from 'lucide-react';
import { useSubidasStore } from '../../../store/subidasStore';
import { useEditarVideo } from '../../../hooks/useEditarVideo';
import { GaleriaModal } from '../../../components/GaleriaModal';

export const EditarVideoPage = () => {
  const { register, handleSubmit, errors, isSubmitting, cargando, categorias, archivoImagen, imagenActual, handleImageChange, handleSelectFromGallery, handleEliminarMiniaturaNueva, navigate, archivoVideo, handleVideoChange, quitarArchivoVideo, estado } = useEditarVideo();
  const { id } = useParams();
  const subidaEnCurso = useSubidasStore((s) => s.subidas.some((x) => x.idVideo === id && (x.estado === 'subiendo' || x.estado === 'pausada')));
  const [isGaleriaOpen, setIsGaleriaOpen] = useState(false);
  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-gray-400 mb-2";
  const getPreviewUrl = (archivoNuevo: File | string | null, fotoActual: string) => {
    if (archivoNuevo) {
      return typeof archivoNuevo === 'string' ? archivoNuevo : URL.createObjectURL(archivoNuevo);
    }
    return fotoActual;
  };

  if (cargando) {
    return <div className="w-full h-full flex items-center justify-center text-[#d7f250]"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  }

  return (
    <div className="w-full h-full flex flex-col font-sans overflow-y-auto custom-scrollbar pr-2 pb-10">

      {/* 👇 Modal de Galería */}
      <GaleriaModal
        isOpen={isGaleriaOpen}
        onClose={() => setIsGaleriaOpen(false)}
        onSelectImagen={(url) => handleSelectFromGallery(url)}
      />
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button aria-label="Volver a videos" title="Volver a videos" onClick={() => navigate('/admin/videos')} type="button" disabled={isSubmitting} className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors disabled:opacity-50">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Editar Clase</h1>
          <p className="text-gray-400 text-sm">Modificá los detalles, la miniatura o el archivo del video.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
        {/* COLUMNA IZQUIERDA: Textos */}
        <div className="flex-1 space-y-6 bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-4">Detalles de la Clase</h3>

          <div>
            <label className={labelClass}>Título del Video *</label>
            <input type="text" {...register('titulo', { required: 'Obligatorio' })} className={inputClass} />
            {errors.titulo && <span className="text-red-500 text-xs mt-1">{errors.titulo.message}</span>}
          </div>
          <div>
            <label className={labelClass}>Descripción / Resumen de la Clase</label>
            <textarea
              {...register('descripcion')}
              rows={4}
              placeholder="Ej: En esta clase aprenderemos los fundamentos..."
              className={`${inputClass} resize-none scrollbar-hide`}
            />
          </div>
          <div>
            <label className={labelClass}>Categoría / Disciplina *</label>
            <select {...register('idCategoria', { required: 'Obligatorio' })} className={`${inputClass} appearance-none cursor-pointer`}>
              <option value="" disabled>Selecciona una categoría...</option>
              {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.titulo}</option>)}
            </select>
            {errors.idCategoria && <span className="text-red-500 text-xs mt-1">{errors.idCategoria.message}</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>N° de Orden</label>
              <input type="number" {...register('orden')} min="1" className={inputClass} />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Imagen */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Miniatura</h3>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-400">Imagen de Portada</label>
                <button
                  type="button"
                  onClick={() => setIsGaleriaOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-[#d7f250] hover:text-white transition-colors"
                >
                  <Library size={14} /> Galería
                </button>
              </div>

              <div className="relative w-full h-40 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />

                {(archivoImagen || imagenActual) && (
                  <>
                    <img src={getPreviewUrl(archivoImagen, imagenActual)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />

                    {/* Botón para quitar la miniatura NUEVA seleccionada */}
                    {archivoImagen && (
                      <button aria-label="Deshacer la miniatura elegida"
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEliminarMiniaturaNueva(); }}
                        className="absolute top-2 right-2 z-30 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Deshacer selección"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </>
                )}

                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className="h-8 w-8 mb-2 text-white" />
                  <span className="text-sm font-medium text-white shadow-black drop-shadow-md">Cambiar Portada</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Recomendado: 1920x1080px (16:9)</p>
            </div>
          </div>
          {/* Reemplazar el archivo: se sube en segundo plano y las alumnas ven el actual hasta que el nuevo esté listo. */}
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Archivo del video</h3>
            {subidaEnCurso ? (
              <p className="text-sm text-[#d7f250]">Hay una subida en curso para este video. Mirá el progreso en el panel de subidas.</p>
            ) : archivoVideo ? (
              <div className="flex items-center gap-3 rounded-xl bg-[#0a0a0a] border border-[#d7f250]/40 p-3">
                <Film className="w-5 h-5 text-[#d7f250] shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-bold truncate" title={archivoVideo.name}>{archivoVideo.name}</p>
                  <p className="text-xs text-gray-500">{(archivoVideo.size / (1024 * 1024)).toFixed(1)} MB · se sube al guardar</p>
                </div>
                <button type="button" onClick={quitarArchivoVideo} aria-label="No reemplazar el archivo" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="relative w-full h-28 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center gap-2 transition-colors bg-[#0a0a0a] cursor-pointer focus-within:border-[#d7f250]">
                <input type="file" accept="video/*" onChange={handleVideoChange} className="sr-only" />
                <Film className="h-7 w-7 text-white" aria-hidden="true" />
                <span className="text-sm font-medium text-white">{estado === 'ERROR' ? 'Subir el archivo de nuevo' : 'Reemplazar archivo'}</span>
              </label>
            )}
            <p className="text-xs text-gray-500 leading-relaxed">
              Mientras Mux procesa el archivo nuevo, las alumnas siguen viendo el actual. Su progreso en la clase se conserva.
              Ocupa un lugar más del plan de Mux hasta que termina; después se borra el anterior.
            </p>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 shadow-lg disabled:opacity-70 uppercase tracking-widest">
            {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</> : <><Save className="w-6 h-6" /> Guardar Cambios</>}
          </button>
        </div>
      </form>
    </div>
  );
};