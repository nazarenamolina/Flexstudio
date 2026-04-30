import { useState, useEffect } from 'react';
import { User, Mail, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { obtenerCategoriasRequest, type Categoria } from '../api/categoria';
import { enviarConsultaRequest } from '../api/contacto';
import { TarjetaClase } from '../components/TarjetaClase';
import { CarruselDestacadas } from '../components/CarruselDestacadas';

const contactoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  correo: z.string().email('Ingresa un correo electrónico válido'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000, 'El mensaje es muy largo'),
});

type ContactoFormValues = z.infer<typeof contactoSchema>;

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

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactoFormValues>({
    resolver: zodResolver(contactoSchema),
  });

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches.length > 0) setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches.length > 0) setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
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

  const onSubmitContacto = async (data: ContactoFormValues) => {
    if (!executeRecaptcha) return toast.error('Verificando seguridad...');
    try {
      const captchaToken = await executeRecaptcha('contacto_home');
      const respuesta = await enviarConsultaRequest({ ...data, captchaToken });
      toast.success(respuesta.mensaje || '¡Consulta enviada con éxito!');
      reset();
    } catch (error) {
      toast.error('Hubo un error al enviar tu consulta. Intenta nuevamente.');
    }
  };

  const destacadas = categorias.filter(c => c.destacada);
  const regulares = categorias.filter(c => !c.destacada);

  return (
    <main className="min-h-screen font-sans text-[#161616] pt-[52px]">

      {/* --- SECCIÓN SLIDER --- */}
      <section
        className=" bg-white relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[100vh] overflow-hidden group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full shrink-0 relative ">
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-[#d7f250] w-8" : "bg-white/50 hover:bg-white"}`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </section>
 {/* --- SECCIÓN BIOGRAFÍA --- */}
      <section className="container mx-auto px-6 pt-16 pb-4">
        <article className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 p-6 md:p-10 lg:p-12 rounded-[30px]">
          <div className="w-full lg:w-1/2 ">
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] overflow-hidden rounded-[24px] border border-gray-800 shadow-inner group">
              <img
                src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1777342798/flex-studio/videos/dsgzc42aoeigsmxpvb3f.png"
                alt="Cande Imbaud"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/60 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-[#d7f250] text-xs md:text-sm font-black tracking-[0.2em] uppercase mb-3 block">
                Sobre la instructora
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] uppercase italic tracking-tight">
                Conocé a <span className="text-[#d7f250]">Cande</span>
              </h2>
            </div>
            <div className="space-y-4 text-[#131313] text-base md:text-lg leading-relaxed font-medium">
              <p>Hola, soy Cande, tengo 27 años y soy profesora de educación física, acróbata y entrenadora especializada en flexibilidad para deportistas de todas las disciplinas.</p>
              <p>Con más de 8 años de experiencia en clases de fitness grupal, flexibilidad y acrobacias, he acompañado a patinadoras, bailarinas, gimnastas y deportistas a mejorar su rendimiento y prevenir lesiones a través de la flexibilidad. Además, me encanta compartir el movimiento con los más pequeños, dando clases para niños desde hace más de 3 años, siempre con creatividad y respeto por cada proceso.</p>
              <p>Mi misión es que descubras que trabajar tu flexibilidad no es solo estirar, sino entrenar tu cuerpo con inteligencia para que se mueva con libertad, fuerza y control.</p>
            </div>
          </div>
        </article>


 {/* --- TÍTULO EXPLORAR CLASES --- */}
        <div className="flex justify-center mt-0 mb-16">
          <img
            src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312501/titulo_rue8kw.png"
            alt="Explorar Clases"
            className="w-full md:h-60"
          />
        </div>
     <CarruselDestacadas
        categorias={categorias}
        flippedCard={flippedCard}
        setFlippedCard={setFlippedCard}
      />
        {/* --- GRILLA TODAS LAS CATEGORÍAS --- */}
        <article className="flex flex-wrap justify-center gap-[25px]">
          {cargando ? (
            <div className="w-full text-center py-10">
              <h4 className="text-xl text-gray-400 font-bold animate-pulse">Cargando clases disponibles...</h4>
            </div>
          ) : regulares.length === 0 && destacadas.length === 0 ? (
            <div className="w-full text-center py-10">
              <p className="text-gray-400">Aún no hay categorías disponibles.</p>
            </div>
          ) : (
            regulares.map((servicio) => (
              <TarjetaClase
                key={servicio.id}
                servicio={servicio}
                flippedCard={flippedCard}
                setFlippedCard={setFlippedCard}
              />
            ))
          )}
        </article>

        {/* --- SECCIÓN CONTACTO --- */}
        <article className="mt-24 w-[100%] sm:w-[50%] mx-auto bg-white bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312699/fondo_hwrosv.png')] bg-cover bg-center border-2 border-[#161616]/60 rounded-2xl p-10">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-black text-[#161616] tracking-tight mb-2">¿Tenés una consulta?</h3>
            <p className="text-gray-500 text-sm">Completa con tus datos y te respondo lo antes posible.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmitContacto)} className="space-y-4">
            <div>
              <label className="block text-sm font-principal font-semibold text-[#161616] mb-1">Nombre</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adb5bd] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className={`w-full bg-white border ${errors.nombre ? 'border-red-500 focus:ring-red-500/15' : 'border-[#dee2e6] focus:border-[#d7f250] focus:ring-[#d7f250]/15'} focus:ring-[3px] rounded-lg pl-10 pr-3 py-2.5 text-[#161616] placeholder-[#adb5bd] outline-none transition-all`}
                  {...register('nombre')}
                />
              </div>
              {errors.nombre && <p className="mt-1 text-xs text-red-500 font-medium">{errors.nombre.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-principal font-semibold text-[#161616] mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adb5bd] w-4 h-4" />
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className={`w-full bg-white border ${errors.correo ? 'border-red-500 focus:ring-red-500/15' : 'border-[#dee2e6] focus:border-[#d7f250] focus:ring-[#d7f250]/15'} focus:ring-[3px] rounded-lg pl-10 pr-3 py-2.5 text-[#161616] placeholder-[#adb5bd] outline-none transition-all`}
                  {...register('correo')}
                />
              </div>
              {errors.correo && <p className="mt-1 text-xs text-red-500 font-medium">{errors.correo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-principal font-semibold text-[#161616] mb-1">Consulta</label>
              <textarea
                rows={3}
                placeholder="Mensaje"
                className={`w-full bg-white border ${errors.mensaje ? 'border-red-500 focus:ring-red-500/15' : 'border-[#dee2e6] focus:border-[#d7f250] focus:ring-[#d7f250]/15'} focus:ring-[3px] rounded-lg p-3 text-[#161616] placeholder-[#adb5bd] outline-none transition-all resize-none`}
                {...register('mensaje')}
              />
              {errors.mensaje && <p className="mt-1 text-xs text-red-500 font-medium">{errors.mensaje.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 rounded-full bg-[#d7f250] px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313] shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-[#d7f250] hover:shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin w-5 h-5" /> Enviando...</>
              ) : (
                'Enviar'
              )}
            </button>

            <p className="text-[10px] text-gray-500 text-center leading-tight mt-2">
              Protegido por reCAPTCHA - <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#161616]">Privacidad</a> y <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#161616]">Términos</a>.
            </p>
          </form>
        </article>

        {/* --- FOOTER DE INSTAGRAM --- */}
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