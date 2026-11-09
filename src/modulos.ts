// Módulos (meses) de una categoría. Las reglas las decide el back (reglas-modulos.ts); acá solo se
// muestran, salvo para quien no inició sesión, que todavía no compró nada.

/** Meses de acceso desde que se acredita el pago (MESES_ACCESO en el back). */
export const MESES_ACCESO = 3;

export type EstadoModulo = 'COMPRABLE' | 'BLOQUEADO' | 'VIGENTE' | 'VENCIDO' | 'NO_DISPONIBLE';

export interface ModuloPublico {
  id: string;
  idCategoria: string;
  numero: number;
  titulo?: string | null;
  descripcion?: string | null;
  precioArs?: string | number | null;
  precioUsd?: string | number | null;
  cantidadVideos: number;
  duracionTotalFormateada: string;
}

/** Link de pago de ese mes que todavía no se acreditó (el back lo informa mientras está vigente). */
export interface PagoEnProceso {
  plataforma: 'MERCADOPAGO' | 'PAYPAL';
  url: string;
  venceEn: string;
}

export interface ModuloConEstado extends ModuloPublico {
  estado: EstadoModulo;
  comprable: boolean;
  fechaVencimiento: string | null;
  requiereNumero: number | null;
  terminado: boolean;
  pagoEnProceso?: PagoEnProceso | null;
}

/** "Mes 1: Fundamentos", o "Mes 1" si no tiene título. */
export const nombreModulo = (modulo: { numero: number; titulo?: string | null }) =>
  modulo.titulo?.trim() ? `Mes ${modulo.numero}: ${modulo.titulo.trim()}` : `Mes ${modulo.numero}`;

export const formatearFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

/** Quien no inició sesión ve lo que le pasaría a alguien sin compras: solo el primer mes a la venta. */
export const estadosParaVisitante = (modulos: ModuloPublico[]): ModuloConEstado[] => {
  let anterior: ModuloPublico | null = null;
  return [...modulos].sort((a, b) => a.numero - b.numero).map((modulo) => {
    const seVende = modulo.cantidadVideos > 0;
    const requiereNumero: number | null = seVende && anterior ? anterior.numero : null;
    const estado: EstadoModulo = !seVende ? 'NO_DISPONIBLE' : requiereNumero ? 'BLOQUEADO' : 'COMPRABLE';
    if (seVende) anterior = modulo;
    return { ...modulo, estado, comprable: estado === 'COMPRABLE', fechaVencimiento: null, requiereNumero, terminado: false };
  });
};
