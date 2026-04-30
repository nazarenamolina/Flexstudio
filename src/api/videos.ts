import { api } from './axios';
import { type Categoria } from './categoria';


export interface Video {
  id: string;
  titulo: string;
  descripcion?: string; 
  assetId: string;
  playbackId: string;
  imagenUrl?: string;
  orden: number;
  duracion?: number;
  duracionFormateada?: string; 
  idCategoria: string;
  categoria?: Categoria;
}

export const obtenerCredencialesReproduccion = async (idVideo: string) => {
  const respuesta = await api.get(`/videos/reproducir/${idVideo}`);
  return respuesta.data;  
};

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

export const actualizarVideoRequest = async (id: string, datos: FormData) => {
  const respuesta = await api.patch(`/videos/${id}`, datos, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return respuesta.data;
};

export const marcarVideoCompletadoRequest = async (idVideo: string) => {
  const respuesta = await api.post(`/videos/${idVideo}/completar`);
  return respuesta.data;
};

export const obtenerProgresoCategoriaRequest = async (idCategoria: string): Promise<string[]> => {
  const respuesta = await api.get(`/videos/progreso/categoria/${idCategoria}`);
  return respuesta.data;
};