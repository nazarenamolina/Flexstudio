import { tituloVisible } from '../../../titulos';
import type { CompraDeSolicitud, Solicitud } from '../../../api/solicitudes';

export type MotivoRechazo = 'PLAZO' | 'VIDEOS' | 'SIN_COMPRA' | 'OTRO';

export const ETIQUETA_MOTIVO: Record<MotivoRechazo, string> = {
  PLAZO: 'Fuera de los 10 días',
  VIDEOS: 'Más de un video empezado',
  SIN_COMPRA: 'Sin compra con ese correo',
  OTRO: 'Otro motivo',
};

const fecha = (valor: string) => new Date(valor).toLocaleDateString('es-AR', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires',
});

const nombreCompra = (compra: CompraDeSolicitud) => `${tituloVisible(compra.titulo)}${compra.modulo ? `, ${compra.modulo}` : ''}`;

/** La compra a la que se refiere el pedido: la del comprobante indicado o, si hay una sola sin devolver, esa. */
export const compraDelPedido = (solicitud: Solicitud) => {
  const { compras } = solicitud.contexto;
  const sinDevolver = compras.filter((c) => c.estado === 'APROBADO');
  return compras.find((c) => c.esDelComprobante) ?? (sinDevolver.length === 1 ? sinDevolver[0] : undefined);
};

/** El motivo que corresponde según la regla, para proponerlo al rechazar. */
export const motivoSugerido = (solicitud: Solicitud): MotivoRechazo => {
  const { compras, cuentaRegistrada } = solicitud.contexto;
  if (!cuentaRegistrada || compras.length === 0) return 'SIN_COMPRA';
  const compra = compraDelPedido(solicitud);
  if (!compra) return 'OTRO';
  if (!compra.dentroDelPlazo) return 'PLAZO';
  if (compra.videosReproducidos > 1) return 'VIDEOS';
  return 'OTRO';
};

/**
 * Texto que recibe la persona por correo (después de "Hola, nombre"). Cita la cláusula 8 de los
 * Términos y la norma en la que se apoya. Se puede editar antes de enviar.
 */
export const textoMotivo = (motivo: MotivoRechazo, solicitud: Solicitud): string => {
  const compra = compraDelPedido(solicitud) ?? solicitud.contexto.compras[0];
  const clase = compra ? `"${nombreCompra(compra)}"` : 'tu compra';
  switch (motivo) {
    case 'PLAZO':
      return [
        `Revisamos tu pedido de arrepentimiento. Este derecho se puede ejercer dentro de los 10 días corridos desde que se confirmó la compra (art. 34 de la Ley 24.240, art. 1110 del Código Civil y Comercial y cláusula 8 de nuestros Términos y Condiciones).`,
        compra
          ? `Tu compra de ${clase} se confirmó el ${fecha(compra.fechaPago)} y tu pedido llegó el ${fecha(solicitud.fechaCreacion)}, cuando ese plazo ya había vencido. Por eso no podemos hacer la devolución.`
          : `Tu pedido llegó cuando ese plazo ya había vencido. Por eso no podemos hacer la devolución.`,
        'Vas a seguir teniendo acceso a ese mes hasta su vencimiento.',
      ].join('\n\n');
    case 'VIDEOS':
      return [
        'Revisamos tu pedido de arrepentimiento. La cláusula 8 de nuestros Términos y Condiciones, que aceptaste al comprar, establece que este derecho no aplica si ya empezaste más de un video del mes que querés devolver; un video cuenta como empezado desde que le das reproducir (art. 3 de la Disposición 954/2025 y art. 1116 del Código Civil y Comercial).',
        compra
          ? `Cuando hiciste el pedido ya habías empezado ${compra.videosReproducidos} videos de ${clase}. Por eso no podemos hacer la devolución.`
          : 'Cuando hiciste el pedido ya habías empezado más de un video de ese mes. Por eso no podemos hacer la devolución.',
        'Vas a seguir teniendo acceso a ese mes hasta su vencimiento.',
      ].join('\n\n');
    case 'SIN_COMPRA':
      return [
        `Revisamos tu pedido, pero no encontramos ninguna compra hecha con el correo ${solicitud.correo}.`,
        'Si compraste con otro correo, respondé este mensaje indicándolo junto con el número de comprobante (por ejemplo, FLEX-0001) y lo revisamos de nuevo.',
      ].join('\n\n');
    case 'OTRO':
      return '';
  }
};
