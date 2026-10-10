import { useQuery } from '@tanstack/react-query';
import { obtenerMisClasesCompradas } from '../api/compras';
import { mensajeDeError } from '../api/errores';
import { useAuthStore } from '../store/authStore';

/** Clave de caché de las clases compradas. Lleva el id del usuario para no mezclar cuentas. */
export const claveMisClases = (idUsuario: string | undefined) => ['mis-clases', idUsuario] as const;

/**
 * Clases compradas del usuario logueado. Una sola consulta compartida por "Mis clases", el detalle
 * de cada clase (¿ya es tuya?) y la revalidación del carrito; antes cada uno la pedía por su lado.
 */
export const useMisClases = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const idUsuario = useAuthStore((state) => state.usuario?.id);

  const consulta = useQuery({
    queryKey: claveMisClases(idUsuario),
    queryFn: obtenerMisClasesCompradas,
    enabled: isAuthenticated,
  });

  return {
    clases: consulta.data ?? [],
    cargando: isAuthenticated && consulta.isPending,
    error: consulta.isError ? mensajeDeError(consulta.error, 'No pudimos cargar tus clases. Probá de nuevo en unos segundos.') : null,
    reintentar: () => consulta.refetch(),
    listo: !isAuthenticated || consulta.isSuccess,
  };
};
