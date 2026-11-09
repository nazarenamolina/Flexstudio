import { api } from './axios';

export type TipoCupon = 'PORCENTAJE' | 'MONTO_FIJO';

/** Lo que se cobraría con un cupón. El back lo vuelve a calcular al iniciar la compra. */
export interface CuponAplicado {
  codigo: string;
  moneda: 'ARS' | 'USD';
  montoOriginal: number;
  descuento: number;
  montoFinal: number;
}

export const validarCuponRequest = async (datos: { codigo: string; idModulo: string; plataforma: string }): Promise<CuponAplicado> => {
  const respuesta = await api.post('/cupones/validar', datos);
  return respuesta.data;
};

export interface Cupon {
  id: string;
  codigo: string;
  tipo: TipoCupon;
  porcentaje: number | null;
  montoArs: string | number | null;
  montoUsd: string | number | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  // Null: sin límite.
  maximoUsos: number | null;
  // Máximo de compras de una misma persona. Null: sin límite.
  usosPorPersona: number | null;
  activo: boolean;
  aplicaATodo: boolean;
  categorias: { id: string; titulo: string }[];
  usos: number;
  /** Solo se pueden borrar los cupones que nunca se usaron en una compra; los demás se pausan. */
  sePuedeBorrar: boolean;
}

export interface DatosCupon {
  codigo?: string;
  tipo?: TipoCupon;
  porcentaje?: number | null;
  montoArs?: number | null;
  montoUsd?: number | null;
  // Días argentinos (AAAA-MM-DD). Null: sin límite.
  fechaInicio?: string | null;
  fechaFin?: string | null;
  maximoUsos?: number | null;
  usosPorPersona?: number | null;
  activo?: boolean;
  aplicaATodo?: boolean;
  idsCategorias?: string[];
}

export const obtenerCuponesRequest = async (): Promise<Cupon[]> => {
  const respuesta = await api.get('/cupones');
  return respuesta.data;
};

export const crearCuponRequest = async (datos: DatosCupon) => {
  const respuesta = await api.post('/cupones', datos);
  return respuesta.data;
};

export const actualizarCuponRequest = async (id: string, datos: DatosCupon) => {
  const respuesta = await api.patch(`/cupones/${id}`, datos);
  return respuesta.data;
};

export const eliminarCuponRequest = async (id: string) => {
  const respuesta = await api.delete(`/cupones/${id}`);
  return respuesta.data;
};
