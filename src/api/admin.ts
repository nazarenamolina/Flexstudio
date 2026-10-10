import { api } from './axios'; 

export interface PeriodoEstadistica {
  ars: number;
  usd: number;
  ventasArs: number;
  ventasUsd: number;
}

export interface EstadisticasDashboard {
  totalUsuarios: number;
  clasesVendidas: number;
  ingresosArs: number;
  ingresosUsd: number;
  resumenPeriodos: {
    hoy: PeriodoEstadistica;
    semana: PeriodoEstadistica;
    mes: PeriodoEstadistica;
    anio: PeriodoEstadistica;
  };
}

export interface ResumenCliente {
  id: string;
  nombreCompleto: string;
  correo: string;
  pais: string;
  telefono: string | null;
  fechaRegistro: string;
  totalClasesCompradas: number;
  totalInvertidoArs: number;
  totalInvertidoUsd: number;
  fechaUltimaCompra: string | null;
}

export interface PaginacionMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface RespuestaPaginadaClientes {
  data: ResumenCliente[];
  meta: PaginacionMeta;
}

export interface ComprobanteData {
  id: string;
  numeroRecibo: string;
  fechaEmision: string;
  urlPdf: string;
  grupoPagoId: string;
}

export const obtenerEstadisticasRequest = async (): Promise<EstadisticasDashboard> => {
  const respuesta = await api.get('/admin/estadisticas');
  return respuesta.data;
};

/** Columnas por las que el back puede ordenar el historial (ORDENES_CLIENTES en admin.service.ts). */
export type OrdenClientes = 'nombreCompleto' | 'pais' | 'totalClasesCompradas' | 'totalInvertidoArs' | 'totalInvertidoUsd' | 'fechaUltimaCompra';

export interface FiltrosClientes {
  busqueda?: string;
  orden?: OrdenClientes;
  direccion?: 'asc' | 'desc';
}

// La búsqueda y el orden los resuelve el back sobre todos los clientes: antes se filtraba en el
// navegador solo la página visible (5 clientes) y un cliente de otra página "no existía".
export const obtenerHistorialClientes = async (page: number = 1, limit: number = 5, filtros: FiltrosClientes = {}): Promise<RespuestaPaginadaClientes> => {
  const respuesta = await api.get('/admin/clientes', {
    params: { page, limit, busqueda: filtros.busqueda || undefined, orden: filtros.orden, direccion: filtros.direccion },
  });
  return respuesta.data;
};

export interface ClaseMasComprada {
  id: string;
  titulo: string;
  imagenTarjeta?: string | null;
  destacada: boolean;
  /** Dada de baja: sus ventas siguen contando. */
  eliminada: boolean;
  totalCompras: number;
  ingresosArs: number;
  ingresosUsd: number;
}

export const obtenerClasesMasCompradasRequest = async (limite = 5): Promise<ClaseMasComprada[]> => {
  const { data } = await api.get('/admin/clases-mas-compradas', { params: { limite } });
  return data;
};

export const obtenerComprobantesCliente = async (idUsuario: string): Promise<ComprobanteData[]> => {
  const respuesta = await api.get(`/comprobantes/usuario/${idUsuario}`);
  return respuesta.data;
};