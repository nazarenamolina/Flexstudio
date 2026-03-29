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
    <main className="min-h-screen w-full bg-[#131313] pb-20 text-white overflow-x-hidden">
      <section className="relative flex min-h-[35em] w-full items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={categoria.imagenHero || "https://via.placeholder.com/1920x1080"} 
            alt={categoria.titulo} 
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/70 to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[800px] px-6 lg:ml-24 xl:ml-32">
          <span className="mb-4 inline-block tracking-[2px] text-neon-pink font-bold uppercase md:text-base">
            ELITE TRAINING PROGRAM
          </span>

          <h1 className="flex flex-col items-start leading-none mb-10">
            <span className="z-20 font-cursiva text-[2.5rem] font-semibold text-[#131313] md:text-[4rem] translate-y-[20px] translate-x-[10px] md:translate-y-[35px] md:translate-x-[15px]">
              {primeraParte}
            </span>
            <span className="z-10 font-principal text-[4rem] font-bold uppercase tracking-tighter text-neon-pink md:text-[8rem] drop-shadow-[4px_4px_15px_rgba(0,0,0,0.15)]">
              {segundaParte}
            </span>
          </h1>
          
          <p className="mb-10 max-w-[450px] text-[1.1rem] leading-[1.6] text-[#a1a1aa]">
            {categoria.descripcionDetallada || "Descripción no disponible."}
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="rounded bg-neon-pink px-8 py-4 font-bold text-[#131313] transition-colors hover:bg-[#a1a1aa] hover:text-white">
              COMPRAR AHORA ${categoria.precio}
            </button>
            {categoria.playbackIdMuestra && (
              <a href="#trailer" className="rounded bg-[#131313] px-8 py-4 font-bold text-white transition-colors hover:bg-[#a1a1aa] text-center flex items-center justify-center">
                VIEW TRAILER
              </a>
            )}
          </div>
        </div>
      </section>
      <section className="mx-auto mt-20 flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:px-8">
        <div className="flex flex-col items-start lg:w-1/3">
          <span className="mb-2 font-principal font-bold tracking-widest text-neon-pink">SUMATE!</span>
          <h2 className="mb-6 font-principal text-4xl uppercase leading-tight md:text-5xl">
            QUÉ INCLUYE LA<br />SUSCRIPCIÓN?
          </h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            {categoria.descripcionBreve || "Únete a este programa para potenciar tu técnica de forma integral y consciente."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:w-2/3">
          {categoria.beneficios && categoria.beneficios.length > 0 ? (
            categoria.beneficios.map((beneficio, index) => (
              <div key={index} className="group rounded-xl border border-[#333] bg-[#1a1a1a] p-6 transition-colors hover:border-neon-pink">
                <DynamicIcon 
                  name={beneficio.icono || 'CheckCircle'} 
                  className="mb-4 h-8 w-8 text-neon-pink transition-transform group-hover:scale-110" 
                />
                <h3 className="mb-2 font-principal text-xl">{beneficio.titulo}</h3>
                <p className="text-sm text-[#a1a1aa]">{beneficio.descripcion}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-6 border border-[#333] rounded-xl bg-[#1a1a1a]">
              <p className="text-[#a1a1aa]">Explora las ventajas exclusivas al sumarte a este programa.</p>
            </div>
          )}
        </div>
      </section>
      {categoria.playbackIdMuestra && (
        <section id="trailer" className="mx-auto mt-32 flex max-w-5xl flex-col items-center px-6 text-center">
          <span className="mb-2 font-principal font-bold tracking-widest text-neon-pink">PREVIEW</span>
          <h2 className="mb-10 font-principal text-4xl uppercase md:text-5xl">VIDEO DE MUESTRA</h2>

          <div className="w-full overflow-hidden rounded-2xl border border-[#333] bg-black shadow-[0_0_30px_rgba(255,20,147,0.15)]">
            <MuxPlayer
              playbackId={categoria.playbackIdMuestra}
              metadataVideoTitle={`Trailer - ${categoria.titulo}`}
              style={{ width: '100%', aspectRatio: '16/9' }}
            />
          </div>
        </section>
      )}

      <section className="mx-auto mt-32 flex max-w-4xl flex-col items-center rounded-[2rem] bg-[#1a1a1a] p-10 text-center md:p-16">
        <h2 className="mb-8 font-principal text-4xl uppercase leading-tight md:text-5xl">
          LISTA PARA ELEVAR TU <br /> POTENCIAL?
        </h2>
        
        <div className="mb-8 flex flex-col items-center rounded-2xl border border-neon-pink/30 bg-[#131313] p-8 md:w-2/3">
          <span className="mb-4 rounded-full bg-neon-pink/10 px-4 py-1 text-sm font-bold text-neon-pink">
            OFERTA DE LANZAMIENTO
          </span>
          <div className="font-principal text-6xl font-bold">${categoria.precio}</div>
          <button className="mt-8 w-full rounded bg-neon-pink px-8 py-4 font-principal text-xl font-bold text-[#131313] transition-transform hover:-translate-y-1">
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