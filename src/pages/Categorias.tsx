import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { obtenerCategoriaPorIdRequest } from "../api/categoria";
import { ShoppingCart, Check, PlayCircle, Loader2, SearchX } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { DynamicIcon } from "../components/IconPicker";
import { useMoneda } from "../hooks/useMoneda";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { ScrollReveal } from "../components/ScrollReveal";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { DatosCurso } from "../components/DatosCurso";
import { ListaMeses } from "../components/ListaMeses";
import { claveEstadosModulos } from "../hooks/useSincronizarCarrito";
import { obtenerEstadosModulosRequest } from "../api/modulos";
import { estadosParaVisitante, MESES_ACCESO, nombreModulo, type ModuloConEstado } from "../modulos";
import { precioEn, formatearPrecio } from "../precios";
import { IMAGEN_RESPALDO_CLASE, optimizarCloudinary } from "../imagenes";
import { claseTarjeta, claseBotonPrincipal } from "./auth/estilos";
import { partesDelTitulo, tituloVisible } from "../titulos";

// Texto que muestra Google debajo del título de una clase. Usa el más completo que haya cargado
// el admin (la descripción de la tarjeta suele ser de pocas palabras); si no hay ninguno, uno
// genérico, para que nunca quede vacío o con la descripción de la home.
const LARGO_MINIMO_TEXTO = 60;
const descripcionParaGoogle = (clase: { titulo: string; descripcionCard?: string | null; descripcionBreve?: string | null; descripcionDetallada?: string | null }) => {
  const nombre = tituloVisible(clase.titulo);
  const textos = [clase.descripcionDetallada, clase.descripcionBreve, clase.descripcionCard]
    .map((t) => t?.replace(/\s+/g, ' ').trim())
    .filter((t): t is string => !!t);
  const texto = textos.find((t) => t.length >= LARGO_MINIMO_TEXTO) ?? textos[0];
  return texto
    ? `${nombre}: ${texto}`
    : `${nombre}: clase online de flexibilidad con Cande Imbaud. Videos para entrenar a tu ritmo, desde casa.`;
};

const CategoriaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Misma caché que el resto del sitio para el detalle de una clase.
  const { data: categoria, isPending: cargando, error } = useQuery({
    queryKey: ["categoria", id],
    queryFn: () => obtenerCategoriaPorIdRequest(id!),
    enabled: !!id,
    retry: 1,
  });
  const { moneda, cargandoMoneda } = useMoneda();
  const descripcionGoogle = categoria ? descripcionParaGoogle(categoria) : null;
  useTituloPagina(categoria && tituloVisible(categoria.titulo), descripcionGoogle);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const esAdmin = useAuthStore((state) => state.usuario?.rol === 'ADMIN');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const idUsuario = useAuthStore((state) => state.usuario?.id);
  const estados = useQuery({
    queryKey: claveEstadosModulos(idUsuario, id),
    queryFn: () => obtenerEstadosModulosRequest(id!),
    enabled: !!id && isAuthenticated,
  });

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center" aria-busy>
        <Loader2 className="h-10 w-10 animate-spin text-[#131313]" />
      </div>
    );
  }

  if (error || !categoria) {
    // La API devuelve el mensaje como texto (por ejemplo, "La categoría con ID … no existe").
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-20">
        <div role="alert" className={`${claseTarjeta} max-w-md w-full p-8 text-center flex flex-col items-center gap-4 text-[#131313]`}>
          <SearchX className="h-12 w-12" />
          <h1 className="font-principal text-3xl uppercase">Clase no encontrada</h1>
          <p className="text-neutral-600">Puede que ya no esté disponible o que el enlace esté incompleto.</p>
          <Link to="/#clases" className={claseBotonPrincipal.replace('w-full', 'w-auto')}>Ver todas las clases</Link>
        </div>
      </div>
    );
  }

  const { cursiva: primeraParte, destacada: segundaParte } = partesDelTitulo(categoria.titulo);
  const titulo = tituloVisible(categoria.titulo);
  // Con sesión manda lo que dice el back. Si todavía no respondió, se muestra lo mismo que a un
  // visitante; la compra la vuelve a validar el back.
  const modulos: ModuloConEstado[] = isAuthenticated && estados.data
    ? estados.data
    : estadosParaVisitante(categoria.modulos ?? []);
  const cargandoEstados = isAuthenticated && estados.isPending;
  // El admin entra a cualquier clase sin comprarla.
  const tieneAcceso = esAdmin || modulos.some((m) => m.estado === 'VIGENTE');
  const siguienteParaComprar = modulos.find((m) => m.comprable && m.estado === 'COMPRABLE') ?? modulos.find((m) => m.comprable);
  const idEnCarrito = cartItems[0]?.id;
  // Sin precio en la moneda del visitante no se puede comprar (el back la rechazaría).
  const precio = siguienteParaComprar ? precioEn(siguienteParaComprar, moneda) : null;
  const estaEnCarrito = !!siguienteParaComprar && idEnCarrito === siguienteParaComprar.id;

  const handleAgregarAlCarrito = (modulo: ModuloConEstado) => {
    const nombre = nombreModulo(modulo);
    const reemplaza = !!idEnCarrito && idEnCarrito !== modulo.id;
    addToCart({
      id: modulo.id,
      idCategoria: categoria.id,
      titulo: categoria.titulo,
      nombreModulo: nombre,
      precioArs: modulo.precioArs,
      precioUsd: modulo.precioUsd,
      imagenTarjeta: categoria.imagenTarjeta,
    });
    toast.success((t) => (
      <span className="flex items-center gap-3">
        {reemplaza ? `Se compra de a un mes: ahora tu carrito tiene "${nombre}".` : `Agregaste "${nombre}" al carrito.`}
        <button
          type="button"
          onClick={() => { toast.dismiss(t.id); navigate('/carrito'); }}
          className="shrink-0 rounded-full bg-[#d7f250] px-3 py-1 text-xs font-bold uppercase text-[#131313] cursor-pointer"
        >
          Ver carrito
        </button>
      </span>
    ), { duration: 5000 });
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <DatosCurso clase={categoria} titulo={titulo} descripcion={descripcionGoogle ?? titulo} />
      
      {/* SECCIÓN HERO */}
      <section className="relative flex min-h-[50em] w-full items-start pt-25 pb-20 md:pt-30 lg:pt-30 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={optimizarCloudinary(categoria.imagenHero || IMAGEN_RESPALDO_CLASE, 1600)}
            alt={titulo}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent"></div>
        </div>

        <ScrollReveal direction="up" className="relative z-10 mx-auto w-full px-6 lg:ml-24 xl:ml-32">
          <span className="inline-block tracking-[3px] text-neon-pink font-bold uppercase text-[0.6rem] md:text-[1rem]">
            Clase online · A tu ritmo
          </span>
          <h1 className="flex flex-col items-start leading-none mb-10 w-full max-w-full">
            {primeraParte && (
              <span className="z-20 font-cursiva text-[3.5rem] font-semibold text-[#ffffff] md:text-[6.5rem] translate-y-[20px] translate-x-[5px] md:translate-y-[40px] md:translate-x-[8px]">
                {primeraParte}
              </span>
            )}
            <span className="z-10 font-principal text-[3.9rem] md:text-[8rem] font-bold uppercase tracking-tighter text-neon-pink max-w-full break-words">
              {segundaParte}
            </span>
          </h1>
          <p className="mb-10 max-w-[80%] text-[1.1rem] leading-[1.6] text-[#a1a1aa]">
            {categoria.descripcionDetallada || "Descripción no disponible."}
          </p>
        
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
            {tieneAcceso ? (
              <button
                onClick={() => navigate(`/mis-clases/${categoria.id}`)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#ffffff] px-8 py-4 font-principal text-xl font-bold text-[#131313] shadow-[0_0_20px_rgba(255,255,255,0.3)] transition duration-700 hover:-translate-y-1 hover:bg-[#d7f250] cursor-pointer"
              >
                <PlayCircle size={22} /> VER MASTERCLASS
              </button>
            ) : siguienteParaComprar?.pagoEnProceso ? (
              <a
                href="#meses"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-amber-100 px-8 py-4 font-principal text-xl font-bold text-[#131313] transition duration-700 hover:-translate-y-1 hover:bg-[#ffffff]"
              >
                PAGO DEL MES {siguienteParaComprar.numero} EN PROCESO
              </a>
            ) : siguienteParaComprar ? (
              <button
                onClick={() => handleAgregarAlCarrito(siguienteParaComprar)}
                disabled={estaEnCarrito || cargandoMoneda || cargandoEstados || precio === null}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-8 py-4 font-principal text-xl font-bold cursor-pointer transition duration-700 hover:-translate-y-1 disabled:hover:translate-y-0 ${estaEnCarrito || precio === null
                  ? 'bg-[#ffffff] text-[#131313] cursor-not-allowed opacity-80'
                  : 'bg-neon-pink text-[#131313] hover:bg-[#ffffff] hover:text-[#131313]'
                  }`}
              >
                {cargandoMoneda ? 'CALCULANDO PRECIO…'
                  : precio === null ? 'NO DISPONIBLE EN TU MONEDA'
                  : estaEnCarrito ? <><Check size={20} /> YA ESTÁ EN TU CARRITO</>
                  : <><ShoppingCart size={20} /> AGREGAR MES {siguienteParaComprar.numero} · {formatearPrecio(precio, moneda)}</>}
              </button>
            ) : (
              <span className="w-full sm:w-auto flex items-center justify-center rounded-full bg-[#ffffff] px-8 py-4 font-principal text-xl font-bold text-[#131313] opacity-80">
                PRÓXIMAMENTE
              </span>
            )}

            {modulos.length > 0 && (
              <a
                href="#meses"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 font-principal text-xl font-bold text-white transition duration-700 hover:-translate-y-1 hover:bg-white hover:text-[#131313] text-center"
              >
                VER MESES
              </a>
            )}

            {categoria.playbackIdMuestra && (
              <a 
                href="#trailer" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-neon-pink px-8 py-4 font-principal text-xl font-bold text-[#131313] cursor-pointer transition hover:bg-[#ffffff] hover:text-[#131313] duration-700 hover:-translate-y-1 text-center"
              >
                PREVIEW
              </a>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* SECCIÓN MESES */}
      {modulos.length > 0 && (
        <section id="meses" className="mx-auto mt-16 max-w-5xl scroll-mt-32 px-6 lg:px-8">
          <h2 className="mb-3 font-principal text-4xl uppercase leading-tight md:text-5xl text-[#131313]">Meses de la clase</h2>
          <p className="mb-8 max-w-3xl leading-relaxed text-neutral-600">
            Cada mes se compra por separado y el acceso dura {MESES_ACCESO} meses desde el pago. El mes siguiente se habilita cuando terminás todos los videos del anterior.
          </p>
          <ListaMeses idCategoria={categoria.id} modulos={modulos} idEnCarrito={idEnCarrito} onAgregar={handleAgregarAlCarrito} />
        </section>
      )}

      {/* SECCIÓN BENEFICIOS */}
      <section className="mx-auto mt-20 mb-10 flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:px-8 overflow-hidden">
        
        <ScrollReveal direction="right" className="flex flex-col items-start lg:w-1/3">
          <span className="mb-2 font-principal font-bold tracking-widest text-neon-pink">¡SUMATE!</span>
          <h2 className="mb-6 font-principal text-4xl uppercase leading-tight md:text-5xl text-[#131313]">
            ¿QUÉ INCLUYE<br />LA CLASE?
          </h2>
          <p className="text-[#7c7c84] leading-relaxed">
            {categoria.descripcionBreve || "Únete a este programa para potenciar tu técnica de forma integral y consciente."}
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:w-2/3">
          {categoria.beneficios && categoria.beneficios.length > 0 ? (
            categoria.beneficios.map((beneficio, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.15}>
                <div className="group rounded-xl bg-[#d7f250] p-6 transition-all duration-700 hover:bg-[#131313] hover:text-neon-pink active:bg-[#131313] active:text-neon-pink h-full">
                  <DynamicIcon
                    name={beneficio.icono || 'CheckCircle'}
                    className="mb-4 h-8 w-8 text-[#131313] transition-all duration-700 group-hover:scale-110 group-hover:text-neon-pink group-active:scale-110 group-active:text-neon-pink"
                  />
                  <h3 className="mb-2 font-principal text-xl">{beneficio.titulo}</h3>
                  <p className="text-sm text-[#131313a0] transition-colors duration-700 group-hover:text-[#a1a1aa] group-active:text-[#a1a1aa]">{beneficio.descripcion}</p>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <ScrollReveal direction="up" className="col-span-2">
              <div className="p-6 rounded-xl border border-neutral-200 bg-white">
                <p className="text-neutral-600">Acceso a todos los videos de la clase, a tu ritmo y desde cualquier dispositivo.</p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* SECCIÓN PREVIEW */}
      {categoria.playbackIdMuestra && (
        <section id="trailer" className="relative w-full bg-[#131313] py-20 lg:py-32 overflow-hidden border-t border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d7f250] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[90%] px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              <ScrollReveal direction="right" className="flex flex-col items-start text-left order-2 lg:order-1 lg:col-span-4">
                <span className="mb-4 font-principal font-bold tracking-[0.3em] text-neon-pink text-xs sm:text-sm uppercase">
                  Adelanto de la clase
                </span>
                <h2 className="mb-6 font-principal text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase leading-[0.95]">
                  Mirá cómo <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">es por dentro</span>
                </h2>
                <p className="text-[#a1a1aa] text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                  {categoria.descripcionCard || 'Un adelanto de lo que vas a encontrar en los videos de la clase.'}
                </p>
                <div className="w-12 h-1.5 bg-[#d7f250] rounded-full" />
              </ScrollReveal>
              
              {/* Reproductor de Video - Entra desde la derecha con un ligero retraso */}
              <ScrollReveal direction="left" delay={0.2} className="relative order-2 lg:order-1 lg:col-span-8 w-full">
                <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[32px] border border-white/5 transform rotate-2 md:rotate-3 scale-105 opacity-70 hidden sm:block" />

                <div className="relative w-full overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-[0_0_40px_rgba(215,242,80,0.15)] transition-all duration-500 hover:shadow-[0_0_50px_rgba(215,242,80,0.3)] hover:-translate-y-2 border border-white/10 z-10">
                  <MuxPlayer
                    playbackId={categoria.playbackIdMuestra}
                    metadataVideoTitle={`Trailer - ${titulo}`}
                    primaryColor="#ffffff"
                    accentColor="#d7f250"
                    style={{ width: '100%', aspectRatio: '16/9', '--mux-player-control-bar-base-color': 'rgba(19, 19, 19, 0.85)' }}
                  />
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default CategoriaDetailPage;