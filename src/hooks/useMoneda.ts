import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

export type Moneda = 'ARS' | 'USD';
export type Pasarela = 'MERCADOPAGO' | 'PAYPAL';

/** 'Argentina', 'argentina', ' AR ' → true. El país se guarda con el nombre elegido al registrarse. */
export const esPaisArgentina = (pais: string | null | undefined) => {
  const normalizado = pais?.trim().toLowerCase();
  return normalizado === 'argentina' || normalizado === 'ar';
};

const detectarPaisPorIP = async (): Promise<string | null> => {
  const respuesta = await fetch('https://get.geojs.io/v1/ip/country.json');
  if (!respuesta.ok) return null;
  const data = await respuesta.json();
  return typeof data?.country === 'string' ? data.country : null;
};

/**
 * Única regla de moneda y pasarela para todo el sitio (detalle de clase, carrito y checkout):
 *  1. Si el usuario tiene país cargado, manda ese país.
 *  2. Si no, el país por IP.
 *  3. Si no se puede detectar, USD.
 * Argentina → ARS con MercadoPago; el resto → USD con PayPal. Antes cada pantalla lo decidía
 * distinto y un usuario sin país veía pesos en el carrito pero se le cobraba en dólares.
 */
export const useMoneda = () => {
  const paisUsuario = useAuthStore((state) => state.usuario?.pais);
  const tienePais = !!paisUsuario?.trim();

  // Una sola consulta por sesión, compartida por todos los componentes que la usan.
  const { data: paisIP, isPending } = useQuery({
    queryKey: ['pais-por-ip'],
    queryFn: detectarPaisPorIP,
    enabled: !tienePais,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });

  const esArgentina = tienePais ? esPaisArgentina(paisUsuario) : esPaisArgentina(paisIP);
  const moneda: Moneda = esArgentina ? 'ARS' : 'USD';
  const pasarela: Pasarela = esArgentina ? 'MERCADOPAGO' : 'PAYPAL';

  return { moneda, pasarela, esArgentina, cargandoMoneda: !tienePais && isPending };
};
