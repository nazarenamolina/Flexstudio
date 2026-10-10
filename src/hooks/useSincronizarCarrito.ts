import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { obtenerCategoriasRequest } from '../api/categoria';
import { obtenerMisClasesCompradas } from '../api/compras';
import { claveMisClases } from './useMisClases';
import { useCartStore, type CategoriaReal } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { tituloVisible } from '../titulos';

// Un catálogo pedido hace menos de esto se considera actual para decidir que una clase ya no existe.
const CATALOGO_RECIENTE_MS = 10_000;

const listar = (titulos: string[]) => titulos.map(t => `"${tituloVisible(t)}"`).join(', ');

// El hook corre a la vez en el checkout y en el carrito flotante: con el texto como id, el mismo
// aviso no se muestra dos veces.
const avisar = (mensaje: string) => toast(mensaje, { id: mensaje, icon: 'ℹ️', duration: 6000 });

/**
 * El carrito vive en localStorage con una copia del precio y del título del momento en que se
 * agregó cada clase. Este hook lo revalida contra el catálogo actual:
 *  - quita las clases dadas de baja (antes el pago fallaba sin decir cuál),
 *  - quita las que el usuario ya compró,
 *  - actualiza precio, título e imagen si el admin los cambió (antes se mostraba un precio y la
 *    pasarela cobraba otro),
 * y avisa con un toast qué cambió. `siempre` vuelve a pedir el catálogo al montar (checkout).
 */
export const useSincronizarCarrito = ({ siempre = false }: { siempre?: boolean } = {}) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const reemplazarCarrito = useCartStore((state) => state.reemplazarCarrito);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const idUsuario = useAuthStore((state) => state.usuario?.id);
  const hayItems = cartItems.length > 0;

  const catalogo = useQuery({
    queryKey: ['categorias'],
    queryFn: obtenerCategoriasRequest,
    enabled: hayItems,
    refetchOnMount: siempre ? 'always' : true,
  });
  const compradas = useQuery({
    // Misma caché que "Mis clases" (una sola consulta al back); acá solo hacen falta los ids.
    queryKey: claveMisClases(idUsuario),
    queryFn: obtenerMisClasesCompradas,
    select: (clases) => clases.map(c => c.id),
    enabled: hayItems && isAuthenticated,
    refetchOnMount: siempre ? 'always' : true,
  });

  // Solo se compara contra datos recién confirmados por el back (no contra un error o una carga).
  const listo = catalogo.isSuccess && Array.isArray(catalogo.data) && (!isAuthenticated || compradas.isSuccess);

  useEffect(() => {
    if (!listo || cartItems.length === 0) return;
    const porId = new Map(catalogo.data!.map(c => [c.id, c]));
    const yaCompradas = new Set(compradas.data ?? []);

    // Una clase que no figura puede ser nueva y el catálogo en caché, viejo (dura unos minutos).
    // Antes de quitarla se confirma con el catálogo actual: el efecto vuelve a correr con él.
    const faltaAlguna = cartItems.some(item => !porId.has(item.id));
    if (faltaAlguna && Date.now() - catalogo.dataUpdatedAt > CATALOGO_RECIENTE_MS) {
      if (!catalogo.isFetching) catalogo.refetch({ cancelRefetch: false });
      return;
    }

    const quitadas: string[] = [];
    const repetidas: string[] = [];
    const actualizadas: string[] = [];
    const nuevos: CategoriaReal[] = [];

    for (const item of cartItems) {
      const actual = porId.get(item.id);
      if (!actual) { quitadas.push(item.titulo); continue; }
      if (yaCompradas.has(item.id)) { repetidas.push(actual.titulo); continue; }
      const cambioPrecio = Number(item.precioArs) !== Number(actual.precioArs) || Number(item.precioUsd) !== Number(actual.precioUsd);
      if (cambioPrecio) actualizadas.push(actual.titulo);
      nuevos.push({
        id: actual.id,
        titulo: actual.titulo,
        precioArs: actual.precioArs,
        precioUsd: actual.precioUsd,
        imagenTarjeta: actual.imagenTarjeta,
      });
    }

    const cambio = nuevos.length !== cartItems.length || nuevos.some((n, i) =>
      n.titulo !== cartItems[i].titulo || n.imagenTarjeta !== cartItems[i].imagenTarjeta
      || Number(n.precioArs) !== Number(cartItems[i].precioArs) || Number(n.precioUsd) !== Number(cartItems[i].precioUsd));
    if (!cambio) return;

    reemplazarCarrito(nuevos);
    if (quitadas.length) avisar(`Quitamos ${listar(quitadas)} del carrito: ya no está disponible.`);
    if (repetidas.length) avisar(`Quitamos ${listar(repetidas)} del carrito: ya es tuya.`);
    if (actualizadas.length) avisar(`Se actualizó el precio de ${listar(actualizadas)}.`);
  }, [listo, catalogo, compradas.data, cartItems, reemplazarCarrito]);

  return { sincronizando: hayItems && !listo && !catalogo.isError };
};
