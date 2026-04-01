import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { obtenerCategoriaPorIdRequest, type Categoria } from "../api/categoria"; 
import { CheckCircle2 } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { DynamicIcon } from "../components/IconPicker"; 

const CategoriaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const tituloPartes = categoria.titulo ? categoria.titulo.split(" ") : ["CLASE", "EXCLUSIVA"];
  const primeraParte = tituloPartes.slice(0, Math.ceil(tituloPartes.length / 2)).join(" ");
  const segundaParte = tituloPartes.slice(Math.ceil(tituloPartes.length / 2)).join(" ");

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      
      <section className="relative flex min-h-[50em] w-full items-start pt-25 md:pt-30 lg:pt-30 overflow-hidden">
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
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="mt-8 rounded-full bg-neon-pink px-8 py-4 font-principal text-xl font-bold text-[#131313] cursor-pointer transition hover:bg-[#ffffff] hover:text-[#131313] duration-700 hover:-translate-y-1">
              COMPRAR AHORA ${categoria.precio}
            </button>
            {/* Si hay video, mostramos el botón de Trailer que podría scrollear hacia abajo */}
            {categoria.playbackIdMuestra && (
              <a href="#trailer" className="mt-8 rounded-full bg-neon-pink px-8 py-4 font-principal text-xl font-bold text-[#131313] cursor-pointer transition hover:bg-[#ffffff] hover:text-[#131313] duration-700 hover:-translate-y-1">
                PREVIEW
              </a>
            )}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: BENEFICIOS */}
      <section className="mx-auto mt-20 flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:px-8">
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
          {/* Renderizado dinámico de beneficios */}
          {categoria.beneficios && categoria.beneficios.length > 0 ? (
            categoria.beneficios.map((beneficio, index) => (
              <div key={index} className="group rounded-xl bg-[#d7f250] p-6 transition-all duration-700 hover:bg-[#131313] hover:text-neon-pink active:bg-[#131313] active:text-neon-pink">
                {/* Renderizamos el ícono dinámico que Cande eligió en el admin */}
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

      {/* SECCIÓN 3: PREVIEW (MUX PLAYER) */}
      {/* Solo mostramos esta sección si realmente existe un video de muestra */}
      <section className="bg-[#131313] my-15 py-1">
      {categoria.playbackIdMuestra && (
        <section id="trailer" className="mx-auto my-10 flex max-w-5xl flex-col items-center px-6 text-center">
          <span className="mb-2 font-principal font-bold tracking-widest text-neon-pink">PREVIEW</span>
          <h2 className="mb-10 font-principal text-4xl text-white uppercase md:text-5xl">VIDEO DE MUESTRA</h2>

          <div className="w-full overflow-hidden rounded-2xl bg-black shadow-[0_0_30px_rgba(215,242,80,0.2)] transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(215,242,80,0.4)]">
            <MuxPlayer
          playbackId={categoria.playbackIdMuestra}
          metadataVideoTitle={`Trailer - ${categoria.titulo}`}
          primaryColor="#ffffff"
          accentColor="#d7f250"        
         style={{ width: '100%', aspectRatio: '16/9', ['--mux-player-control-bar-base-color' as any]: 'rgba(19, 19, 19, 0.85)'}} 
        />
          </div>
        </section>
      )}
      </section>

      {/* SECCIÓN 4: CALL TO ACTION */}
      <section className="mx-auto w-[90%] my-15 flex max-w-4xl flex-col items-center rounded-[2rem] bg-[#1a1a1a] p-10 text-center md:p-16">
        <h2 className="mb-8 font-principal text-4xl text-neon-pink uppercase leading-tight md:text-5xl">
          LISTA PARA ELEVAR TU <br /> POTENCIAL?
        </h2>
        
        <div className="mb-8 flex flex-col items-center rounded-2xl bg-neon-pink/40 p-8 md:w-2/3">
          <span className="mb-4 rounded-full bg-[#131313]/50 px-4 py-1 text-sm font-bold text-white">
            OFERTA DE LANZAMIENTO
          </span>
          <div className="font-principal text-white text-4xl sm:text-5xl md:text-6xl font-bold w-full text-center tracking-tight">${categoria.precio}</div>
          <button className="mt-8 w-full rounded-full bg-neon-pink px-4 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313] cursor-pointer transition hover:bg-[#ffffff] hover:text-[#131313] duration-700 hover:-translate-y-1">
            COMPRAR AHORA
          </button>
        </div>

        <div className="flex flex-col flex-wrap justify-center gap-4 text-sm font-medium text-[#a1a1aa] md:flex-row md:gap-8">
          <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-neon-pink" /> SECURE PAYMENT</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-neon-pink" /> INSTANT ACCESS</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-neon-pink" /> 30-DAY GUARANTEE</span>
        </div>
      </section>

    </main>
  );
};

export default CategoriaDetailPage;