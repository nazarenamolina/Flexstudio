import { api } from './axios'; 

// 1. LA INTERFAZ CENTRALIZADA
export interface Categoria {
  id: string;
  titulo: string;
  descripcionCard?: string;
  descripcionBreve?: string;
  descripcionDetallada?: string;
  precio: number;
  playbackIdMuestra?: string;
  imagenHero?: string;
  imagenTarjeta?: string;
  beneficios?: { titulo: string; descripcion: string; icono?: string }[];
  fechaCreacion?: string | Date;
}

// 2. LAS PETICIONES TIPADAS

// Obtener todas
export const obtenerCategoriasRequest = async (): Promise<Categoria[]> => {
  try {
    const respuesta = await api.get('/categorias');
    return respuesta.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Error al conectar con el servidor';
  }
};

// Obtener por ID
export const obtenerCategoriaPorIdRequest = async (id: string): Promise<Categoria> => {
  try {
    const respuesta = await api.get(`/categorias/${id}`);
    return respuesta.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Error al cargar los detalles de la categoría';
  }
};

// Crear (Ojo: FormData porque envías imágenes)
export const crearCategoriaRequest = async (datosCategoria: FormData): Promise<Categoria> => {
  try {
    const respuesta = await api.post('/categorias', datosCategoria, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return respuesta.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Error al crear la categoría';
  }
};

// Actualizar
export const actualizarCategoriaRequest = async (id: string, datosCategoria: FormData): Promise<Categoria> => {
  try {
    const respuesta = await api.patch(`/categorias/${id}`, datosCategoria, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return respuesta.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Error al actualizar la categoría';
  }
};

// Eliminar
export const eliminarCategoriaRequest = async (id: string): Promise<{ mensaje: string }> => {
  try {
    const respuesta = await api.delete(`/categorias/${id}`);
    return respuesta.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Error al eliminar la categoría';
  }
};