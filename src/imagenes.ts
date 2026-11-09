
export function optimizarCloudinary(url: string, ancho: number): string;
export function optimizarCloudinary(url: string | null | undefined, ancho: number): string | undefined;
export function optimizarCloudinary(url: string | null | undefined, ancho: number) {
  if (!url) return undefined;
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/') || url.includes('/image/upload/f_auto')) return url;
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${ancho}/`);
}

// Imagen de respaldo para clases sin portada. Es propia (Cloudinary): las de servicios externos
// (placehold.co, Unsplash) las bloquea la CSP de vercel.json y se veían rotas en producción.
export const IMAGEN_RESPALDO_CLASE =
  'https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto,c_fill,w_800/v1791730474/bio-cande_fjzalb.webp';
