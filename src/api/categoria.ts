// 1. Importamos la instancia configurada que ya tenías
import axios from 'axios';
// Importamos una utilidad extra de la librería axios original para manejar errores
import { isAxiosError } from 'axios';

// 2. DEFINIMOS LA INTERFAZ CENTRAL (El "contrato" de los datos)
// Exportamos esta interfaz para que otros archivos (como HomePage.tsx) puedan usarla
export interface Categoria {
  id: string; // O number, pero en MongoDB suele ser string (_id)
  titulo: string;
  descripcion: string;
  imagenTarjeta?: string; // El '?' significa que es opcional
}

// 3. UNA FUNCIÓN AUXILIAR PARA LOS ERRORES (Opcional pero muy profesional)
// En TS, el bloque "catch (error)" recibe un error de tipo 'unknown'. 
// Esta función nos asegura extraer el mensaje correctamente sin que TS se queje.
const manejarErrorAxios = (error: unknown) => {
    if (isAxiosError(error)) {
        throw error.response?.data?.message || 'Error de conexión con el servidor';
    }
    throw 'Ocurrió un error inesperado';
};


// --- LAS FUNCIONES DE LA API ---

// GET: Devuelve un Array de Categorias -> Promise<Categoria[]>
export const obtenerCategoriasRequest = async (): Promise<Categoria[]> => {
    try {
        const respuesta = await axios.get('/categorias');
        return respuesta.data;
    } catch (error) {
        throw manejarErrorAxios(error);
    }
};

// POST: Recibe un formulario (FormData) porque envías archivos/imágenes a Cloudinary
// Devuelve la Categoría recién creada -> Promise<Categoria>
export const crearCategoriaRequest = async (datosCategoria: FormData): Promise<Categoria> => {
    try {
        const respuesta = await axios.post('/categorias', datosCategoria, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return respuesta.data;
    } catch (error) {
        throw manejarErrorAxios(error);
    }
};

// PATCH: Recibe un ID (string) y un formulario (FormData)
// Devuelve la Categoría actualizada -> Promise<Categoria>
export const actualizarCategoriaRequest = async (id: string, datosCategoria: FormData): Promise<Categoria> => {
    try {
        const respuesta = await axios.patch(`/categorias/${id}`, datosCategoria, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return respuesta.data;
    } catch (error) {
        throw manejarErrorAxios(error);
    }
};

// DELETE: Recibe un ID (string) y usualmente no devuelve datos complejos, 
// o devuelve un mensaje de éxito, por eso usamos Promise<any> o Promise<void>
export const eliminarCategoriaRequest = async (id: string): Promise<any> => {
    try {
        const respuesta = await axios.delete(`/categorias/${id}`);
        return respuesta.data;
    } catch (error) {
        throw manejarErrorAxios(error);
    }
};

// GET by ID: Recibe un ID (string) y devuelve UNA sola Categoría -> Promise<Categoria>
export const obtenerCategoriaPorIdRequest = async (id: string): Promise<Categoria> => {
    try {
        const respuesta = await axios.get(`/categorias/${id}`);
        return respuesta.data;
    } catch (error) {
        throw manejarErrorAxios(error);
    }
};