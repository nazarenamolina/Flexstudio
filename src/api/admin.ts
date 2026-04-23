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

export const obtenerHistorialClientes = async (): Promise<ResumenCliente[]> => {
  const respuesta = await api.get('/admin/clientes');
  return respuesta.data;
};

 
export const obtenerComprobantesCliente = async (idUsuario: string): Promise<ComprobanteData[]> => {
  const respuesta = await api.get(`/comprobantes/usuario/${idUsuario}`);
  return respuesta.data;
};