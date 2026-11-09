import { useEffect, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronLeft, ChevronRight, Inbox, Loader2, Search, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  actualizarSolicitudRequest, devolverSolicitudRequest, obtenerSolicitudesRequest, rechazarSolicitudRequest,
  type CompraDeSolicitud, type EstadoSolicitud, type Solicitud,
} from '../../../api/solicitudes';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal';
import { ETIQUETA_MOTIVO, motivoSugerido, textoMotivo, type MotivoRechazo } from './motivosRechazo';
import { mensajeDeError } from '../../../api/errores';
import { ErrorCargaAdmin } from '../../../components/ErrorCargaAdmin';
import { tituloVisible } from '../../../titulos';
import { PagosARevisar } from './PagosARevisar';

const FILTROS: { valor?: EstadoSolicitud; etiqueta: string }[] = [
  { valor: 'PENDIENTE', etiqueta: 'Pendientes' },
  { valor: 'RESUELTA', etiqueta: 'Resueltas' },
  { valor: 'RECHAZADA', etiqueta: 'Rechazadas' },
  { etiqueta: 'Todas' },
];

const COLOR_ESTADO: Record<EstadoSolicitud, string> = {
  PENDIENTE: 'bg-[#d7f250]/20 text-[#d7f250]',
  RESUELTA: 'bg-emerald-500/20 text-emerald-300',
  RECHAZADA: 'bg-red-500/20 text-red-300',
};

const ETIQUETA_ESTADO: Record<EstadoSolicitud, string> = {
  PENDIENTE: 'Pendiente',
  RESUELTA: 'Resuelta',
  RECHAZADA: 'Rechazada',
};

const formatearFecha = (fecha: string) => new Date(fecha).toLocaleString('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Argentina/Buenos_Aires',
});

const MOTIVOS = Object.keys(ETIQUETA_MOTIVO) as MotivoRechazo[];

const montoTexto = (compra: CompraDeSolicitud) => `${compra.moneda} ${compra.monto.toLocaleString('es-AR')}`;

const TarjetaSolicitud = ({ solicitud }: { solicitud: Solicitud }) => {
  const queryClient = useQueryClient();
  const [nota, setNota] = useState(solicitud.notaAdmin ?? '');
  const { compras, cuentaRegistrada } = solicitud.contexto;
  const notaCambio = nota.trim() !== (solicitud.notaAdmin ?? '');
  const pendiente = solicitud.estado === 'PENDIENTE';
  const esArrepentimiento = solicitud.tipo === 'ARREPENTIMIENTO';
  const [compraADevolver, setCompraADevolver] = useState<CompraDeSolicitud | null>(null);
  const [rechazando, setRechazando] = useState(false);
  const [motivo, setMotivo] = useState<MotivoRechazo>('OTRO');
  const [mensaje, setMensaje] = useState('');
  // Las pendientes se muestran abiertas; las resueltas y rechazadas, plegadas en una línea.
  const [abierta, setAbierta] = useState(pendiente);
  const devuelta = compras.find((c) => c.id === solicitud.idCompraDevuelta);
  const resumen = devuelta
    ? `Devuelta: ${devuelta.moneda} ${devuelta.monto.toLocaleString('es-AR')}`
    : solicitud.estado === 'RECHAZADA'
      ? 'Rechazada con motivo enviado'
      : solicitud.respuestaCliente ? 'Resuelta con respuesta enviada' : 'Resuelta sin devolución desde el panel';

  const alTerminar = (texto: string) => {
    queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
    toast.success(texto);
  };

  const mutacion = useMutation({
    mutationFn: (cambios: { estado?: EstadoSolicitud; notaAdmin?: string }) => actualizarSolicitudRequest(solicitud.id, cambios),
    onSuccess: () => alTerminar('Solicitud actualizada'),
    onError: (error) => toast.error(mensajeDeError(error, 'No pudimos actualizar la solicitud.')),
  });

  // La nota se guarda antes de responder: devolver y rechazar no la envían.
  const guardarNotaSiCambio = async () => {
    if (notaCambio) await actualizarSolicitudRequest(solicitud.id, { notaAdmin: nota });
  };

  const devolucion = useMutation({
    mutationFn: async (compra: CompraDeSolicitud) => {
      await guardarNotaSiCambio();
      return devolverSolicitudRequest(solicitud.id, compra.id);
    },
    onSuccess: () => {
      setCompraADevolver(null);
      alTerminar('Pago devuelto. Se quitó el acceso y le avisamos por correo.');
    },
    onError: (error) => toast.error(mensajeDeError(error, 'No pudimos hacer la devolución. La compra no cambió.'), { duration: 8000 }),
  });

  const rechazo = useMutation({
    mutationFn: async () => {
      await guardarNotaSiCambio();
      return rechazarSolicitudRequest(solicitud.id, mensaje);
    },
    onSuccess: () => alTerminar('Solicitud rechazada. Le enviamos el motivo por correo.'),
    onError: (error) => toast.error(mensajeDeError(error, 'No pudimos rechazar la solicitud.')),
  });

  const ocupado = mutacion.isPending || devolucion.isPending || rechazo.isPending;
  const cambiarEstado = (estado: EstadoSolicitud) => mutacion.mutate(notaCambio ? { estado, notaAdmin: nota } : { estado });

  const elegirMotivo = (nuevo: MotivoRechazo) => {
    setMotivo(nuevo);
    setMensaje(textoMotivo(nuevo, solicitud));
  };

  const abrirRechazo = () => {
    elegirMotivo(motivoSugerido(solicitud));
    setRechazando(true);
  };

  const Cabecera = pendiente ? 'div' : 'button';

  return (
    <li className={`rounded-2xl border border-white/5 bg-zinc-900/60 ${abierta ? 'p-5' : 'px-5 py-3'}`}>
      {/* Las resueltas y rechazadas se abren y pliegan tocando cualquier parte de la barra. */}
      <Cabecera
        {...(pendiente ? {} : {
          type: 'button' as const,
          onClick: () => setAbierta((a) => !a),
          'aria-expanded': abierta,
          title: abierta ? 'Plegar' : 'Ver el detalle',
        })}
        className={`flex w-full flex-wrap items-center gap-2 text-left ${pendiente ? '' : 'group -mx-2 cursor-pointer rounded-xl px-2 py-1 transition-colors hover:bg-white/5'}`}
      >
        {!pendiente && (
          <ChevronDown size={18} className={`shrink-0 text-gray-400 transition-transform group-hover:text-white ${abierta ? '' : '-rotate-90'}`} aria-hidden="true" />
        )}
        <span className="font-mono text-sm font-bold text-white">{solicitud.codigo}</span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {solicitud.tipo === 'ARREPENTIMIENTO' ? 'Arrepentimiento' : 'Baja de servicio'}
        </span>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${COLOR_ESTADO[solicitud.estado]}`}>
          {ETIQUETA_ESTADO[solicitud.estado]}
        </span>
        {!abierta && (
          <span className="min-w-0 truncate text-sm text-gray-300">
            <span className="font-semibold text-white">{solicitud.nombre}</span>
            <span className="text-gray-500"> · {solicitud.correo} · </span>
            <span className={devuelta ? 'text-sky-300' : solicitud.estado === 'RECHAZADA' ? 'text-red-300' : 'text-emerald-300'}>{resumen}</span>
          </span>
        )}
        <span className="ml-auto text-xs text-gray-400">{formatearFecha(solicitud.fechaCreacion)}</span>
      </Cabecera>

      {abierta && (
      // En pantallas anchas: el pedido y las compras a la izquierda; la respuesta, la nota y las acciones a la derecha.
      <div className="grid gap-x-8 xl:grid-cols-2">
      <div>
      <div className="mt-4 space-y-1 text-sm text-gray-200">
        <p className="font-bold text-white">{solicitud.nombre}</p>
        <a href={`mailto:${solicitud.correo}?subject=${encodeURIComponent(`Tu solicitud ${solicitud.codigo} - Flex Studio`)}`} className="break-all text-[#d7f250] underline underline-offset-2">{solicitud.correo}</a>
        {solicitud.numeroComprobante && <p>Comprobante: {solicitud.numeroComprobante}</p>}
        {solicitud.detalle && <p className="whitespace-pre-wrap pt-2 text-gray-300">{solicitud.detalle}</p>}
      </div>

      <div className="mt-4 rounded-xl bg-black/30 p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Compras de este correo</p>
        {!cuentaRegistrada ? (
          <p className="text-sm text-gray-300">No hay ninguna cuenta con este correo. Pedile que confirme con qué correo compró.</p>
        ) : compras.length === 0 ? (
          <p className="text-sm text-gray-300">La cuenta existe, pero no tiene compras aprobadas.</p>
        ) : (
          <ul className="space-y-3">
            {solicitud.numeroComprobante && !compras.some((compra) => compra.esDelComprobante) && (
              <li className="text-xs text-amber-300">El comprobante indicado no coincide con ninguna compra de este correo.</li>
            )}
            {compras.map((compra) => (
              <li
                key={compra.id}
                className={`text-sm text-gray-200 ${compra.esDelComprobante ? '-mx-2 rounded-lg border-l-2 border-[#d7f250] bg-[#d7f250]/5 px-2 py-1.5' : ''}`}
              >
                <p className="font-semibold text-white">
                  {tituloVisible(compra.titulo)}{compra.modulo ? `, ${compra.modulo}` : ''}
                  {compra.esDelComprobante && (
                    <span className="ml-2 rounded bg-[#d7f250]/15 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-[#d7f250]">Comprobante indicado</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  {compra.moneda} {compra.monto.toLocaleString('es-AR')} · {compra.plataforma} · pagada el {formatearFecha(compra.fechaPago)}
                  {compra.numeroRecibo ? ` · ${compra.numeroRecibo}` : ''}
                </p>
                <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-bold">
                  <span className={compra.dentroDelPlazo ? 'text-emerald-300' : 'text-red-300'}>
                    {compra.dentroDelPlazo ? 'Dentro de los 10 días' : 'Fuera de los 10 días'}
                  </span>
                  <span className={compra.videosReproducidos <= 1 ? 'text-emerald-300' : 'text-red-300'}>
                    {compra.videosReproducidos === 0 ? 'Sin videos empezados al pedir' : `${compra.videosReproducidos} ${compra.videosReproducidos === 1 ? 'video empezado' : 'videos empezados'} al pedir`}
                  </span>
                  {compra.videosDespuesDelPedido > 0 && (
                    <span className="text-amber-300" title="No cambian la regla: se cuentan los videos empezados hasta el pedido.">
                      +{compra.videosDespuesDelPedido} después del pedido
                    </span>
                  )}
                  {compra.estado === 'REEMBOLSADO' ? (
                    <span className="rounded bg-sky-400/15 px-1.5 text-sky-300">
                      Devuelta{compra.fechaReembolso ? ` el ${formatearFecha(compra.fechaReembolso)}` : ''}
                    </span>
                  ) : (
                    <span className={compra.cumpleRegla ? 'rounded bg-emerald-400/15 px-1.5 text-emerald-300' : 'rounded bg-red-400/15 px-1.5 text-red-300'}>
                      {compra.cumpleRegla ? 'Se puede devolver' : 'No cumple la regla'}
                    </span>
                  )}
                </div>
                {pendiente && esArrepentimiento && compra.estado === 'APROBADO' && (
                  <button
                    type="button"
                    disabled={ocupado}
                    onClick={() => setCompraADevolver(compra)}
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors disabled:opacity-50 ${
                      compra.cumpleRegla ? 'bg-[#d7f250] text-[#131313] hover:bg-[#c4dd46]' : 'border border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <Undo2 size={13} aria-hidden="true" /> Devolver {montoTexto(compra)}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>

      <div>
      {solicitud.respuestaCliente && (
        <div className={`mt-4 rounded-xl border p-4 ${solicitud.estado === 'RECHAZADA' ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Respuesta enviada por correo{solicitud.fechaResolucion ? ` el ${formatearFecha(solicitud.fechaResolucion)}` : ''}
          </p>
          <p className="whitespace-pre-wrap text-sm text-gray-200">{solicitud.respuestaCliente}</p>
        </div>
      )}

      {pendiente && rechazando && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-red-300">Motivo del rechazo</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Motivo del rechazo">
            {MOTIVOS.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={motivo === m}
                onClick={() => elegirMotivo(m)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${motivo === m ? 'bg-red-400 text-[#131313]' : 'bg-black/40 text-gray-300 hover:text-white'}`}
              >
                {ETIQUETA_MOTIVO[m]}{m === motivoSugerido(solicitud) && m !== 'OTRO' ? ' · sugerido' : ''}
              </button>
            ))}
          </div>
          <label htmlFor={`rechazo-${solicitud.id}`} className="mt-3 mb-1 block text-xs text-gray-400">
            Esto le llega por correo después de "Hola {solicitud.nombre},". Podés editarlo.
          </label>
          <textarea
            id={`rechazo-${solicitud.id}`}
            rows={7}
            maxLength={3000}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Explicá el motivo del rechazo."
            className="w-full resize-y rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-red-400/60"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={ocupado || !mensaje.trim()}
              onClick={() => rechazo.mutate()}
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              {rechazo.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Rechazar y enviar
            </button>
            <button type="button" disabled={ocupado} onClick={() => setRechazando(false)} className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10 disabled:opacity-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <label htmlFor={`nota-${solicitud.id}`} className="mt-4 mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400">Nota interna</label>
      <textarea
        id={`nota-${solicitud.id}`}
        rows={2}
        maxLength={2000}
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        className="w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-[#d7f250]/60"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {notaCambio && (
          <button type="button" disabled={ocupado} onClick={() => mutacion.mutate({ notaAdmin: nota })} className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10 disabled:opacity-50">
            Guardar nota
          </button>
        )}
        {pendiente && (
          // En un arrepentimiento, resolver sin devolver es para casos que se arreglaron por fuera.
          <button
            type="button"
            disabled={ocupado}
            onClick={() => cambiarEstado('RESUELTA')}
            title={esArrepentimiento ? 'No devuelve el dinero ni quita el acceso, ni avisa por correo.' : undefined}
            className={esArrepentimiento
              ? 'rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10 disabled:opacity-50'
              : 'rounded-full bg-[#d7f250] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#131313] transition-colors hover:bg-[#c4dd46] disabled:opacity-50'}
          >
            {esArrepentimiento ? 'Resolver sin devolver' : 'Marcar resuelta'}
          </button>
        )}
        {pendiente && !rechazando && (
          <button type="button" disabled={ocupado} onClick={abrirRechazo} className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50">
            Rechazar
          </button>
        )}
        {!pendiente && !solicitud.respuestaCliente && (
          <button type="button" disabled={ocupado} onClick={() => cambiarEstado('PENDIENTE')} className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10 disabled:opacity-50">
            Volver a pendiente
          </button>
        )}
      </div>
      </div>
      </div>
      )}

      <ConfirmarEliminarModal
        isOpen={compraADevolver !== null}
        onClose={() => setCompraADevolver(null)}
        onConfirm={() => compraADevolver && devolucion.mutate(compraADevolver)}
        tituloItem={compraADevolver?.titulo ?? ''}
        estaEliminando={devolucion.isPending}
        titulo="Devolver el pago"
        textoConfirmar="Sí, devolver"
        mensaje={compraADevolver && (
          <>
            Se devuelven <strong className="text-white">{montoTexto(compraADevolver)}</strong> por{' '}
            {compraADevolver.plataforma === 'PAYPAL' ? 'PayPal' : 'Mercado Pago'} de{' '}
            <strong className="text-white">"{tituloVisible(compraADevolver.titulo)}{compraADevolver.modulo ? `, ${compraADevolver.modulo}` : ''}"</strong>.
            {' '}{solicitud.nombre} pierde el acceso a ese mes en el momento, la solicitud queda resuelta y le avisamos por correo.
            {!compraADevolver.cumpleRegla && <span className="mt-2 block text-amber-300">Esta compra no cumple la regla de devolución.</span>}
            <span className="mt-2 block">El reembolso no se puede deshacer.</span>
          </>
        )}
      />
    </li>
  );
};

// Espera desde la última tecla antes de buscar en el back (un pedido por búsqueda, no por letra).
const ESPERA_BUSQUEDA_MS = 350;
// Solicitudes por página: con las pendientes abiertas, más que esto obliga a bajar mucho.
const POR_PAGINA = 10;

export const SolicitudesPage = () => {
  const [estado, setEstado] = useState<EstadoSolicitud | undefined>('PENDIENTE');
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusquedaTexto] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');

  useEffect(() => {
    const espera = setTimeout(() => setBusquedaAplicada(busqueda.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(espera);
  }, [busqueda]);

  const { data, isPending, isLoadingError, isFetching, isPlaceholderData, refetch } = useQuery({
    queryKey: ['solicitudes', estado, pagina, busquedaAplicada],
    queryFn: () => obtenerSolicitudesRequest(pagina, estado, busquedaAplicada, POR_PAGINA),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
  const buscando = busqueda.trim() !== busquedaAplicada || (isPlaceholderData && isFetching);

  // Cambiar el filtro o la búsqueda vuelve a la primera página (la actual puede no existir).
  const elegirFiltro = (valor?: EstadoSolicitud) => {
    setEstado(valor);
    setPagina(1);
  };
  const setBusqueda = (texto: string) => {
    setBusquedaTexto(texto);
    setPagina(1);
  };
  // Al cambiar de página se vuelve arriba, a los filtros.
  const irAPagina = (nueva: number) => {
    setPagina(nueva);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 md:p-8">
      <h1 className="flex items-center gap-3 font-principal text-3xl font-black text-white md:text-5xl">
        <Inbox className="h-8 w-8 shrink-0 text-[#d7f250] md:h-10 md:w-10" />
        <span className="mt-1 leading-none">Solicitudes</span>
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
        Pedidos de los botones de arrepentimiento y de baja. Quien lo pide ya recibió su código por correo. Con "Devolver" se reembolsa el pago completo por Mercado Pago o PayPal, se quita el acceso a ese mes y se le avisa por correo. Con "Rechazar" elegís el motivo y se lo enviamos. Si devolvés desde la pasarela, el acceso se quita igual al llegar su aviso.
      </p>

      <PagosARevisar />

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((filtro) => (
          <button
            key={filtro.etiqueta}
            type="button"
            aria-pressed={estado === filtro.valor}
            onClick={() => elegirFiltro(filtro.valor)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${estado === filtro.valor ? 'bg-[#d7f250] text-[#131313]' : 'bg-zinc-900/80 text-gray-400 hover:text-white'}`}
          >
            {filtro.etiqueta}{filtro.valor === 'PENDIENTE' && data ? ` (${data.pendientes})` : ''}
          </button>
        ))}
      </div>

        <div className="relative w-full lg:w-96">
          {buscando
            ? <Loader2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#d7f250]" aria-hidden="true" />
            : <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />}
          <input
            type="search"
            aria-label="Buscar solicitudes"
            placeholder="Buscar por código, nombre, correo o comprobante..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-[#131313] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 transition-all focus:border-[#d7f250] focus:outline-none focus:ring-1 focus:ring-[#d7f250]/30"
          />
        </div>
      </div>

      <div className="mt-6">
        {isPending ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#d7f250]" /></div>
        ) : isLoadingError || !data ? (
          <ErrorCargaAdmin que="las solicitudes" onReintentar={() => refetch()} reintentando={isFetching} />
        ) : data.data.length === 0 ? (
          <p className="rounded-2xl border border-white/5 bg-zinc-900/60 p-8 text-center text-gray-400">
            {busquedaAplicada ? `Ninguna solicitud coincide con "${busquedaAplicada}" en esta vista.` : 'No hay solicitudes en esta vista.'}
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {data.data.map((solicitud) => <TarjetaSolicitud key={`${solicitud.id}-${solicitud.notaAdmin ?? ''}`} solicitud={solicitud} />)}
            </ul>
            <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-gray-400 sm:flex-row">
              <span>
                {data.meta.totalItems === 1
                  ? '1 solicitud'
                  : `${(data.meta.currentPage - 1) * POR_PAGINA + 1}–${(data.meta.currentPage - 1) * POR_PAGINA + data.data.length} de ${data.meta.totalItems} solicitudes`}
              </span>
              {data.meta.totalPages > 1 && (
                <div className="flex items-center gap-4 text-gray-300">
                  <button type="button" aria-label="Página anterior" disabled={pagina <= 1} onClick={() => irAPagina(pagina - 1)} className="rounded-full bg-zinc-900 p-2 transition-colors hover:text-[#d7f250] disabled:opacity-40"><ChevronLeft size={18} /></button>
                  <span>Página {data.meta.currentPage} de {data.meta.totalPages}</span>
                  <button type="button" aria-label="Página siguiente" disabled={pagina >= data.meta.totalPages} onClick={() => irAPagina(pagina + 1)} className="rounded-full bg-zinc-900 p-2 transition-colors hover:text-[#d7f250] disabled:opacity-40"><ChevronRight size={18} /></button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
