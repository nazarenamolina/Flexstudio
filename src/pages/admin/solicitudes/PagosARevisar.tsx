import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { obtenerPagosARevisarRequest, resolverPagoARevisarRequest, type MotivoRevision } from '../../../api/pagosARevisar';
import { mensajeDeError } from '../../../api/errores';

const MOTIVOS: Record<MotivoRevision, { titulo: string; accion: string }> = {
  COBRO_DUPLICADO: {
    titulo: 'Cobro duplicado',
    accion: 'Se cobró más de una vez el mismo mes. Devolvé este pago desde la pasarela: el acceso se conserva con el otro pago.',
  },
  MONTO_DISTINTO: {
    titulo: 'Monto distinto',
    accion: 'El pago no coincide con la compra y no dio acceso. Revisalo en la pasarela y devolvelo si corresponde.',
  },
  MES_NO_DISPONIBLE: {
    titulo: 'Mes dado de baja',
    accion: 'Pagaron un mes que ya no se vende, así que puede no tener videos. Devolvé el pago si corresponde.',
  },
  COMPROBANTE_SIN_ENVIAR: {
    titulo: 'Comprobante sin enviar',
    accion: 'La compra está aprobada y el acceso funciona, pero no pudimos enviar el comprobante. Escribile a la clienta para avisarle.',
  },
  REEMBOLSO_SIN_REFERENCIA: {
    titulo: 'Reembolso sin compra',
    accion: 'No pudimos asociar este reembolso a una compra, así que nadie perdió el acceso. Buscalo en PayPal para ver de qué compra es.',
  },
};

const formatearFecha = (fecha: string) => new Date(fecha).toLocaleString('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Argentina/Buenos_Aires',
});

// Si no hay nada para revisar, o la consulta falla, no ocupa lugar: es un aviso, no la lista principal.
export const PagosARevisar = () => {
  const queryClient = useQueryClient();
  const { data: pagos } = useQuery({
    queryKey: ['pagos-a-revisar'],
    queryFn: obtenerPagosARevisarRequest,
    staleTime: 30_000,
  });
  const resolver = useMutation({
    mutationFn: resolverPagoARevisarRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos-a-revisar'] });
      toast.success('Marcado como revisado');
    },
    onError: (error) => toast.error(mensajeDeError(error, 'No pudimos marcarlo como revisado.')),
  });

  if (!pagos?.length) return null;

  return (
    <section className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-300">
        <AlertTriangle size={16} className="shrink-0" />
        Pagos a revisar ({pagos.length})
      </h2>
      <ul className="mt-4 space-y-3">
        {pagos.map((pago) => (
          <li key={pago.id} className="rounded-xl bg-black/30 p-4 text-sm text-gray-200">
            <p className="font-semibold text-white">{MOTIVOS[pago.motivo].titulo}{pago.detalle ? `: ${pago.detalle}` : ''}</p>
            <p className="mt-1 text-gray-300">{MOTIVOS[pago.motivo].accion}</p>
            <p className="mt-2 break-all text-xs text-gray-400">
              {pago.plataforma === 'MERCADOPAGO' ? 'Mercado Pago' : 'PayPal'} · N° {pago.idPago}
              {pago.monto !== null && ` · ${pago.moneda ?? ''} ${pago.monto.toLocaleString('es-AR')}`}
              {` · ${formatearFecha(pago.fechaCreacion)}`}
              {pago.cliente && ` · ${pago.cliente.nombre} (${pago.cliente.correo})`}
            </p>
            <button
              type="button"
              disabled={resolver.isPending}
              onClick={() => resolver.mutate(pago.id)}
              className="mt-3 rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              Marcar como revisado
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
