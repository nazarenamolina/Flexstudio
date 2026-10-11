import { useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { obtenerHeroRequest, type HeroSlide } from '../api/hero';
import { optimizarCloudinary } from '../imagenes';

// Misma paleta y tipografías que el resto de la home: fondo crema, tinta #131313, acento verde
// de la marca y Oswald para títulos y rótulos. Estructura de bordes rectos y tipografía grande.
const DURACION_MS = 6500;

// Se muestran si el back no responde o todavía no hay diapositivas cargadas.
const SLIDES_DE_RESPALDO: HeroSlide[] = [
  { id: 'respaldo-1', orden: 0, imagenUrl: 'https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312494/QuienSoy_ssu4xv.png' },
  { id: 'respaldo-2', orden: 1, imagenUrl: 'https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312483/Banner_jntyks.png' },
];

const optimizar = optimizarCloudinary;

// Proporciones fijas del carrusel: deben coincidir con MEDIDAS_HERO (las que recomienda el panel admin).
// Sin alto máximo: limitarlo al alto de la pantalla recortaba arriba y abajo los banners de 1920×1080
// (por ejemplo, el "BIENVENID@") en pantallas anchas y bajas. Así el banner se ve siempre entero.
const ALTO_CARRUSEL = 'aspect-[4/5] md:aspect-[16/9] w-full';

const dosDigitos = (n: number) => String(n).padStart(2, '0');

// Preferencia del sistema "reducir movimiento": sin avance automático ni desplazamiento animado.
const CONSULTA_MOVIMIENTO = '(prefers-reduced-motion: reduce)';
const suscribirMovimiento = (avisar: () => void) => {
  const consulta = window.matchMedia(CONSULTA_MOVIMIENTO);
  consulta.addEventListener('change', avisar);
  return () => consulta.removeEventListener('change', avisar);
};
const leerMovimientoReducido = () => window.matchMedia(CONSULTA_MOVIMIENTO).matches;

const tamanoTitulo = (titulo: string) => {
  if (titulo.length <= 22) return 'text-[clamp(2.4rem,6vw,8rem)]';
  if (titulo.length <= 48) return 'text-[clamp(2rem,4.5vw,5.5rem)]';
  return 'text-[clamp(1.6rem,3.4vw,4rem)]';
};

/** Enlace interno con el router; externo en otra pestaña. */
const Destino = ({ enlace, className, children, ...resto }: { enlace: string; className?: string; children: React.ReactNode; 'aria-label'?: string }) =>
  enlace.startsWith('/') ? (
    <Link to={enlace} className={className} {...resto}>{children}</Link>
  ) : (
    <a href={enlace} target="_blank" rel="noopener noreferrer" className={className} {...resto}>{children}</a>
  );

const Imagen = ({ slide, prioridad, className }: { slide: HeroSlide; prioridad: boolean; className: string }) => (
  <picture>
    {slide.imagenMovilUrl && <source media="(max-width: 767px)" srcSet={optimizar(slide.imagenMovilUrl, 900)} />}
    <img
      src={optimizar(slide.imagenUrl, 2000)}
      alt={slide.titulo || 'Flex Studio'}
      className={className}
      loading={prioridad ? 'eager' : 'lazy'}
      fetchPriority={prioridad ? 'high' : 'auto'}
      draggable={false}
    />
  </picture>
);

// Mismo botón que el resto del sitio (verde, se invierte a negro al pasar el mouse), con esquinas rectas.
const BotonAccion = ({ slide }: { slide: HeroSlide }) => {
  if (!slide.enlace || !slide.textoBoton) return null;
  return (
    <Destino
      enlace={slide.enlace}
      className="group/cta inline-flex items-center gap-3 border-2 border-[#131313] bg-[#d7f250] px-6 py-3 font-principal font-bold text-base sm:text-lg uppercase tracking-wide text-[#131313] transition-colors duration-300 hover:bg-[#131313] hover:text-[#d7f250] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#131313]/30"
    >
      {slide.textoBoton}
      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" strokeWidth={2.5} />
    </Destino>
  );
};

interface VistaProps {
  slide: HeroSlide;
  indice: number;
  total: number;
  prioridad?: boolean;
}

/** Una diapositiva. Se exporta para la vista previa del panel admin. */
export const HeroSlideVista = ({ slide, indice, total, prioridad = false }: VistaProps) => {
  // Sin título: banner de imagen completa (el texto viene dentro de la imagen).
  if (!slide.titulo) {
    // Sin versión para celulares, en el teléfono la imagen horizontal se muestra entera, sin recortar.
    const sinMovil = !slide.imagenMovilUrl;
    const imagen = (
      <Imagen
        slide={slide}
        prioridad={prioridad}
        className={`absolute inset-0 w-full h-full ${sinMovil ? 'object-contain md:object-cover' : 'object-cover'}`}
      />
    );
    return (
      <div className="relative w-full h-full bg-[#FDFDF8] overflow-hidden">
        {slide.enlace && !slide.textoBoton ? (
          <Destino enlace={slide.enlace} className="absolute inset-0" aria-label="Ver más">{imagen}</Destino>
        ) : imagen}
        {slide.textoBoton && (
          <div className="absolute left-4 bottom-4 sm:left-8 sm:bottom-8">
            <BotonAccion slide={slide} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid w-full h-full grid-rows-[38%_1fr] md:grid-rows-1 md:grid-cols-12 bg-[#FDFDF8] text-[#131313]">
      <div className="relative md:order-2 md:col-span-7 overflow-hidden border-b-2 md:border-b-0 md:border-l-2 border-[#131313]">
        <Imagen slide={slide} prioridad={prioridad} className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div className="md:order-1 md:col-span-5 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-[#131313] px-5 sm:px-8 lg:px-10 h-11 shrink-0 font-principal text-xs sm:text-sm uppercase tracking-[0.2em]">
          <span>Flex <span className="text-[#131313]/50">Studio</span></span>
          <span className="tabular-nums">{dosDigitos(indice + 1)} / {dosDigitos(total)}</span>
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 md:gap-4 lg:gap-6 px-5 sm:px-8 lg:px-10 py-4 lg:py-8">
          {slide.etiqueta && (
            <span className="self-start bg-[#d7f250] px-3 py-1 font-principal font-bold text-xs sm:text-sm uppercase tracking-widest">
              {slide.etiqueta}
            </span>
          )}
          <h2 className={`font-principal uppercase leading-[1.02] tracking-tight break-words ${tamanoTitulo(slide.titulo)}`}>
            {slide.titulo}
          </h2>
          {slide.subtitulo && (
            <p className="max-w-md text-sm md:text-base leading-relaxed opacity-90 line-clamp-2 md:line-clamp-3 lg:line-clamp-none">
              {slide.subtitulo}
            </p>
          )}
        </div>

        {slide.enlace && slide.textoBoton && (
          <div className="border-t-2 border-[#131313] px-5 sm:px-8 lg:px-10 py-4 lg:py-5 shrink-0">
            <BotonAccion slide={slide} />
          </div>
        )}
      </div>
    </div>
  );
};

// Flechas invisibles: aparecen al pasar el mouse por el carrusel o al llegar con el teclado.
const claseFlecha = 'grid place-items-center w-7 h-7 text-[#131313] opacity-0 group-hover/hero:opacity-100 focus-visible:opacity-100 hover:bg-[#d7f250] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#131313] transition-all duration-300 cursor-pointer';

export const HeroCarrusel = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['hero'],
    queryFn: obtenerHeroRequest,
  });
  const slides = !isError && data && data.length > 0 ? data : SLIDES_DE_RESPALDO;

  const [elegida, setElegida] = useState(0);
  const [pausaPorPuntero, setPausaPorPuntero] = useState(false);
  const [toqueInicio, setToqueInicio] = useState<number | null>(null);
  const movimientoReducido = useSyncExternalStore(suscribirMovimiento, leerMovimientoReducido, () => false);

  const total = slides.length;
  // Si cambia la cantidad (llegan las del back), no quedar apuntando a una que no existe.
  const actual = elegida < total ? elegida : 0;
  const ir = (indice: number) => setElegida(((indice % total) + total) % total);
  const siguiente = () => ir(actual + 1);
  const anterior = () => ir(actual - 1);
  const pausado = pausaPorPuntero || movimientoReducido;

  const alSoltar = (x: number) => {
    if (toqueInicio === null) return;
    const distancia = toqueInicio - x;
    if (distancia > 50) siguiente();
    if (distancia < -50) anterior();
    setToqueInicio(null);
  };

  if (isLoading) {
    return (
      <section aria-busy className={`w-full bg-[#FDFDF8] border-b-2 border-[#131313] ${ALTO_CARRUSEL} grid place-items-center`}>
        <span className="font-principal text-sm uppercase tracking-[0.2em] text-[#131313]/50 animate-pulse">Cargando…</span>
      </section>
    );
  }

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Destacados de Flex Studio"
      className={`group/hero relative w-full bg-[#FDFDF8] text-[#131313] border-b-2 border-[#131313] select-none overflow-hidden ${ALTO_CARRUSEL}`}
      onMouseEnter={() => setPausaPorPuntero(true)}
      onMouseLeave={() => setPausaPorPuntero(false)}
      onFocus={() => setPausaPorPuntero(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPausaPorPuntero(false); }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') siguiente();
        if (e.key === 'ArrowLeft') anterior();
      }}
      onTouchStart={(e) => setToqueInicio(e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => alSoltar(e.changedTouches[0]?.clientX ?? 0)}
    >
      {/* Pista de diapositivas */}
      <div
        className="flex h-full transition-transform duration-[650ms] ease-[cubic-bezier(0.77,0,0.18,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${actual * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${total}`}
            aria-hidden={i !== actual}
            inert={i !== actual}
            className="w-full h-full shrink-0"
          >
            <HeroSlideVista slide={slide} indice={i} total={total} prioridad={i === 0} />
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          {/* Indicadores: líneas finas; la actual se llena y al terminar pasa a la siguiente */}
          <div className="absolute right-3 bottom-3 sm:right-5 sm:bottom-5 z-10 flex items-center gap-1.5 bg-[#FDFDF8]/85 px-1 py-1">
            <button type="button" onClick={anterior} aria-label="Diapositiva anterior" className={claseFlecha}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => ir(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                aria-current={i === actual}
                className="group/seg relative w-6 sm:w-8 h-3 cursor-pointer focus-visible:outline-none"
              >
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-[#131313]/20 group-hover/seg:bg-[#131313]/40 group-focus-visible/seg:ring-2 group-focus-visible/seg:ring-[#131313] overflow-hidden">
                  <span
                    key={i === actual ? `activo-${actual}` : 'inactivo'}
                    className="absolute inset-0 origin-left bg-[#131313]"
                    style={
                      // Con movimiento reducido no hay avance automático: el indicador actual se ve lleno.
                      i === actual && !movimientoReducido
                        ? {
                            animation: `hero-progreso ${DURACION_MS}ms linear forwards`,
                            animationPlayState: pausado ? 'paused' : 'running',
                          }
                        : { transform: i === actual ? 'scaleX(1)' : 'scaleX(0)' }
                    }
                    onAnimationEnd={i === actual ? siguiente : undefined}
                  />
                </span>
              </button>
            ))}
            <button type="button" onClick={siguiente} aria-label="Diapositiva siguiente" className={claseFlecha}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <output aria-live="polite" className="sr-only">
            Diapositiva {actual + 1} de {total}
          </output>
        </>
      )}
    </section>
  );
};
