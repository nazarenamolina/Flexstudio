import { useState } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, Loader2, Film, CloudUpload, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useEditarCategoria } from '../../../hooks/useEditarCategoria';
import { Controller } from 'react-hook-form';
import { IconPicker } from '../../../components/IconPicker';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal';

export const EditarCategoriaPage = () => {
  const { register, handleSubmit, errors, isSubmitting, cargandoDatos, estadoSubida, progreso, archivos, imagenesActuales, handleFileChange, handleEliminarMultimedia, watch, navigate, beneficiosFields, appendBeneficio, removeBeneficio, control } = useEditarCategoria();

  const [itemAEliminar, setItemAEliminar] = useState<{
    tipo: 'hero' | 'tarjeta' | 'video' | 'beneficio' | null;
    indexBeneficio?: number;
    tituloMostrar: string;
  } | null>(null);

  const labelClass = "block text-sm font-bold text-gray-400 mb-2";
  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";

  if (cargandoDatos) {
    return <div className="w-full h-full flex items-center justify-center text-[#d7f250]"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  }

  const descCard = watch('descripcionCard') || '';
  const descBreve = watch('descripcionBreve') || '';

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

  // 👇 Aquí arreglamos el error de TypeScript asegurándonos de que 'tipo' exista
  const confirmarEliminacion = () => {
    if (!itemAEliminar || !itemAEliminar.tipo) {
      setItemAEliminar(null);
      return;
    }

    if (itemAEliminar.tipo === 'beneficio') {
      if (itemAEliminar.indexBeneficio !== undefined) {
        removeBeneficio(itemAEliminar.indexBeneficio);
      }
    } else {
      // Como ya descartamos 'beneficio' y 'null', TS sabe que es hero, tarjeta o video
      handleEliminarMultimedia(itemAEliminar.tipo);
    }

    setItemAEliminar(null);
  };

  return (
    <div className="w-full h-full flex flex-col font-sans overflow-y-auto custom-scrollbar pr-2 pb-10">

      <ConfirmarEliminarModal
        isOpen={!!itemAEliminar}
        onClose={() => setItemAEliminar(null)}
        onConfirm={confirmarEliminacion}
        tituloItem={itemAEliminar?.tituloMostrar || ''}
        estaEliminando={false}
      />

      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={() => navigate('/admin/categorias')} type="button" disabled={isSubmitting} className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors disabled:opacity-50"><ArrowLeft size={24} /></button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Editar Disciplina</h1>
          <p className="text-gray-400 text-sm">Modifica los datos y beneficios de la categoría.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-6">

          <div className="bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Sección Banner</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClass}>Título *</label>
                <input type="text" {...register('titulo', { required: 'Obligatorio' })} className={inputClass} />
                {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>}
              </div>
              {/* PRECIO ARGENTINA */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Precio (ARS) *</label>
                <input
                  type="number"
                  {...register('precioArs')}
                  className="w-full bg-transparent border border-[#d7f250] rounded-md px-3 py-2 text-white"
                />
              </div>

              {/* PRECIO INTERNACIONAL */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Precio (USD) *</label>
                <input
                  type="number"
                  {...register('precioUsd')}
                  className="w-full bg-transparent border border-[#d7f250] rounded-md px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Descripción Tarjeta (Miniatura)</label>
              <textarea rows={2} maxLength={255} {...register('descripcionCard')} placeholder="Breve descripción para la tarjeta..." className={`${inputClass} resize-none`} />
              <div className="text-right mt-1">
                <span className={`text-xs font-bold ${descCard.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                  {descCard.length} / 255
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Descripción Detallada (Banner Principal)</label>
              <textarea rows={4} {...register('descripcionDetallada')} placeholder="Texto largo que acompaña al video hero..." className={`${inputClass} resize-none`} />
            </div>
          </div>

          <div className="bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Sección Beneficios</h3>

            <div className="mb-8">
              <label className={labelClass}>Descripción de Suscripción</label>
              <textarea rows={2} maxLength={255} {...register('descripcionBreve')} placeholder="Ej: Únete a esta suscripción y obtén acceso a..." className={`${inputClass} resize-none`} />
              <div className="text-right mt-1">
                <span className={`text-xs font-bold ${descBreve.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                  {descBreve.length} / 255
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>Lista de Beneficios</label>
              {beneficiosFields.map((field, index) => (
                <div key={field.id} className="relative p-5 bg-[#0a0a0a] border border-gray-800 rounded-xl flex flex-col md:flex-row gap-4 group">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        Ícono del beneficio
                      </label>
                      <Controller
                        control={control}
                        name={`beneficios.${index}.icono`}
                        defaultValue="CheckCircle"
                        render={({ field }) => (
                          <IconPicker value={field.value || 'CheckCircle'} onChange={field.onChange} />
                        )}
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-800 mt-2">
                      <input
                        type="text"
                        {...register(`beneficios.${index}.titulo`)}
                        placeholder="Título del beneficio (Ej: Clases en vivo)"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        {...register(`beneficios.${index}.descripcion`)}
                        placeholder="Descripción del beneficio..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setItemAEliminar({ tipo: 'beneficio', indexBeneficio: index, tituloMostrar: 'este beneficio' })}
                    className="md:self-start p-3 text-gray-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors border border-gray-800 hover:border-red-500 bg-[#131313]"
                    title="Eliminar beneficio"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => appendBeneficio({ titulo: '', descripcion: '', icono: 'CheckCircle' })} className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-[#d7f250] text-gray-400 hover:text-[#d7f250] rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"><Plus size={20} /> Agregar un Beneficio</button>
            </div>
          </div>

        </div>

        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Archivos Multimedia</h3>

            <div>
              <label className={labelClass}>Imagen Tarjeta</label>
              <div className="relative w-full h-40 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenTarjeta')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                {(archivos.imagenTarjeta || imagenesActuales.imagenTarjeta) && (
                  <>
                    <img src={archivos.imagenTarjeta ? URL.createObjectURL(archivos.imagenTarjeta) : imagenesActuales.imagenTarjeta} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemAEliminar({ tipo: 'tarjeta', tituloMostrar: 'la Imagen de Tarjeta' }); }}
                      className="absolute top-2 right-2 z-30 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                <div className="z-0 flex flex-col items-center pointer-events-none">
                  <ImageIcon className="h-8 w-8 mb-2 text-white" />
                  <span className="text-sm font-medium text-white shadow-black drop-shadow-md">Cambiar Imagen</span>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Imagen Hero</label>
              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagenHero')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                {(archivos.imagenHero || imagenesActuales.imagenHero) && (
                  <>
                    <img src={archivos.imagenHero ? URL.createObjectURL(archivos.imagenHero) : imagenesActuales.imagenHero} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemAEliminar({ tipo: 'hero', tituloMostrar: 'la Imagen Hero' }); }}
                      className="absolute top-2 right-2 z-30 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                <div className="z-0 flex flex-col items-center pointer-events-none">
                  <ImageIcon className="h-8 w-8 mb-2 text-white" />
                  <span className="text-sm font-medium text-white shadow-black drop-shadow-md">Cambiar Banner</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <label className={labelClass}>Video de Muestra</label>
              {imagenesActuales.tieneVideo && !archivos.videoMuestra && (
                <p className="text-xs text-[#d7f250] mb-2 font-bold">✓ Esta disciplina ya tiene un video.</p>
              )}
              <div className="relative w-full h-24 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] group cursor-pointer">
                <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'videoMuestra')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                {(imagenesActuales.tieneVideo || archivos.videoMuestra) && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemAEliminar({ tipo: 'video', tituloMostrar: 'el Video de Muestra' }); }}
                    className="absolute top-2 right-2 z-30 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <Film className={`h-6 w-6 mb-2 ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium px-4 truncate w-full text-center ${archivos.videoMuestra ? 'text-[#d7f250]' : 'text-gray-500'}`}>
                  {archivos.videoMuestra ? archivos.videoMuestra.name : 'Subir o reemplazar video'}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting || estadoSubida !== 'IDLE'} className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 shadow-lg disabled:opacity-70 disabled:hover:translate-y-0 uppercase tracking-widest">
            {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</> : <><Save className="w-6 h-6" /> Guardar Cambios</>}
          </button>
        </div>
      </form>
    </div>
  );
};