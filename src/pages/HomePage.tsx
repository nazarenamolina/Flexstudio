import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { obtenerCategoriasRequest, type Categoria } from '../api/categoria';

const HomePage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // --- LÓGICA DEL CARRUSEL ---
  const slides = [
    'https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312494/QuienSoy_ssu4xv.png',
    'https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312483/Banner_jntyks.png'
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // --- FETCH DE DATOS ---
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
    // FONDO BLANCO CON TEXTURA Y TEXTO OSCURO POR DEFECTO
    <main 
      className="min-h-screen font-sans text-[#161616] pb-20 bg-cover bg-center bg-no-repeat bg-fixed"
    >
      
      {/* --- SECCIÓN: CARRUSEL --- */}
      <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden group">
        <div 
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full shrink-0 relative">
              <img src={slide} alt={`Slide ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        
        {/* Controles del Carrusel */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d7f250] hover:text-black text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d7f250] hover:text-black text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10">
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      <section className="container mx-auto px-6 py-16">
        
        {/* --- TÍTULO EXPLORAR CLASES --- */}
        <div className="flex justify-center mb-16">
          <img 
            src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312501/titulo_rue8kw.png" 
            alt="Explorar Clases" 
            className="h-16 md:h-24 object-contain" 
          />
        </div>

        {/* --- SECCIÓN: GRID DE CATEGORÍAS (ESTILO IDENTICO AL CSS ORIGINAL) --- */}
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
              
              /* CONTENEDOR DE LA TARJETA (.course-card) */
              <div 
                key={servicio.id} 
                className="relative w-full max-w-[416px] h-[512px] rounded-[30px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.2)] transition-transform duration-400 hover:-translate-y-[5px] group"
              >
                {/* FONDO DE LA IMAGEN (.card-background) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url(${servicio.imagenTarjeta || 'https://placehold.co/400x500/1a1a1a/FFF?text=Flex+Studio'})` }}
                />

                {/* DEGRADADO OSCURO A VERDE LIMA (.card-overlay) */}
                <div 
                  className="absolute inset-0 z-10"
                  style={{ background: 'linear-gradient(to top, rgba(215, 242, 80, 0.48) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.2) 100%)' }}
                />

                {/* CONTENIDO DE LA TARJETA (.card-body) */}
                <div className="relative z-20 flex flex-col justify-between h-full p-[24px]">
                  
                  {/* BADGES SUPERIORES (.badge-container) */}
                  <div className="flex justify-between items-center w-full">
                    <span className="bg-[#d7f250] text-[#0f172a] px-[12px] py-[5px] rounded-[20px] text-[0.75rem] font-extrabold tracking-[1.5px] uppercase shadow-sm">
                      Plan Mensual
                    </span>
                    <span className="flex items-center text-white text-[0.76rem] font-bold drop-shadow-md">
                      <Clock className="w-[14px] h-[14px] mr-[6px] text-white" /> 1h 15min
                    </span>
                  </div>
                  
                  {/* TEXTOS INFERIORES Y BOTÓN */}
                  <div className="mt-auto pb-4 relative">
                    
                    {/* Popover/Tooltip (Aparece en hover replicando el OverlayTrigger) */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[110%] bg-[#d7f250] text-[#161616] text-[0.9rem] font-medium text-center px-4 py-3 rounded-xl shadow-[0_5px_15px_rgba(215,242,80,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                      ¡Diseñado para ayudarte a alcanzar tus metas! Descubre más sobre esta disciplina.
                      {/* Triangulito del popover */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#d7f250]"></div>
                    </div>

                    {/* Título */}
                    <h3 className="text-white text-4xl md:text-5xl font-bold mb-[12px] leading-[1.1] drop-shadow-lg">
                      {servicio.titulo}
                    </h3>

                    {/* Descripción con borde lima (.description-box) */}
                    <div className="border-l-[3px] border-[#d7f250] pl-[20px] mb-[24px]">
                      <p className="text-white/80 text-sm m-0 line-clamp-3">
                        {servicio.descripcionCard || 'Descripción no disponible.'}
                      </p>
                    </div>

                    {/* BOTÓN ANIMADO (.btn-card y .texto-oculto) */}
                    <Link
                      to={`/categorias/${servicio.id}`}
                      className="group/btn flex items-center justify-center w-max mx-auto bg-[#161616]/60 border border-white/20 rounded-[50px] px-4 py-2 transition-all duration-300 hover:bg-[#d7f250] hover:border-[#d7f250] hover:text-[#161616] text-white backdrop-blur-sm"
                    >
                      <span className="font-bold text-sm whitespace-nowrap max-w-0 overflow-hidden opacity-0 group-hover/btn:max-w-[100px] group-hover/btn:opacity-100 transition-all duration-500 ease-in-out mr-0 group-hover/btn:mr-2">
                        Ver Más
                      </span>
                      <ArrowRight className="w-[18px] h-[18px] shrink-0" />
                    </Link>

                  </div>
                </div>
              </div>

            ))
          )}
        </article>

        {/* --- SECCIÓN: CONTACTO --- */}
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
            
            <button 
              type="submit" 
              className="w-full bg-[#161616] hover:bg-[#d7f250] hover:text-[#161616] hover:-translate-y-[1px] text-white font-bold py-3 px-4 rounded-lg transition-all mt-2"
            >
              Enviar
            </button>
          </form>
        </article>

        {/* --- FOOTER / INSTAGRAM --- */}
        <div className="mt-20 text-center">
          <h2 className="text-xl md:text-2xl font-bold uppercase p-[40px] bg-gradient-to-b from-transparent via-transparent to-black/5 rounded-2xl">
            Seguime en Instagram:{' '}
            <a 
              href="https://www.instagram.com/flex_studioc/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block text-[#161616] hover:text-white hover:scale-110 font-black transition-all duration-300"
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