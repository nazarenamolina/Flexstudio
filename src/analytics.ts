/**
 * Google Analytics 4 con consentimiento. El script de Google se carga recién cuando la persona
 * acepta en el aviso de cookies (AvisoCookies); antes no se mide nada ni se guarda ninguna cookie.
 * Sin VITE_GA_ID (por ejemplo, en desarrollo) todo esto queda apagado y el aviso no aparece.
 */
const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined)?.trim() || null;
const CLAVE_ELECCION = 'flex-cookies';

export type EleccionCookies = 'aceptadas' | 'rechazadas' | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const analyticsDisponible = () => GA_ID !== null;

// ---- Elección del aviso (guardada en el navegador) y aviso a quien la escucha
const oyentes = new Set<() => void>();

export const leerEleccion = (): EleccionCookies => {
  try {
    const valor = localStorage.getItem(CLAVE_ELECCION);
    return valor === 'aceptadas' || valor === 'rechazadas' ? valor : null;
  } catch {
    return null;
  }
};

export const suscribirEleccion = (avisar: () => void) => {
  oyentes.add(avisar);
  return () => oyentes.delete(avisar);
};

const guardarEleccion = (eleccion: EleccionCookies) => {
  try {
    if (eleccion) localStorage.setItem(CLAVE_ELECCION, eleccion);
    else localStorage.removeItem(CLAVE_ELECCION);
  } catch {
    // Sin almacenamiento (modo privado estricto): la elección dura hasta cerrar la pestaña.
  }
  oyentes.forEach((avisar) => avisar());
};

// ---- Carga de Google Analytics
let cargado = false;

const cargarGoogleAnalytics = () => {
  if (!GA_ID || cargado) return;
  cargado = true;
  window.dataLayer = window.dataLayer || [];
  // gtag necesita el objeto `arguments` (no un arreglo): así lo define Google.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  // Las visitas se mandan a mano en cada cambio de ruta (la web nunca recarga la página).
  window.gtag('config', GA_ID, { send_page_view: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
};

/** Al abrir el sitio: si la persona ya había aceptado, se carga Analytics. */
export const iniciarAnalytics = () => {
  if (leerEleccion() === 'aceptadas') cargarGoogleAnalytics();
};

export const aceptarCookies = () => {
  guardarEleccion('aceptadas');
  cargarGoogleAnalytics();
};

export const rechazarCookies = () => {
  const yaMedia = cargado;
  guardarEleccion('rechazadas');
  if (yaMedia) {
    // Había aceptado antes: se borran las cookies de Google y se recarga para que deje de medir.
    for (const nombre of document.cookie.split(';').map((c) => c.split('=')[0].trim())) {
      if (nombre === '_ga' || nombre.startsWith('_ga_')) {
        const dominio = location.hostname.replace(/^www\./, '');
        document.cookie = `${nombre}=; Max-Age=0; path=/; domain=.${dominio}`;
        document.cookie = `${nombre}=; Max-Age=0; path=/`;
      }
    }
    location.reload();
  }
};

/** Vuelve a mostrar el aviso (enlace "Preferencias de cookies" del footer). */
export const reabrirAvisoCookies = () => guardarEleccion(null);

// ---- Eventos
const enviar = (...args: unknown[]) => {
  if (cargado && window.gtag) window.gtag(...args);
};

export const registrarPagina = (ruta: string) => {
  enviar('event', 'page_view', {
    page_path: ruta,
    page_location: `${location.origin}${ruta}`,
    page_title: document.title,
  });
};

export interface ItemCompra {
  id: string;
  nombre: string;
  precio: number;
}

/** Compra confirmada (evento "purchase" de GA4: ingresos y clases vendidas). */
export const registrarCompra = (compra: { id: string; moneda: 'ARS' | 'USD'; items: ItemCompra[] }) => {
  const valor = compra.items.reduce((total, item) => total + item.precio, 0);
  enviar('event', 'purchase', {
    transaction_id: compra.id,
    currency: compra.moneda,
    value: Math.round(valor * 100) / 100,
    items: compra.items.map((item) => ({ item_id: item.id, item_name: item.nombre, price: item.precio, quantity: 1 })),
  });
};
