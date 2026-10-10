// Estilos compartidos de las pantallas de cuenta (login, registro, verificación, nueva contraseña y
// recuperación). Mismo lenguaje claro que el checkout y el perfil: tarjeta blanca con la textura del
// sitio, títulos en Oswald, verde de la marca como acento y botón redondeado verde → negro.

export const FONDO_TARJETA = "bg-white bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto/v1774312699/fondo_hwrosv.png')]";

export const claseTarjeta = `${FONDO_TARJETA} border border-neutral-100 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)]`;

export const claseEtiqueta = 'block font-principal text-sm uppercase tracking-wider text-neutral-700 mb-2 ml-1';

export const claseCampo = (conError?: unknown) =>
  `w-full bg-white border ${conError ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-300 focus:border-[#131313] focus:ring-[#d7f250]/50'} focus:ring-4 rounded-xl px-4 py-3.5 text-[#131313] placeholder-neutral-400 focus:outline-none transition-all duration-200 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed`;

export const claseError = 'mt-1.5 ml-1 text-xs text-red-600 font-semibold';

export const claseBotonPrincipal =
  'w-full flex items-center justify-center gap-2 rounded-full bg-neon-pink px-6 py-4 font-principal text-base sm:text-lg font-bold uppercase tracking-wide text-[#131313] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#131313] hover:text-white hover:shadow-md disabled:pointer-events-none disabled:opacity-60 cursor-pointer';

export const claseEnlace = 'font-bold text-[#131313] underline underline-offset-4 decoration-[#d7f250] decoration-2 hover:decoration-[#131313] transition-colors';

export const claseBotonOjo = 'absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#131313] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131313] rounded';

export const claseAvisoError = 'w-full bg-red-50 border border-red-200 text-red-700 text-sm font-medium p-4 rounded-xl flex items-center gap-3';
