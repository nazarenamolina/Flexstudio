import { api } from './axios'; 

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

export const obtenerHistorialClientes = async (): Promise<ResumenCliente[]> => {
  const respuesta = await api.get('/admin/clientes');
  return respuesta.data;
};