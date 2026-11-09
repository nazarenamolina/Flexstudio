import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Clock, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { verificarPagoModuloRequest } from '../api/compras';
import { mensajeDeError } from '../api/errores';
import { useAlAcreditarPago } from '../hooks/useAlAcreditarPago';
import type { PagoEnProceso as Pago } from '../modulos';

interface Props {
  idModulo: string;
  idCategoria: string;
  pago: Pago;
  /** "compacto" en la lista de meses; "completo" en el checkout. */
  variante?: 'compacto' | 'completo';
  /** Dejar el link pendiente y pagar con uno nuevo (por ejemplo, para sumar un cupón). */
  onEmpezarDeNuevo?: () => void;
}

const hora = (fecha: string) => new Date(fecha).toLocaleTimeString('es-AR', {
  hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires',
});

/**
 * Mes con un link de pago sin acreditar. En vez de ofrecer comprar otra vez (y que se cobre dos
 * veces si el aviso de la pasarela se atrasó), deja verificar el pago o volver al mismo link.
 * Al aparecer verifica una vez sola: cubre a quien pagó y volvió al sitio sin pasar por la página de éxito.
 */
export const PagoEnProceso = ({ idModulo, idCategoria, pago, variante = 'compacto', onEmpezarDeNuevo }: Props) => {
  const alAcreditar = useAlAcreditarPago();
  const verificoAlAbrir = useRef(false);
  const medio = pago.plataforma === 'PAYPAL' ? 'PayPal' : 'Mercado Pago';

  const verificacion = useMutation({
    mutationFn: () => verificarPagoModuloRequest(idModulo),
    onSuccess: ({ estado }) => {
      if (estado === 'APROBADO') alAcreditar(idModulo, idCategoria);
      else if (estado === 'EN_REVISION') {
        toast(`Tu pago está en revisión en ${medio}. Cuando se acredite vas a tener acceso y te llega el comprobante por correo: no hace falta pagar de nuevo.`, { icon: '🔎', duration: 9000 });
      } else toast(`Todavía no vemos tu pago en ${medio}. Si recién pagaste, esperá un minuto y volvé a verificar.`, { icon: '⏳', duration: 7000 });
    },
    onError: (error) => toast.error(mensajeDeError(error, 'No pudimos verificar el pago. Intentá de nuevo en un momento.')),
  });

  useEffect(() => {
    if (verificoAlAbrir.current) return;
    verificoAlAbrir.current = true;
    // Automática: solo encuentra pagos ya hechos, nunca cobra.
    verificarPagoModuloRequest(idModulo, true)
      .then(({ estado }) => { if (estado === 'APROBADO') alAcreditar(idModulo, idCategoria); })
      .catch(() => undefined);
  }, [idModulo, idCategoria, alAcreditar]);

  const completo = variante === 'completo';

  return (
    <div
      role="status"
      className={`flex flex-col gap-2 rounded-2xl border border-amber-300 bg-amber-50 text-[#131313] ${completo ? 'w-full p-5' : 'p-4 sm:max-w-xs'}`}
    >
      <p className="flex items-center gap-2 font-principal text-lg font-bold uppercase leading-tight">
        <Clock size={18} className="shrink-0 text-amber-600" aria-hidden="true" /> Tenés un pago en proceso
      </p>
      <p className="text-sm leading-relaxed text-neutral-700">
        Si ya pagaste con {medio}, verificalo antes de volver a comprar. Si no terminaste el pago, podés retomarlo{pago.venceEn ? ` hasta las ${hora(pago.venceEn)}` : ''}.
      </p>
      <div className={`mt-1 flex flex-col gap-2 ${completo ? 'sm:flex-row' : ''}`}>
        <button
          type="button"
          onClick={() => verificacion.mutate()}
          disabled={verificacion.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#131313] px-5 py-2.5 font-principal text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#d7f250] hover:text-[#131313] disabled:opacity-60 cursor-pointer"
        >
          {verificacion.isPending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} aria-hidden="true" />} Ya pagué, verificar
        </button>
        <a
          href={pago.url}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#131313] px-5 py-2.5 font-principal text-sm font-bold uppercase tracking-wide transition-colors hover:bg-white"
        >
          <ExternalLink size={16} aria-hidden="true" /> Volver al pago
        </a>
      </div>
      {onEmpezarDeNuevo && (
        <button
          type="button"
          onClick={onEmpezarDeNuevo}
          className="self-start text-xs font-semibold text-neutral-600 underline underline-offset-2 hover:text-[#131313] cursor-pointer"
        >
          Empezar un pago nuevo
        </button>
      )}
    </div>
  );
};
