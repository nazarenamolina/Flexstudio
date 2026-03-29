import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { obtenerCategoriasRequest, type Categoria } from '../api/categoria';

const HomePage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [flippedCard, setFlippedCard] = useState<string | number | null>(null);

  const slides = [
    'https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312494/QuienSoy_ssu4xv.png',
    'https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312483/Banner_jntyks.png'
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches.length > 0) {
      setTouchStart(e.targetTouches[0].clientX);
    };
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches.length > 0) {
      setTouchEnd(e.targetTouches[0].clientX);
    };
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerCategoriasRequest();
        if (Array.isArray(data)) {
          setCategorias(data);
        } else if (data && Array.isArray((data as any).categorias)) {
          setCategorias((data as any).categorias);
        } else {
          setCategorias([]);
        }
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
        setCategorias([]);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <main className="min-h-screen font-sans text-[#161616] pt-[72px]">
      <section
        className="relative w-full h-[50vh] sm:h-[60vh] md:h-[60vh] lg:h-[75vh] xl:h-[100vh] overflow-hidden group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full shrink-0 relative bg-none">
              <img src={slide} alt={`Slide ${index}`} className="w-full h-full" />
            </div>
          ))}
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d7f250] hover:text-black text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10">
          <ChevronLeft className="w-6 h-6 cursor-pointer" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d7f250] hover:text-black text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10">
          <ChevronRight className="w-6 h-6 cursor-pointer" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-[#d7f250] w-8" : "bg-white/50 hover:bg-white"
                }`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pt-16 pb-4">
        <div className="flex justify-center mt-0 mb-16">
          <img
            src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312501/titulo_rue8kw.png"
            alt="Explorar Clases"
            className="w-full md:h-60"
          />
        </div>

        <article className="flex flex-wrap justify-center gap-[25px]">
          {cargando ? (
            <div className="w-full text-center py-10">
              <h4 className="text-xl text-gray-400 font-bold animate-pulse">Cargando clases disponibles...</h4>
            </div>
          ) : categorias.length === 0 ? (
            <div className="w-full text-center py-10">
              <p className="text-gray-400">Aún no hay categorías disponibles.</p>
            </div>
          ) : (
            categorias.map((servicio) => (
              <div
                key={servicio.id}
                className="relative w-full max-w-[416px] h-[512px] group [perspective:1000px] cursor-pointer"
                onClick={() => setFlippedCard(flippedCard === servicio.id ? null : servicio.id)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] rounded-[30px] shadow-[0_15px_35px_rgba(0,0,0,0.2)] lg:group-hover:[transform:rotateY(180deg)] ${flippedCard === servicio.id ? '[transform:rotateY(180deg)]' : ''
                    }`}
                >
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[30px] overflow-hidden z-10">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${servicio.imagenTarjeta || 'https://placehold.co/400x500/1a1a1a/FFF?text=Flex+Studio'})` }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(215, 242, 80, 0.48) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.2) 100%)' }}
                    />

                    <div className="relative flex flex-col justify-between h-full p-[24px]">
                      <div className="flex justify-between items-center w-full">
                        <span className="bg-[#d7f250] text-[#0f172a] px-[12px] py-[5px] rounded-[20px] text-[0.75rem] font-extrabold tracking-[1.5px] uppercase shadow-sm">
                          Plan Mensual
                        </span>
                        <span className="flex items-center text-white text-[0.76rem] font-bold drop-shadow-md">
                          <Clock className="w-[14px] h-[14px] mr-[6px] text-white" /> 1h 15min
                        </span>
                      </div>
                      <h3 className="mt-auto text-white text-4xl md:text-5xl font-bold mb-[12px] leading-[1.1] drop-shadow-lg">
                        {servicio.titulo}
                      </h3>
                    </div>
                  </div>

                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)] z-20 rounded-[30px] overflow-hidden bg-[#161616] p-[32px] flex flex-col justify-center items-center text-center">

                    <h4 className="text-[#d7f250] text-3xl font-bold mb-6">
                      {servicio.titulo}
                    </h4>

                    <p className="text-white/80 text-base mb-10">
                      {servicio.descripcionCard || 'Descripción no disponible.'}
                    </p>

                    <Link
                      to={`/categorias/${servicio.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="group/btn relative z-30 flex items-center justify-center w-max bg-[#d7f250] text-[#161616] font-bold rounded-[50px] px-6 py-3 transition-all duration-300 hover:bg-white hover:scale-105"
                    >
                      <span className="mr-2">Ver Más</span>
                      <ArrowRight className="w-[18px] h-[18px]" />
                    </Link>

                  </div>
                </div>
              </div>

            ))
          )}
        </article>

        <article className="mt-24 max-w-[500px] mx-auto bg-[#dee2e6] p-8 md:p-10 rounded-[16px] shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-black text-[#161616] tracking-tight mb-2">¿Tenés una consulta?</h3>
            <p className="text-gray-500 text-sm">Completa con tus datos y te respondo lo antes posible.</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#161616] mb-1">Nombre</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adb5bd] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full bg-white border border-[#dee2e6] focus:border-[#0d6efd] focus:ring-[3px] focus:ring-[#0d6efd]/15 rounded-lg pl-10 pr-3 py-2.5 text-[#161616] placeholder-[#adb5bd] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#161616] mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adb5bd] w-4 h-4" />
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full bg-white border border-[#dee2e6] focus:border-[#0d6efd] focus:ring-[3px] focus:ring-[#0d6efd]/15 rounded-lg pl-10 pr-3 py-2.5 text-[#161616] placeholder-[#adb5bd] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#161616] mb-1">Consulta</label>
              <textarea
                rows={3}
                placeholder="Mensaje"
                className="w-full bg-white border border-[#dee2e6] focus:border-[#0d6efd] focus:ring-[3px] focus:ring-[#0d6efd]/15 rounded-lg p-3 text-[#161616] placeholder-[#adb5bd] outline-none transition-all resize-none"
              />
            </div>
          
          <Link to={`*`} className="w-full bg-[#161616] hover:bg-[#d7f250] hover:text-[#161616] hover:-translate-y-[1px] text-white font-bold py-3 px-4 rounded-lg transition-all mt-2">
              <span>Enviar</span>
          </Link>
            
          </form>
        </article>

        <div className="mt-20 text-center">
          <h2 className="text-xl md:text-2xl p-[40px] font-bold uppercase bg-gradient-to-b from-transparent via-transparent to-black/5 rounded-2xl">
            Seguime en Instagram:{' '}
            <a
              href="https://www.instagram.com/flex_studioc/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#161616] hover:text-[#d7f250] hover:scale-110 font-black transition-all duration-300"
            >
              @FLEX_STUDIOC
            </a>
          </h2>
        </div>

      </section>
    </main>
  );
};

export default HomePage;