import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerCategoriaPorIdRequest, type Categoria } from "../api/categoria";
import {ShoppingCart, Check, PlayCircle } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { DynamicIcon } from "../components/IconPicker";
import { useMoneda } from "../hooks/useMoneda";
import { useCartStore } from "../store/cartStore";
import { useMisClases } from "../hooks/useMisClases";

const CategoriaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { moneda, cargandoMoneda } = useMoneda();
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const { clases: misClases, cargando: cargandoMisClases } = useMisClases();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        if (!id) return;
        const data = await obtenerCategoriaPorIdRequest(id);
        setCategoria(data);
      } catch (err) {
        setError(typeof err === 'string' ? err : "No se pudo encontrar la información de esta clase.");
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [id]);

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#131313] text-white">
        <span className="animate-pulse text-xl font-principal tracking-widest text-neon-pink">
          Cargando la masterclass...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#131313]">
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-6 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!categoria) return null;

  const precioAMostrar = moneda === 'ARS' ? categoria.precioArs : categoria.precioUsd;
  const simbolo = moneda === 'ARS' ? '$' : 'U$D';
  const tituloPartes = categoria.titulo ? categoria.titulo.split(" ") : ["CLASE", "EXCLUSIVA"];
  const primeraParte = tituloPartes.slice(0, Math.ceil(tituloPartes.length / 2)).join(" ");
  const segundaParte = tituloPartes.slice(Math.ceil(tituloPartes.length / 2)).join(" ");
  const estaEnCarrito = cartItems.some(item => item.id === categoria.id);
  const yaComprado = misClases.some((c) => c.id === categoria.id);

  const handleAgregarAlCarrito = () => {
    if (!categoria) return;

    addToCart({
      id: categoria.id,
      titulo: categoria.titulo,
      precioArs: categoria.precioArs,
      imagenTarjeta: categoria.imagenTarjeta,
      precioUsd: categoria.precioUsd,
    });
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
  <section className="relative flex min-h-[50em] w-full items-start pt-25 pb-20 md:pt-30 lg:pt-30 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={categoria.imagenHero}
            alt={categoria.titulo}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 mx-auto w-full px-6 lg:ml-24 xl:ml-32">
          <span className="inline-block tracking-[3px] text-neon-pink font-bold uppercase text-[0.6rem] md:text-[1rem]">
            ELITE TRAINING PROGRAM
          </span>
          <h1 className="flex flex-col items-start leading-none mb-10 w-full max-w-full">
            <span className="z-20 font-cursiva text-[3.5rem] font-semibold text-[#ffffff] md:text-[6.5rem] translate-y-[20px] translate-x-[5px] md:translate-y-[40px] md:translate-x-[8px]">
              {primeraParte}
            </span>
            <span className="z-10 font-principal text-[3.9rem] md:text-[8rem] font-bold uppercase tracking-tighter text-neon-pink max-w-full break-words">
              {segundaParte}
            </span>
          </h1>
          <p className="mb-10 max-w-[80%] text-[1.1rem] leading-[1.6] text-[#a1a1aa]">
            {categoria.descripcionDetallada || "Descripción no disponible."}
          </p>
        
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">

            {yaComprado ? (
              <button
                onClick={() => navigate(`/mis-clases/${categoria.id}`)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#ffffff] px-8 py-4 font-principal text-xl font-bold text-[#131313] shadow-[0_0_20px_rgba(255,255,255,0.3)] transition duration-700 hover:-translate-y-1 hover:bg-[#d7f250] cursor-pointer"
              >
                <PlayCircle size={22} /> VER MASTERCLASS
              </button>
            ) : (
              <button
                onClick={handleAgregarAlCarrito}
                disabled={estaEnCarrito || cargandoMoneda || cargandoMisClases}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-8 py-4 font-principal text-xl font-bold cursor-pointer transition duration-700 hover:-translate-y-1 ${estaEnCarrito
                  ? 'bg-[#ffffff] text-[#131313] cursor-not-allowed opacity-80'
                  : 'bg-neon-pink text-[#131313] hover:bg-[#ffffff] hover:text-[#131313]'
                  }`}
              >
                {cargandoMoneda ? 'CALCULANDO PRECIO...' : (
                  estaEnCarrito ? (
                    <><Check size={20} /> YA ESTÁ EN TU CARRITO</>
                  ) : (
                    <><ShoppingCart size={20} /> COMPRAR AHORA {simbolo}{precioAMostrar}</>
                  )
                )}
              </button>
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
        </div>
      </section>

      <section className="mx-auto mt-20 mb-10 flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:px-8">
        <div className="flex flex-col items-start lg:w-1/3">
          <span className="mb-2 font-principal font-bold tracking-widest text-neon-pink">SUMATE!</span>
          <h2 className="mb-6 font-principal text-4xl uppercase leading-tight md:text-5xl text-[#131313]">
            QUÉ INCLUYE LA<br />SUSCRIPCIÓN?
          </h2>
          <p className="text-[#7c7c84] leading-relaxed">
            {categoria.descripcionBreve || "Únete a este programa para potenciar tu técnica de forma integral y consciente."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:w-2/3">
          {categoria.beneficios && categoria.beneficios.length > 0 ? (
            categoria.beneficios.map((beneficio, index) => (
              <div key={index} className="group rounded-xl bg-[#d7f250] p-6 transition-all duration-700 hover:bg-[#131313] hover:text-neon-pink active:bg-[#131313] active:text-neon-pink">
                <DynamicIcon
                  name={beneficio.icono || 'CheckCircle'}
                  className="mb-4 h-8 w-8 text-[#131313] transition-all duration-700 group-hover:scale-110 group-hover:text-neon-pink group-active:scale-110 group-active:text-neon-pink"
                />
                <h3 className="mb-2 font-principal text-xl">{beneficio.titulo}</h3>
                <p className="text-sm text-[#131313a0] transition-colors duration-700 group-hover:text-[#a1a1aa] group-active:text-[#a1a1aa]">{beneficio.descripcion}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-6 border border-[#333] rounded-xl bg-[#1a1a1a]">
              <p className="text-[#a1a1aa]">Explora las ventajas exclusivas al sumarte a este programa.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN PREVIEW (Diseño Asimétrico Editorial) */}
      {categoria.playbackIdMuestra && (
        <section id="trailer" className="relative w-full bg-[#131313] py-20 lg:py-32 overflow-hidden border-t border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d7f250] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[90%] px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="flex flex-col items-start text-left order-2 lg:order-1 lg:col-span-4">
                <span className="mb-4 font-principal font-bold tracking-[0.3em] text-neon-pink text-xs sm:text-sm uppercase">
                  Adelanto Exclusivo
                </span>
                <h2 className="mb-6 font-principal text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase leading-[0.95]">
                  Potencia <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Tus Capacidades</span>
                </h2>
                <p className="text-[#a1a1aa] text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                  Una experiencia diseñada para mejorar tu técnica, control y rendimiento.
                </p>
                <div className="w-12 h-1.5 bg-[#d7f250] rounded-full" />
              </div>
              <div className="relative order-2 lg:order-1 lg:col-span-8 w-full">
                <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[32px] border border-white/5 transform rotate-2 md:rotate-3 scale-105 opacity-70 hidden sm:block" />

                <div className="relative w-full overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-[0_0_40px_rgba(215,242,80,0.15)] transition-all duration-500 hover:shadow-[0_0_50px_rgba(215,242,80,0.3)] hover:-translate-y-2 border border-white/10 z-10">
                  <MuxPlayer
                    playbackId={categoria.playbackIdMuestra}
                    metadataVideoTitle={`Trailer - ${categoria.titulo}`}
                    primaryColor="#ffffff"
                    accentColor="#d7f250"
                    style={{ width: '100%', aspectRatio: '16/9', ['--mux-player-control-bar-base-color' as any]: 'rgba(19, 19, 19, 0.85)' }}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default CategoriaDetailPage;