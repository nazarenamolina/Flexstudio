/**
 * Achica una imagen en el navegador antes de subirla: lado más largo de hasta LADO_MAXIMO px y
 * WebP con buena calidad. Las fotos de celular pesan 5-15 MB y el back acepta hasta 5 MB (8 en el
 * hero); así casi siempre entran, y se suben en segundos. Al mostrarlas Cloudinary igual entrega
 * la versión justa para cada pantalla, así que no se ven peor.
 *
 * Si algo falla (un formato que el navegador no sabe leer, como HEIC en Chrome), devuelve el archivo
 * original y el back decide como hasta ahora.
 */
const LADO_MAXIMO = 2560;
const CALIDAD = 0.85;
// Una imagen ya chica y en un formato aceptado se sube tal cual: recomprimirla solo la empeora.
const SIN_TOCAR_HASTA_BYTES = 600 * 1024;
const FORMATOS_ACEPTADOS = ['image/jpeg', 'image/png', 'image/webp'];

const aBlob = (lienzo: HTMLCanvasElement, tipo: string) =>
  new Promise<Blob | null>((resolver) => lienzo.toBlob(resolver, tipo, CALIDAD));

export async function prepararImagen(archivo: File): Promise<File> {
  if (!archivo.type.startsWith('image/') || archivo.type === 'image/gif' || archivo.type === 'image/svg+xml') return archivo;
  let imagen: ImageBitmap | null = null;
  try {
    // Respeta la orientación de la foto (EXIF), como la muestra el celular.
    imagen = await createImageBitmap(archivo, { imageOrientation: 'from-image' });
    const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height));
    const aceptada = FORMATOS_ACEPTADOS.includes(archivo.type);
    if (escala === 1 && aceptada && archivo.size <= SIN_TOCAR_HASTA_BYTES) return archivo;

    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(imagen.width * escala);
    lienzo.height = Math.round(imagen.height * escala);
    const contexto = lienzo.getContext('2d');
    if (!contexto) return archivo;
    contexto.imageSmoothingQuality = 'high';
    contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);

    // Los Safari viejos no generan WebP (devuelven PNG): ahí se usa JPEG.
    let blob = await aBlob(lienzo, 'image/webp');
    let extension = 'webp';
    if (!blob || blob.type !== 'image/webp') {
      blob = await aBlob(lienzo, 'image/jpeg');
      extension = 'jpg';
    }
    if (!blob) return archivo;
    // Sin achicar las medidas, si no pesa menos no vale la pena cambiarla.
    if (escala === 1 && aceptada && blob.size >= archivo.size) return archivo;

    const nombre = `${archivo.name.replace(/\.[^.]+$/, '') || 'imagen'}.${extension}`;
    return new File([blob], nombre, { type: blob.type, lastModified: Date.now() });
  } catch {
    return archivo;
  } finally {
    imagen?.close();
  }
}
