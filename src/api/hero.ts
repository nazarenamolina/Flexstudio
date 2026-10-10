import { api } from './axios';
import { mensajeDeError } from './errores';

export interface HeroSlide {
  id: string;
  imagenUrl: string;
  imagenMovilUrl?: string | null;
  etiqueta?: string | null;
  titulo?: string | null;
  subtitulo?: string | null;
  textoBoton?: string | null;
  enlace?: string | null;
  orden: number;
  activo?: boolean;
}

/** Medidas recomendadas para las imágenes del carrusel (escritorio 16:9, celular 4:5). */
export const MEDIDAS_HERO = {
  escritorio: { ancho: 1920, alto: 1080 },
  celular: { ancho: 1080, alto: 1350 },
} as const;

export const obtenerHeroRequest = async (): Promise<HeroSlide[]> => {
  const respuesta = await api.get('/hero');
  return respuesta.data;
};

export const obtenerHeroAdminRequest = async (): Promise<HeroSlide[]> => {
  try {
    const respuesta = await api.get('/hero/admin');
    return respuesta.data;
  } catch (error) {
    throw mensajeDeError(error, 'Error al cargar el carrusel');
  }
};

export const crearHeroRequest = async (datos: FormData): Promise<HeroSlide> => {
  try {
    const respuesta = await api.post('/hero', datos, { headers: { 'Content-Type': 'multipart/form-data' } });
    return respuesta.data;
  } catch (error) {
    throw mensajeDeError(error, 'Error al crear la diapositiva');
  }
};

export const actualizarHeroRequest = async (id: string, datos: FormData): Promise<HeroSlide> => {
  try {
    const respuesta = await api.patch(`/hero/${id}`, datos, { headers: { 'Content-Type': 'multipart/form-data' } });
    return respuesta.data;
  } catch (error) {
    throw mensajeDeError(error, 'Error al guardar la diapositiva');
  }
};

export const ordenarHeroRequest = async (ids: string[]): Promise<HeroSlide[]> => {
  try {
    const respuesta = await api.patch('/hero/orden', { ids });
    return respuesta.data;
  } catch (error) {
    throw mensajeDeError(error, 'Error al reordenar el carrusel');
  }
};

export const eliminarHeroRequest = async (id: string): Promise<{ mensaje: string }> => {
  try {
    const respuesta = await api.delete(`/hero/${id}`);
    return respuesta.data;
  } catch (error) {
    throw mensajeDeError(error, 'Error al eliminar la diapositiva');
  }
};
