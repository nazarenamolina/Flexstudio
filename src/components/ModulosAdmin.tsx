import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Edit2, Loader2, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { actualizarModuloRequest, crearModuloRequest, eliminarModuloRequest, type DatosModulo } from '../api/modulos';
import { mensajeDeError } from '../api/errores';
import { formatearPrecio } from '../precios';
import { nombreModulo, type ModuloPublico } from '../modulos';
import { CamposPrecio } from './CamposPrecio';
import { ConfirmarEliminarModal } from './ConfirmarEliminarModal';

interface Props {
  idCategoria: string;
  modulos: ModuloPublico[];
}

interface FormModulo {
  numero: number | string;
  titulo: string;
  descripcion: string;
  precioArs: number | string;
  precioUsd: number | string;
}

const labelClass = 'block text-sm font-bold text-gray-400 mb-2';
const inputClass = 'w-full bg-[#131313]/40 border border-gray-400 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm';

/** Alta, edición y baja de los meses de una categoría. Se guarda aparte del formulario de la categoría. */
export const ModulosAdmin = ({ idCategoria, modulos }: Props) => {
  const queryClient = useQueryClient();
  // null: formulario cerrado. 'nuevo' o el mes que se está editando.
  const [editando, setEditando] = useState<ModuloPublico | 'nuevo' | null>(null);
  const [aBorrar, setABorrar] = useState<ModuloPublico | null>(null);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormModulo>();

  const refrescar = () => {
    queryClient.invalidateQueries({ queryKey: ['categoria', idCategoria] });
    queryClient.invalidateQueries({ queryKey: ['categorias'] });
    queryClient.invalidateQueries({ queryKey: ['estados-modulos'] });
  };

  const abrir = (modulo: ModuloPublico | 'nuevo') => {
    const siguiente = Math.max(0, ...modulos.map((m) => m.numero)) + 1;
    reset(modulo === 'nuevo'
      ? { numero: siguiente, titulo: '', descripcion: '', precioArs: '', precioUsd: '' }
      : {
          numero: modulo.numero,
          titulo: modulo.titulo ?? '',
          descripcion: modulo.descripcion ?? '',
          precioArs: Number(modulo.precioArs) || '',
          precioUsd: Number(modulo.precioUsd) || '',
        });
    setEditando(modulo);
  };

  const guardar = useMutation({
    mutationFn: (datos: DatosModulo) => (editando === 'nuevo'
      ? crearModuloRequest({ ...datos, idCategoria })
      : actualizarModuloRequest((editando as ModuloPublico).id, datos)),
    onSuccess: () => {
      toast.success(editando === 'nuevo' ? 'Mes creado' : 'Mes actualizado');
      setEditando(null);
      refrescar();
    },
    onError: (error) => toast.error(mensajeDeError(error, 'No se pudo guardar el mes.')),
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => eliminarModuloRequest(id),
    onSuccess: () => {
      toast.success('Mes dado de baja');
      setABorrar(null);
      refrescar();
    },
    onError: (error) => {
      toast.error(mensajeDeError(error, 'No se pudo dar de baja el mes.'), { duration: 7000 });
      setABorrar(null);
    },
  });

  const enviar = (datos: FormModulo) => guardar.mutate({
    numero: Number(datos.numero),
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    precioArs: Number(datos.precioArs) || 0,
    precioUsd: Number(datos.precioUsd) || 0,
  });

  return (
    <section className="bg-[#1a1a1a] p-6 md:p-8 rounded-[24px] border border-neutral-800 shadow-sm mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><CalendarDays className="text-[#d7f250]" size={22} /> Meses</h3>
          <p className="text-gray-400 text-sm mt-1">Cada mes tiene su precio y se guarda al instante. Un mes sin videos listos no se vende.</p>
        </div>
        {editando === null && (
          <button type="button" onClick={() => abrir('nuevo')} className="flex items-center gap-2 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] text-xs font-black uppercase tracking-widest px-4 py-3 rounded-full transition-colors cursor-pointer">
            <Plus size={16} /> Agregar mes
          </button>
        )}
      </div>

      {modulos.length === 0 ? (
        <p className="text-gray-400 text-sm">Esta categoría todavía no tiene meses.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {modulos.map((modulo) => (
            <li key={modulo.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131313] border-l-4 border-[#d7f250] rounded-xl p-4">
              <div className="min-w-0">
                <p className="text-white font-bold">{nombreModulo(modulo)}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {Number(modulo.precioArs) > 0 ? formatearPrecio(Number(modulo.precioArs), 'ARS') : 'Sin precio en pesos'}
                  {' · '}
                  {Number(modulo.precioUsd) > 0 ? formatearPrecio(Number(modulo.precioUsd), 'USD') : 'Sin precio en dólares'}
                  {' · '}
                  {modulo.cantidadVideos} {modulo.cantidadVideos === 1 ? 'video listo' : 'videos listos'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" aria-label={`Editar ${nombreModulo(modulo)}`} title={`Editar ${nombreModulo(modulo)}`} onClick={() => abrir(modulo)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-black hover:bg-[#d7f250] hover:border-[#d7f250] transition-all cursor-pointer">
                  <Edit2 size={14} />
                </button>
                <button type="button" aria-label={`Dar de baja ${nombreModulo(modulo)}`} title={`Dar de baja ${nombreModulo(modulo)}`} onClick={() => setABorrar(modulo)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-red-500/90 hover:border-red-500 transition-all cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editando !== null && (
        <form onSubmit={handleSubmit(enviar)} noValidate className="mt-6 rounded-xl border border-neutral-700 p-5">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-white font-bold">{editando === 'nuevo' ? 'Nuevo mes' : `Editar ${nombreModulo(editando)}`}</h4>
            <button type="button" aria-label="Cerrar sin guardar" title="Cerrar sin guardar" onClick={() => setEditando(null)} className="text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="modulo-numero" className={labelClass}>Número de mes *</label>
              <input
                id="modulo-numero"
                type="number"
                min={1}
                aria-invalid={!!errors.numero}
                {...register('numero', { required: 'El número es obligatorio', min: { value: 1, message: 'Tiene que ser 1 o mayor' }, max: { value: 120, message: 'Es demasiado alto' } })}
                className={inputClass}
              />
              {errors.numero && <p role="alert" className="text-red-400 text-xs mt-1.5">{errors.numero.message}</p>}
            </div>
            <div>
              <label htmlFor="modulo-titulo" className={labelClass}>Título (opcional)</label>
              <input id="modulo-titulo" type="text" maxLength={150} placeholder="Ej: Fundamentos" {...register('titulo')} className={inputClass} />
            </div>
            <CamposPrecio register={register} control={control} errors={errors} labelClass={labelClass} inputClass={inputClass} />
          </div>

          <div className="mb-6">
            <label htmlFor="modulo-descripcion" className={labelClass}>Descripción (opcional)</label>
            <textarea id="modulo-descripcion" rows={3} maxLength={5000} placeholder="Qué se trabaja este mes..." {...register('descripcion')} className={`${inputClass} resize-none scrollbar-hide`} />
          </div>

          <button type="submit" disabled={guardar.isPending} className="flex items-center gap-2 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] text-xs font-black uppercase tracking-widest px-5 py-3 rounded-full transition-colors disabled:opacity-60 cursor-pointer">
            {guardar.isPending && <Loader2 size={16} className="animate-spin" />} Guardar mes
          </button>
        </form>
      )}

      <ConfirmarEliminarModal
        isOpen={!!aBorrar}
        onClose={() => !eliminar.isPending && setABorrar(null)}
        onConfirm={() => aBorrar && eliminar.mutate(aBorrar.id)}
        tituloItem={aBorrar ? nombreModulo(aBorrar) : ''}
        estaEliminando={eliminar.isPending}
        titulo="Dar de baja el mes"
        textoConfirmar="Sí, dar de baja"
        mensaje={
          <>
            <strong className="text-white">"{aBorrar && nombreModulo(aBorrar)}"</strong> deja de venderse. Quienes lo compraron lo siguen viendo hasta que venza. Tiene que estar sin videos: movelos a otro mes o borralos antes.
          </>
        }
      />
    </section>
  );
};
