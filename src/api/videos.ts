import { api } from './axios';
import { type Categoria } from './categoria';


export interface Video {
  id: string;
  titulo: string;
  assetId: string;
  playbackId: string;
  imagenUrl?: string;
  orden: number;
  duracion?: number;
  idCategoria: string;
  categoria?: Categoria;
}


export const obtenerTodosLosVideosRequest = async (): Promise<Video[]> => {
  const respuesta = await api.get('/videos');
  return respuesta.data;
};

export const obtenerVideoPorIdRequest = async (id: string): Promise<Video> => {
  const respuesta = await api.get(`/videos/${id}`);
  return respuesta.data;
};

export const obtenerVideosPorCategoriaRequest = async (idCategoria: string): Promise<Video[]> => {
  const respuesta = await api.get(`/videos/categoria/${idCategoria}`);
  return respuesta.data;
};

export const solicitarUrlSubidaRequest = async (datos: FormData): Promise<{ uploadUrl: string, videoId: string }> => {
  const respuesta = await api.post('/videos/solicitar-subida', datos, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return respuesta.data;
};

export const eliminarVideoRequest = async (id: string): Promise<{ mensaje: string }> => {
  const respuesta = await api.delete(`/videos/${id}`);
  return respuesta.data;
};

export const actualizarVideoRequest = async (id: string, datos: Partial<Video>): Promise<Video> => {
  const respuesta = await api.patch(`/videos/${id}`, datos);
  return respuesta.data;
};