import { useState } from 'react'; // Importamos useState
import { ArrowLeft, Save, Image as ImageIcon, Loader2, Film, CloudUpload, CheckCircle2, Plus, Trash2, Library } from 'lucide-react';
import { useNuevaCategoria } from '../../../hooks/useNuevaCategoria';
import { Controller } from 'react-hook-form';
import { IconPicker } from '../../../components/IconPicker';
import { ToggleDestacada } from '../../../components/ToggleDestacada';
import { GaleriaModal } from '../../../components/GaleriaModal'; // 👇 Importamos la galería

export const NuevaCategoriaPage = () => {
  const { 
    register, handleSubmit, errors, isSubmitting, estadoSubida, 
    progreso, archivos, handleFileChange, handleSelectFromGallery, 
    handleEliminarMultimedia, watch, navigate, beneficiosFields, 
    appendBeneficio, removeBeneficio, control 
  } = useNuevaCategoria();

  // 👇 Estado para controlar a qué campo va la imagen de la galería
  const [modalGaleriaDestino, setModalGaleriaDestino] = useState<'imagenTarjeta' | 'imagenHero' | null>(null);

  const labelClass = "block text-sm font-bold text-gray-400 mb-2";
  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";
  const descCard = watch('descripcionCard') || '';
  const descBreve = watch('descripcionBreve') || '';

  // 👇 Funciones para renderizar la previsualización correctamente (File o string)
  const getPreviewUrl = (archivo: File | string | null) => {
    if (!archivo) return null;
    return typeof archivo === 'string' ? archivo : URL.createObjectURL(archivo);
  };

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
      
      {/* 👇 Renderizamos el Modal de Galería */}
      <GaleriaModal 
        isOpen={modalGaleriaDestino !== null}
        onClose={() => setModalGaleriaDestino(null)}
        onSelectImagen={(url) => {
          if (modalGaleriaDestino) {
            handleSelectFromGallery(url, modalGaleriaDestino);
          }
        }}
      />

      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={() => navigate('/admin/categorias')} type="button" disabled={isSubmitting} className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors disabled:opacity-50"><ArrowLeft size={24} /></button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Nueva Disciplina</h1>
          <p className="text-gray-400 text-sm">Crea una nueva categoría y sus beneficios.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">

        {/* COLUMNA IZQUIERDA: Textos y Beneficios */}
        <div className="flex-1 space-y-6">
          {/* SECCIÓN 1: BANNER */}
          <div className="bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Sección Banner</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClass}>Título *</label>
                <input type="text" {...register('titulo', { required: 'El título es obligatorio' })} placeholder="Ej: Danza Inicial" className={inputClass} />
                {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Precio (ARS) *</label>
                <input type="number" {...register('precioArs')} className="w-full bg-transparent border border-[#d7f250] rounded-md px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Precio (USD) *</label>
                <input type="number" {...register('precioUsd')} className="w-full bg-transparent border border-[#d7f250] rounded-md px-3 py-2 text-white" />
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Descripción de la Tarjeta de Inicio</label>
              <textarea rows={2} maxLength={255} {...register('descripcionCard')} placeholder="Breve descripción para la tarjeta..." className={`${inputClass} resize-none`} />
              <div className="text-right mt-1">
                <span className={`text-xs font-bold ${descCard.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>{descCard.length} / 255</span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Descripción detallada de la Categoría</label>
              <textarea rows={4} {...register('descripcionDetallada')} placeholder="Con este entrenamiento especializado vas a potenciar tu flexibilidad de forma progresiva y segura..." className={`${inputClass} resize-none`} />
            </div>
          </div>

          {/* SECCIÓN 2: BENEFICIOS Y SUSCRIPCIÓN */}
          <div className="bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Sección Beneficios</h3>

            <div className="mb-8">
              <label className={labelClass}>¿Qué incluye la suscripción?</label>
              <textarea rows={2} maxLength={255} {...register('descripcionBreve')} placeholder="Ej: Únete a esta suscripción y obtén acceso a..." className={`${inputClass} resize-none`} />
              <div className="text-right mt-1">
                <span className={`text-xs font-bold ${descBreve.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>{descBreve.length} / 255</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>Lista de Beneficios</label>

              {beneficiosFields.map((field, index) => (
                <div key={field.id} className="relative p-5 bg-[#0a0a0a] border border-gray-800 rounded-xl flex flex-col md:flex-row gap-4 group">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Ícono del beneficio</label>
                      <Controller
                        control={control}
                        name={`beneficios.${index}.icono`}
                        defaultValue="CheckCircle"
                        render={({ field }) => (
                          <IconPicker value={field.value || 'CheckCircle'} onChange={field.onChange} />
                        )}
                      />
                    </div>
                    <div className="pt-2 border-t border-gray-800">
                      <input type="text" {...register(`beneficios.${index}.titulo`)} placeholder="Título del beneficio" className={inputClass} />
                    </div>
                    <div>
                      <textarea rows={2} {...register(`beneficios.${index}.descripcion`)} placeholder="Descripción del beneficio..." className={`${inputClass} resize-none`} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeBeneficio(index)}
                    className="md:self-start p-3 text-gray-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors border border-gray-800 hover:border-red-500 bg-[#131313]"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => appendBeneficio({ titulo: '', descripcion: '' })}
                className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-[#d7f250] text-gray-400 hover:text-[#d7f250] rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={20} /> Agregar un Beneficio
              </button>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Configuración</h3>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-white mb-1">Clase Destacada</label>
                <p className="text-xs text-gray-400">Se mostrará al principio en la página principal.</p>
              </div>
              <Controller
                control={control}
                name="destacada"
                render={({ field }) => (
                  <ToggleDestacada habilitado={field.value} onChange={field.onChange} deshabilitado={isSubmitting} />
                )}
              />
            </div>
          </div>

          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Archivos Multimedia</h3>
            
            {/* IMAGEN TARJETA */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-400">Imagen de la Tarjeta</label>
                {/* 👇 Botón para abrir la galería */}
                <button 
                  type="button" 
                  onClick={() => setModalGaleriaDestino('imagenTarjeta')}
                  className="flex items-center gap-1 text-xs font-bold text-[#d7f250] hover:text-white transition-colors"
                >
                  <Library size={14} /> Galería
                </button>
              </div>

              <div className="relative w-full h-40 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenTarjeta')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                {archivos.imagenTarjeta && (
                  <>
                    <img src={getPreviewUrl(archivos.imagenTarjeta)!} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEliminarMultimedia('tarjeta'); }}
                      className="absolute top-2 right-2 z-30 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                <div className="z-0 flex flex-col items-center pointer-events-none">
                  <ImageIcon className="h-8 w-8 mb-2 text-white" />
                  <span className="text-sm font-medium text-white shadow-black drop-shadow-md">Subir Imagen</span>
                </div>
              </div>
            </div>

            {/* IMAGEN BANNER (HERO) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-400">Imagen de Categoría</label>
                <button 
                  type="button" 
                  onClick={() => setModalGaleriaDestino('imagenHero')}
                  className="flex items-center gap-1 text-xs font-bold text-[#d7f250] hover:text-white transition-colors"
                >
                  <Library size={14} /> Galería
                </button>
              </div>

              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenHero')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                {archivos.imagenHero && (
                  <>
                    <img src={getPreviewUrl(archivos.imagenHero)!} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEliminarMultimedia('hero'); }}
                      className="absolute top-2 right-2 z-30 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                <div className="z-0 flex flex-col items-center pointer-events-none">
                  <ImageIcon className="h-8 w-8 mb-2 text-white" />
                  <span className="text-sm font-medium text-white shadow-black drop-shadow-md">Subir Banner</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <label className={labelClass}>Video de Muestra</label>
              <div className="relative w-full h-24 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] group cursor-pointer">
                <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'videoMuestra')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                {archivos.videoMuestra && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEliminarMultimedia('video'); }}
                    className="absolute top-2 right-2 z-30 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <Film className={`h-6 w-6 mb-2 ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium px-4 truncate w-full text-center ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`}>
                  {archivos.videoMuestra ? archivos.videoMuestra.name : 'Subir video (Opcional)'}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting || estadoSubida !== 'IDLE'} className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 shadow-lg disabled:opacity-70 disabled:hover:translate-y-0 uppercase tracking-widest">
            {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Creando...</> : <><Save className="w-6 h-6" /> Crear Categoría</>}
          </button>
        </div>
      </form>
    </div>
  );
};