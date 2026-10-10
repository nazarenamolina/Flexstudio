import { api } from './axios';
import { type Categoria } from './categoria';


/** Estado del video en Mux: PROCESANDO hasta que llega el webhook; ERROR si la subida o el procesamiento fallaron. */
export type EstadoVideo = 'PROCESANDO' | 'LISTO' | 'ERROR';

export interface Video {
  id: string;
  titulo: string;
  estado?: EstadoVideo;
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

export interface VideoData {
  id: string;
  titulo: string;
  descripcion?: string;
  estado?: EstadoVideo;
  playbackId?: string;
  imagenUrl?: string;
  duracion?: number;
  categoria?: {
    titulo: string;
  };
}

/** Credenciales firmadas de Mux: un token por tipo (video, miniatura y storyboard). */
export interface CredencialesReproduccion {
  playbackId: string;
  tokens: { playback: string; thumbnail?: string; storyboard?: string };
  /** Momento (ms) en que vencen los tokens. */
  expiraEn?: number;
}

export const obtenerCredencialesReproduccion = async (idVideo: string): Promise<CredencialesReproduccion> => {
  const respuesta = await api.get(`/videos/reproducir/${idVideo}`);
  const datos = respuesta.data;
  // Compatibilidad con un back anterior, que solo devolvía `token`.
  return { ...datos, tokens: datos.tokens ?? { playback: datos.token } };
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

/** URL de subida a Mux para reemplazar el archivo de un video; el actual sigue hasta que el nuevo esté listo. */
export const solicitarReemplazoArchivoRequest = async (id: string): Promise<{ uploadUrl: string; videoId: string }> => {
  const respuesta = await api.post(`/videos/${id}/reemplazar-archivo`);
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