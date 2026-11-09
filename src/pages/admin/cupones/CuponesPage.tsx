import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2, Loader2, Pause, Play, Plus, Tag, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  actualizarCuponRequest, crearCuponRequest, eliminarCuponRequest, obtenerCuponesRequest,
  type Cupon, type DatosCupon, type TipoCupon,
} from '../../../api/cupones';
import { mensajeDeError } from '../../../api/errores';
import { useCategoriasPublicas } from '../../../hooks/useCategoriasPublicas';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal';
import { ErrorCargaAdmin } from '../../../components/ErrorCargaAdmin';
import { formatearPrecio } from '../../../precios';
import { tituloVisible } from '../../../titulos';

const ZONA = 'America/Argentina/Buenos_Aires';
const PORCENTAJE_MAXIMO = 90;
const claveCupones = ['cupones'] as const;

const labelClass = 'block text-sm font-bold text-gray-400 mb-2';
const inputClass = 'w-full bg-[#131313]/40 border border-gray-400 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm';

interface FormCupon {
  codigo: string;
  tipo: TipoCupon;
  porcentaje: number | string;
  montoArs: number | string;
  montoUsd: number | string;
  fechaInicio: string;
  fechaFin: string;
  maximoUsos: number | string;
  usosPorPersona: number | string;
  aplicaATodo: 'si' | 'no';
  idsCategorias: string[];
}

// AAAA-MM-DD en hora argentina, que es como lo espera el campo de fecha y el back.
const aFechaDeCampo = (fecha: string | null) => (fecha ? new Date(fecha).toLocaleDateString('en-CA', { timeZone: ZONA }) : '');
const aFechaVisible = (fecha: string) => new Date(fecha).toLocaleDateString('es-AR', { timeZone: ZONA });

const estadoDe = (cupon: Cupon): { texto: string; clase: string } => {
  const ahora = Date.now();
  if (!cupon.activo) return { texto: 'Pausado', clase: 'bg-white/10 text-gray-300' };
  if (cupon.fechaFin && new Date(cupon.fechaFin).getTime() < ahora) return { texto: 'Vencido', clase: 'bg-red-500/20 text-red-300' };
  if (cupon.maximoUsos !== null && cupon.usos >= cupon.maximoUsos) return { texto: 'Agotado', clase: 'bg-red-500/20 text-red-300' };
  if (cupon.fechaInicio && new Date(cupon.fechaInicio).getTime() > ahora) return { texto: 'Programado', clase: 'bg-amber-500/20 text-amber-300' };
  return { texto: 'Vigente', clase: 'bg-[#d7f250]/20 text-[#d7f250]' };
};

const descuentoDe = (cupon: Cupon) => {
  if (cupon.tipo === 'PORCENTAJE') return `${cupon.porcentaje}%`;
  return [
    Number(cupon.montoArs) > 0 ? formatearPrecio(Number(cupon.montoArs), 'ARS') : null,
    Number(cupon.montoUsd) > 0 ? formatearPrecio(Number(cupon.montoUsd), 'USD') : null,
  ].filter(Boolean).join(' / ');
};

const vigenciaDe = (cupon: Cupon) => {
  if (cupon.fechaInicio && cupon.fechaFin) return `Del ${aFechaVisible(cupon.fechaInicio)} al ${aFechaVisible(cupon.fechaFin)}`;
  if (cupon.fechaFin) return `Hasta el ${aFechaVisible(cupon.fechaFin)}`;
  if (cupon.fechaInicio) return `Desde el ${aFechaVisible(cupon.fechaInicio)}`;
  return 'Sin fecha de vencimiento';
};

const usosDe = (cupon: Cupon) => {
  const total = cupon.maximoUsos === null
    ? `${cupon.usos} ${cupon.usos === 1 ? 'compra' : 'compras'}, sin límite`
    : `${cupon.usos} de ${cupon.maximoUsos} ${cupon.maximoUsos === 1 ? 'uso' : 'usos'}`;
  if (cupon.usosPorPersona === null) return total;
  return `${total} · ${cupon.usosPorPersona === 1 ? 'una vez' : `hasta ${cupon.usosPorPersona} veces`} por persona`;
};

export const CuponesPage = () => {
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState<Cupon | 'nuevo' | null>(null);
  const [aBorrar, setABorrar] = useState<Cupon | null>(null);
  const { data: cupones = [], isPending, isLoadingError, isFetching, refetch } = useQuery({
    queryKey: claveCupones,
    queryFn: obtenerCuponesRequest,
  });
  const { data: categorias = [] } = useCategoriasPublicas();
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormCupon>();
  const tipo = useWatch({ control, name: 'tipo' });
  const aplicaATodo = useWatch({ control, name: 'aplicaATodo' });

  const refrescar = () => queryClient.invalidateQueries({ queryKey: claveCupones });

  const abrir = (cupon: Cupon | 'nuevo') => {
    reset(cupon === 'nuevo'
      ? { codigo: '', tipo: 'PORCENTAJE', porcentaje: '', montoArs: '', montoUsd: '', fechaInicio: '', fechaFin: '', maximoUsos: '', usosPorPersona: '', aplicaATodo: 'si', idsCategorias: [] }
      : {
          codigo: cupon.codigo,
          tipo: cupon.tipo,
          porcentaje: cupon.porcentaje ?? '',
          montoArs: Number(cupon.montoArs) || '',
          montoUsd: Number(cupon.montoUsd) || '',
          fechaInicio: aFechaDeCampo(cupon.fechaInicio),
          fechaFin: aFechaDeCampo(cupon.fechaFin),
          maximoUsos: cupon.maximoUsos ?? '',
          usosPorPersona: cupon.usosPorPersona ?? '',
          aplicaATodo: cupon.aplicaATodo ? 'si' : 'no',
          idsCategorias: cupon.categorias.map((c) => c.id),
        });
    setEditando(cupon);
  };

  const guardar = useMutation({
    mutationFn: (datos: DatosCupon) => (editando === 'nuevo'
      ? crearCuponRequest(datos)
      : actualizarCuponRequest((editando as Cupon).id, datos)),
    onSuccess: () => {
      toast.success(editando === 'nuevo' ? 'Cupón creado' : 'Cupón actualizado');
      setEditando(null);
      refrescar();
    },
    onError: (error) => toast.error(mensajeDeError(error, 'No se pudo guardar el cupón.'), { duration: 7000 }),
  });

  const cambiarActivo = useMutation({
    mutationFn: (cupon: Cupon) => actualizarCuponRequest(cupon.id, { activo: !cupon.activo }),
    onSuccess: refrescar,
    onError: (error) => toast.error(mensajeDeError(error, 'No se pudo cambiar el cupón.')),
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => eliminarCuponRequest(id),
    onSuccess: () => {
      toast.success('Cupón eliminado');
      setABorrar(null);
      refrescar();
    },
    onError: (error) => {
      toast.error(mensajeDeError(error, 'No se pudo eliminar el cupón.'));
      setABorrar(null);
    },
  });

  const enviar = (datos: FormCupon) => guardar.mutate({
    codigo: datos.codigo.trim(),
    tipo: datos.tipo,
    porcentaje: datos.tipo === 'PORCENTAJE' ? Number(datos.porcentaje) : null,
    montoArs: datos.tipo === 'MONTO_FIJO' ? Number(datos.montoArs) || 0 : null,
    montoUsd: datos.tipo === 'MONTO_FIJO' ? Number(datos.montoUsd) || 0 : null,
    fechaInicio: datos.fechaInicio || null,
    fechaFin: datos.fechaFin || null,
    maximoUsos: datos.maximoUsos === '' ? null : Number(datos.maximoUsos),
    usosPorPersona: datos.usosPorPersona === '' ? null : Number(datos.usosPorPersona),
    aplicaATodo: datos.aplicaATodo === 'si',
    idsCategorias: datos.aplicaATodo === 'si' ? [] : datos.idsCategorias,
  });

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 font-principal text-3xl font-black text-white md:text-5xl">
            <Tag className="h-8 w-8 shrink-0 text-[#d7f250] md:h-10 md:w-10" />
            <span className="mt-1 leading-none">Cupones</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
            Se aplican en el último paso de la compra. El descuento nunca supera el {PORCENTAJE_MAXIMO}% del precio, para que siempre pase por la pasarela de pago.
          </p>
        </div>
        {editando === null && (
          <button type="button" onClick={() => abrir('nuevo')} className="flex items-center gap-2 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] text-xs font-black uppercase tracking-widest px-4 py-3 rounded-full transition-colors cursor-pointer">
            <Plus size={16} /> Nuevo cupón
          </button>
        )}
      </div>

      {editando !== null && (
        <form onSubmit={handleSubmit(enviar)} noValidate className="mt-6 rounded-2xl border border-neutral-700 bg-[#1a1a1a] p-5 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-lg">{editando === 'nuevo' ? 'Nuevo cupón' : `Editar ${editando.codigo}`}</h2>
            <button type="button" aria-label="Cerrar sin guardar" title="Cerrar sin guardar" onClick={() => setEditando(null)} className="text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="cupon-codigo" className={labelClass}>Código *</label>
              <input
                id="cupon-codigo"
                type="text"
                maxLength={30}
                placeholder="Ej: BIENVENIDA20"
                aria-invalid={!!errors.codigo}
                {...register('codigo', {
                  required: 'El código es obligatorio',
                  pattern: { value: /^\s*[A-Za-z0-9_-]{3,30}\s*$/, message: 'De 3 a 30 letras, números o guiones, sin espacios' },
                })}
                className={`${inputClass} uppercase placeholder:normal-case`}
              />
              {errors.codigo && <p role="alert" className="text-red-400 text-xs mt-1.5">{errors.codigo.message}</p>}
            </div>
            <div>
              <label htmlFor="cupon-tipo" className={labelClass}>Tipo de descuento</label>
              <select id="cupon-tipo" {...register('tipo')} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="PORCENTAJE" className="bg-[#131313]">Porcentaje</option>
                <option value="MONTO_FIJO" className="bg-[#131313]">Monto fijo</option>
              </select>
            </div>

            {tipo === 'PORCENTAJE' ? (
              <div>
                <label htmlFor="cupon-porcentaje" className={labelClass}>Porcentaje *</label>
                <input
                  id="cupon-porcentaje"
                  type="number"
                  min={1}
                  max={PORCENTAJE_MAXIMO}
                  step={1}
                  placeholder="Ej: 20"
                  aria-invalid={!!errors.porcentaje}
                  {...register('porcentaje', {
                    required: 'Indicá el porcentaje',
                    min: { value: 1, message: 'Tiene que ser de al menos 1%' },
                    max: { value: PORCENTAJE_MAXIMO, message: `No puede superar el ${PORCENTAJE_MAXIMO}%` },
                    validate: (v) => Number.isInteger(Number(v)) || 'Tiene que ser un número entero',
                  })}
                  className={inputClass}
                />
                {errors.porcentaje && <p role="alert" className="text-red-400 text-xs mt-1.5">{errors.porcentaje.message}</p>}
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="cupon-ars" className={labelClass}>Descuento en pesos</label>
                  <input
                    id="cupon-ars"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Ej: 5000"
                    aria-invalid={!!errors.montoArs}
                    {...register('montoArs', {
                      min: { value: 0, message: 'No puede ser negativo' },
                      validate: (_v, valores) => Number(valores.montoArs) > 0 || Number(valores.montoUsd) > 0 || 'Poné el monto en al menos una moneda',
                    })}
                    className={inputClass}
                  />
                  {errors.montoArs && <p role="alert" className="text-red-400 text-xs mt-1.5">{errors.montoArs.message}</p>}
                </div>
                <div>
                  <label htmlFor="cupon-usd" className={labelClass}>Descuento en dólares</label>
                  <input id="cupon-usd" type="number" min={0} step="0.01" placeholder="Ej: 5" {...register('montoUsd', { min: { value: 0, message: 'No puede ser negativo' } })} className={inputClass} />
                  <p className="text-gray-500 text-xs mt-1.5">Sin monto en una moneda, el cupón no vale para esa moneda.</p>
                </div>
              </>
            )}

            <div>
              <label htmlFor="cupon-inicio" className={labelClass}>Válido desde (opcional)</label>
              <input id="cupon-inicio" type="date" {...register('fechaInicio')} className={`${inputClass} [color-scheme:dark]`} />
            </div>
            <div>
              <label htmlFor="cupon-fin" className={labelClass}>Válido hasta (opcional)</label>
              <input
                id="cupon-fin"
                type="date"
                aria-invalid={!!errors.fechaFin}
                {...register('fechaFin', { validate: (v, valores) => !v || !valores.fechaInicio || v >= valores.fechaInicio || 'No puede ser anterior a la fecha de inicio' })}
                className={`${inputClass} [color-scheme:dark]`}
              />
              {errors.fechaFin && <p role="alert" className="text-red-400 text-xs mt-1.5">{errors.fechaFin.message}</p>}
              <p className="text-gray-500 text-xs mt-1.5">Para una temporada, completá las dos fechas. Sin fechas, no vence.</p>
            </div>
            <div>
              <label htmlFor="cupon-usos" className={labelClass}>Máximo de usos (opcional)</label>
              <input
                id="cupon-usos"
                type="number"
                min={1}
                step={1}
                placeholder="Sin límite"
                aria-invalid={!!errors.maximoUsos}
                {...register('maximoUsos', {
                  min: { value: 1, message: 'Tiene que ser de al menos 1' },
                  validate: (v) => v === '' || Number.isInteger(Number(v)) || 'Tiene que ser un número entero',
                })}
                className={inputClass}
              />
              {errors.maximoUsos && <p role="alert" className="text-red-400 text-xs mt-1.5">{errors.maximoUsos.message}</p>}
              <p className="text-gray-500 text-xs mt-1.5">Cuántas compras en total pueden usarlo. Vacío: sin límite. Se puede combinar con las fechas.</p>
            </div>
            <div>
              <label htmlFor="cupon-por-persona" className={labelClass}>Usos por persona (opcional)</label>
              <input
                id="cupon-por-persona"
                type="number"
                min={1}
                step={1}
                placeholder="Sin límite"
                aria-invalid={!!errors.usosPorPersona}
                {...register('usosPorPersona', {
                  min: { value: 1, message: 'Tiene que ser de al menos 1' },
                  validate: (v) => v === '' || Number.isInteger(Number(v)) || 'Tiene que ser un número entero',
                })}
                className={inputClass}
              />
              {errors.usosPorPersona && <p role="alert" className="text-red-400 text-xs mt-1.5">{errors.usosPorPersona.message}</p>}
              <p className="text-gray-500 text-xs mt-1.5">Cuántas veces puede usarlo cada alumna. Con 1, sirve una sola vez por persona (por ejemplo, para una bienvenida). Vacío: sin límite.</p>
            </div>
          </div>

          <fieldset className="mb-6">
            <legend className={labelClass}>Vale para</legend>
            <div className="flex flex-wrap gap-4 text-sm text-white">
              <label className="inline-flex items-center gap-2 cursor-pointer"><input type="radio" value="si" {...register('aplicaATodo')} className="accent-[#d7f250]" /> Todas las clases</label>
              <label className="inline-flex items-center gap-2 cursor-pointer"><input type="radio" value="no" {...register('aplicaATodo')} className="accent-[#d7f250]" /> Clases elegidas</label>
            </div>
            {aplicaATodo === 'no' && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl bg-[#131313] p-4">
                {categorias.map((cat) => (
                  <label key={cat.id} className="inline-flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      value={cat.id}
                      {...register('idsCategorias', { validate: (v, valores) => valores.aplicaATodo === 'si' || (v?.length ?? 0) > 0 || 'Elegí al menos una clase' })}
                      className="h-4 w-4 accent-[#d7f250]"
                    />
                    {tituloVisible(cat.titulo)}
                  </label>
                ))}
                {errors.idsCategorias && <p role="alert" className="text-red-400 text-xs sm:col-span-2">{errors.idsCategorias.message}</p>}
              </div>
            )}
          </fieldset>

          <button type="submit" disabled={guardar.isPending} className="flex items-center gap-2 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] text-xs font-black uppercase tracking-widest px-5 py-3 rounded-full transition-colors disabled:opacity-60 cursor-pointer">
            {guardar.isPending && <Loader2 size={16} className="animate-spin" />} Guardar cupón
          </button>
        </form>
      )}

      <div className="mt-6">
        {isPending ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#d7f250]" /></div>
        ) : isLoadingError ? (
          <ErrorCargaAdmin que="los cupones" onReintentar={() => refetch()} reintentando={isFetching} />
        ) : cupones.length === 0 ? (
          <p className="rounded-2xl border border-white/5 bg-zinc-900/60 p-8 text-center text-gray-400">Todavía no hay cupones.</p>
        ) : (
          <ul className="space-y-3">
            {cupones.map((cupon) => {
              const estado = estadoDe(cupon);
              return (
                <li key={cupon.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-zinc-900/60 p-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-base font-bold text-white break-all">{cupon.codigo}</span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${estado.clase}`}>{estado.texto}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#d7f250]">{descuentoDe(cupon)} de descuento</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {vigenciaDe(cupon)} · {cupon.aplicaATodo ? 'Todas las clases' : cupon.categorias.map((c) => tituloVisible(c.titulo)).join(', ')} · {usosDe(cupon)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" aria-label={`${cupon.activo ? 'Pausar' : 'Activar'} ${cupon.codigo}`} title={cupon.activo ? 'Pausar' : 'Activar'} disabled={cambiarActivo.isPending} onClick={() => cambiarActivo.mutate(cupon)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-black hover:bg-[#d7f250] hover:border-[#d7f250] transition-all cursor-pointer disabled:opacity-50">
                      {cupon.activo ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button type="button" aria-label={`Editar ${cupon.codigo}`} title="Editar" onClick={() => abrir(cupon)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-black hover:bg-[#d7f250] hover:border-[#d7f250] transition-all cursor-pointer">
                      <Edit2 size={14} />
                    </button>
                    {/* Un cupón usado no se borra (perdería su historial): se pausa. */}
                    <button
                      type="button"
                      aria-label={cupon.sePuedeBorrar ? `Eliminar ${cupon.codigo}` : `${cupon.codigo} ya se usó: no se puede eliminar`}
                      title={cupon.sePuedeBorrar ? 'Eliminar' : 'Ya se usó en compras: para frenarlo, pausalo'}
                      disabled={!cupon.sePuedeBorrar}
                      onClick={() => setABorrar(cupon)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-red-500/90 hover:border-red-500 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-white/70"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmarEliminarModal
        isOpen={!!aBorrar}
        onClose={() => !eliminar.isPending && setABorrar(null)}
        onConfirm={() => aBorrar && eliminar.mutate(aBorrar.id)}
        tituloItem={aBorrar?.codigo ?? ''}
        estaEliminando={eliminar.isPending}
        titulo="Eliminar el cupón"
        textoConfirmar="Sí, eliminar"
        mensaje={
          <>
            <strong className="text-white">"{aBorrar?.codigo}"</strong> se borra definitivamente. Nunca se usó en una compra. Si solo querés frenarlo por un tiempo, podés pausarlo.
          </>
        }
      />
    </div>
  );
};
