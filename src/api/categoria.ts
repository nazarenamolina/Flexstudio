import { api } from './axios';

export interface Categoria {
  id: string;
  titulo: string;
  descripcionCard?: string;
  descripcionBreve?: string;
  descripcionDetallada?: string;
  precioArs:number;
  precioUsd: number;
  playbackIdMuestra?: string;
  imagenHero?: string;
  imagenTarjeta?: string;
  beneficios?: { titulo: string; descripcion: string; icono?: string }[];
  fechaCreacion?: string | Date;
  destacada?: boolean;
  cantidadVideos?: number;
  duracionTotalFormateada?: string;
}

// Los errores se propagan tal cual (AxiosError): cada pantalla muestra el mensaje del back con
// mensajeDeError (validaciones, límite de Mux, 404…). Antes se lanzaba solo el texto y los
// formularios, que leían error.response, terminaban mostrando siempre un mensaje genérico.

export const obtenerCategoriasRequest = async (): Promise<Categoria[]> => {
  const respuesta = await api.get('/categorias');
  return respuesta.data;
};

export const obtenerCategoriaPorIdRequest = async (id: string): Promise<Categoria> => {
  const respuesta = await api.get(`/categorias/${id}`);
  return respuesta.data;
};

export const crearCategoriaRequest = async (
  datosCategoria: FormData
): Promise<{ categoria: Categoria; uploadUrl?: string | null }> => {
  const respuesta = await api.post('/categorias', datosCategoria, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return respuesta.data;
};

export const actualizarCategoriaRequest = async (
  id: string,
  datosCategoria: FormData
): Promise<{ categoria: Categoria; uploadUrl?: string | null }> => {
  const respuesta = await api.patch(`/categorias/${id}`, datosCategoria, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return respuesta.data;
};

export const obtenerCategoriasEliminadasRequest = async (): Promise<Categoria[]> => {
  const respuesta = await api.get('/categorias/eliminadas');
  return respuesta.data;
};

export const restaurarCategoriaRequest = async (id: string): Promise<{ mensaje: string }> => {
  const respuesta = await api.post(`/categorias/${id}/restaurar`);
  return respuesta.data;
};

export const eliminarCategoriaRequest = async (id: string): Promise<{ mensaje: string }> => {
  const respuesta = await api.delete(`/categorias/${id}`);
  return respuesta.data;
};
