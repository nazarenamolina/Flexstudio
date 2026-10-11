import { type Categoria } from '../api/categoria';
import { optimizarCloudinary } from '../imagenes';

const SITIO = 'https://www.flexstudio.com.ar';

// "1h 05m" o "45m" (duracionTotalFormateada del back) → duración ISO 8601 ("PT1H5M").
const duracionIso = (formateada?: string) => {
  const horas = Number(formateada?.match(/(\d+)\s*h/)?.[1] ?? 0);
  const minutos = Number(formateada?.match(/(\d+)\s*m/)?.[1] ?? 0);
  if (!horas && !minutos) return undefined;
  return `PT${horas ? `${horas}H` : ''}${minutos ? `${minutos}M` : ''}`;
};

interface Props {
  clase: Categoria;
  titulo: string;
  descripcion: string;
}

/**
 * Datos estructurados (Schema.org) de una clase: Google la reconoce como un curso online, con su
 * precio y quién lo da, y puede mostrarla con ese formato en los resultados. La organización
 * (#organizacion) está definida en index.html.
 */
export const DatosCurso = ({ clase, titulo, descripcion }: Props) => {
  const ofertas = [
    { precio: Number(clase.precioArs), moneda: 'ARS' },
    { precio: Number(clase.precioUsd), moneda: 'USD' },
  ]
    .filter((o) => Number.isFinite(o.precio) && o.precio > 0)
    .map((o) => ({
      '@type': 'Offer',
      category: 'Paid',
      price: o.precio,
      priceCurrency: o.moneda,
      availability: 'https://schema.org/InStock',
      url: `${SITIO}/categorias/${clase.id}`,
    }));

  const datos = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: titulo,
    description: descripcion,
    url: `${SITIO}/categorias/${clase.id}`,
    inLanguage: 'es',
    image: optimizarCloudinary(clase.imagenTarjeta || clase.imagenHero, 1200),
    provider: { '@type': 'Organization', '@id': `${SITIO}/#organizacion`, name: 'Flex Studio', sameAs: SITIO },
    ...(ofertas.length ? { offers: ofertas } : {}),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      ...(duracionIso(clase.duracionTotalFormateada) ? { courseWorkload: duracionIso(clase.duracionTotalFormateada) } : {}),
      instructor: { '@type': 'Person', '@id': `${SITIO}/#cande`, name: 'Cande Imbaud' },
    },
  };

  // "<" escapado: un texto de la clase con "</script>" no puede cerrar el bloque antes de tiempo.
  const json = JSON.stringify(datos).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
};
