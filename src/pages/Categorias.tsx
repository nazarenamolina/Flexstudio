import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { obtenerCategoriaPorIdRequest, type Categoria } from "../api/categoria"; 
import { Play, Video, Headset, Infinity, Medal, CheckCircle2 } from "lucide-react";

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
            {categoria.descripcionDetallada || categoria.descripcionCard || "Descripción no disponible."}
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="rounded bg-neon-pink px-8 py-4 font-bold text-[#131313] transition-colors hover:bg-[#a1a1aa] hover:text-white">
              COMPRAR AHORA ${categoria.precio}
            </button>
            <button className="rounded bg-[#131313] px-8 py-4 font-bold text-white transition-colors hover:bg-[#a1a1aa]">
              VIEW TRAILER
            </button>
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
            Durante el programa vas a potenciar tu fuerza, flexibilidad y resistencia de forma integral. Mi objetivo es que logres una coordinación y técnica impecables, siempre desde un enfoque consciente y sostenible para tu cuerpo.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:w-2/3">
          {/* Tarjeta 1 */}
          <div className="group rounded-xl border border-[#333] bg-[#1a1a1a] p-6 transition-colors hover:border-neon-pink">
            <Video className="mb-4 h-8 w-8 text-neon-pink transition-transform group-hover:scale-110" />
            <h3 className="mb-2 font-principal text-xl">Video - lecciones en alta definición</h3>
            <p className="text-sm text-[#a1a1aa]">Step-by-step 4K tutorials focusing on biomechanics and artistry.</p>
          </div>
          {/* Tarjeta 2 */}
          <div className="group rounded-xl border border-[#333] bg-[#1a1a1a] p-6 transition-colors hover:border-neon-pink">
            <Headset className="mb-4 h-8 w-8 text-neon-pink transition-transform group-hover:scale-110" />
            <h3 className="mb-2 font-principal text-xl">Soporte personalizado</h3>
            <p className="text-sm text-[#a1a1aa]">Direct access to elite coaches for form correction and feedback.</p>
          </div>
          {/* Tarjeta 3 */}
          <div className="group rounded-xl border border-[#333] bg-[#1a1a1a] p-6 transition-colors hover:border-neon-pink">
            <Infinity className="mb-4 h-8 w-8 text-neon-pink transition-transform group-hover:scale-110" />
            <h3 className="mb-2 font-principal text-xl">Acceso de por vida</h3>
            <p className="text-sm text-[#a1a1aa]">Learn at your own pace with permanent access to the curriculum.</p>
          </div>
          {/* Tarjeta 4 */}
          <div className="group rounded-xl border border-[#333] bg-[#1a1a1a] p-6 transition-colors hover:border-neon-pink">
            <Medal className="mb-4 h-8 w-8 text-neon-pink transition-transform group-hover:scale-110" />
            <h3 className="mb-2 font-principal text-xl">Certificado al finalizar</h3>
            <p className="text-sm text-[#a1a1aa]">Formal recognition of your technical proficiency in Pole Sport.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-32 flex max-w-5xl flex-col items-center px-6 text-center">
        <span className="mb-2 font-principal font-bold tracking-widest text-neon-pink">PREVIEW</span>
        <h2 className="mb-10 font-principal text-4xl uppercase md:text-5xl">VIDEO DE MUESTRA</h2>

        <div className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-[#333] bg-black">
          <button className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-neon-pink text-[#131313] transition-transform group-hover:scale-110">
            <Play fill="currentColor" size={32} className="ml-2" />
          </button>
          
          <div className="absolute bottom-0 left-0 w-full p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
              <div className="h-full w-1/3 bg-neon-pink"></div>
            </div>
          </div>
        </div>
      </section>

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