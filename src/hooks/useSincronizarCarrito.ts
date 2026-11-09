import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { obtenerCategoriasRequest } from '../api/categoria';
import { obtenerEstadosModulosRequest } from '../api/modulos';
import { useCartStore, type ItemCarrito } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { nombreModulo } from '../modulos';
import { tituloVisible } from '../titulos';

// Un catálogo pedido hace menos de esto se considera actual para decidir que un mes ya no existe.
const CATALOGO_RECIENTE_MS = 10_000;

/** Clave de caché de los estados de los meses de una categoría para un usuario. */
export const claveEstadosModulos = (idUsuario: string | undefined, idCategoria: string | undefined) =>
  ['estados-modulos', idUsuario, idCategoria] as const;

// El hook corre a la vez en el checkout y en el carrito flotante: con el texto como id, el mismo
// aviso no se muestra dos veces.
const avisar = (mensaje: string) => toast(mensaje, { id: mensaje, icon: 'ℹ️', duration: 6000 });

/**
 * El carrito vive en localStorage con una copia del precio y del nombre del momento en que se
 * agregó el mes. Este hook lo revalida contra el catálogo actual y contra lo que el usuario puede
 * comprar: quita el mes si se dio de baja, si ya lo tiene vigente o si todavía está bloqueado,
 * actualiza precio, nombre e imagen si el admin los cambió, y avisa con un toast qué cambió.
 * `siempre` vuelve a pedir los datos al montar (checkout).
 */
export const useSincronizarCarrito = ({ siempre = false }: { siempre?: boolean } = {}) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const reemplazarCarrito = useCartStore((state) => state.reemplazarCarrito);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const idUsuario = useAuthStore((state) => state.usuario?.id);
  const item = cartItems[0] as ItemCarrito | undefined;
  const hayItem = !!item;

  const catalogo = useQuery({
    queryKey: ['categorias'],
    queryFn: obtenerCategoriasRequest,
    enabled: hayItem,
    refetchOnMount: siempre ? 'always' : true,
  });
  const estados = useQuery({
    queryKey: claveEstadosModulos(idUsuario, item?.idCategoria),
    queryFn: () => obtenerEstadosModulosRequest(item!.idCategoria),
    enabled: hayItem && isAuthenticated,
    refetchOnMount: siempre ? 'always' : true,
  });

  // Solo se compara contra datos recién confirmados por el back (no contra un error o una carga).
  const listo = catalogo.isSuccess && Array.isArray(catalogo.data) && (!isAuthenticated || estados.isSuccess);

  useEffect(() => {
    if (!listo || !item) return;
    const categoria = catalogo.data!.find((c) => c.modulos?.some((m) => m.id === item.id));
    const actual = categoria?.modulos?.find((m) => m.id === item.id);

    // Un mes que no figura puede ser nuevo y el catálogo en caché, viejo (dura unos minutos).
    // Antes de quitarlo se confirma con el catálogo actual: el efecto vuelve a correr con él.
    if (!actual && Date.now() - catalogo.dataUpdatedAt > CATALOGO_RECIENTE_MS) {
      if (!catalogo.isFetching) catalogo.refetch({ cancelRefetch: false });
      return;
    }

    const nombreEnCarrito = `${tituloVisible(item.titulo)}, ${item.nombreModulo}`;
    if (!actual || !categoria) {
      reemplazarCarrito([]);
      avisar(`Quitamos "${nombreEnCarrito}" del carrito: ya no está disponible.`);
      return;
    }

    const estado = estados.data?.find((m) => m.id === item.id);
    if (estado && !estado.comprable) {
      reemplazarCarrito([]);
      avisar(estado.estado === 'VIGENTE'
        ? `Quitamos "${nombreEnCarrito}" del carrito: ya es tuyo.`
        : estado.estado === 'BLOQUEADO'
          ? `Quitamos "${nombreEnCarrito}" del carrito: se habilita al terminar el Mes ${estado.requiereNumero}.`
          : `Quitamos "${nombreEnCarrito}" del carrito: ya no está disponible.`);
      return;
    }

    const nuevo: ItemCarrito = {
      id: actual.id,
      idCategoria: categoria.id,
      titulo: categoria.titulo,
      nombreModulo: nombreModulo(actual),
      precioArs: actual.precioArs,
      precioUsd: actual.precioUsd,
      imagenTarjeta: categoria.imagenTarjeta,
    };
    const cambioPrecio = Number(item.precioArs) !== Number(nuevo.precioArs) || Number(item.precioUsd) !== Number(nuevo.precioUsd);
    if (!cambioPrecio && nuevo.titulo === item.titulo && nuevo.nombreModulo === item.nombreModulo && nuevo.imagenTarjeta === item.imagenTarjeta) return;

    reemplazarCarrito([nuevo]);
    if (cambioPrecio) avisar(`Se actualizó el precio de "${tituloVisible(nuevo.titulo)}, ${nuevo.nombreModulo}".`);
  }, [listo, catalogo, estados.data, item, reemplazarCarrito]);

  // Link de pago de ese mes sin acreditar: el checkout ofrece verificarlo en vez de pagar otra vez.
  const pagoEnProceso = estados.data?.find((m) => m.id === item?.id)?.pagoEnProceso ?? null;

  return { sincronizando: hayItem && !listo && !catalogo.isError, pagoEnProceso };
};
