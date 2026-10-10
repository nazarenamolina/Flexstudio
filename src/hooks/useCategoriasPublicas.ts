import { useQuery } from '@tanstack/react-query';
import { obtenerCategoriasRequest } from '../api/categoria';

/**
 * Catálogo público de clases. Usa la misma clave que el carrito y el admin (`['categorias']`):
 * la home y el menú del header comparten un solo pedido al back.
 */
export const useCategoriasPublicas = () =>
  useQuery({
    queryKey: ['categorias'],
    queryFn: obtenerCategoriasRequest,
  });
