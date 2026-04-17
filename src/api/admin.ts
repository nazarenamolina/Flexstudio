import { api } from './axios'; 

// --- INTERFACES ---

export interface EstadisticasDashboard {
  totalUsuarios: number;
  clasesVendidas: number;
  ingresosArs: number;
  ingresosUsd: number;
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
 

export const obtenerEstadisticasRequest = async (): Promise<EstadisticasDashboard> => {
  const respuesta = await api.get('/admin/estadisticas');
  return respuesta.data;
};

export const obtenerHistorialClientes = async (): Promise<ResumenCliente[]> => {
  const respuesta = await api.get('/admin/clientes');
  return respuesta.data;
};