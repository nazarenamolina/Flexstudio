import { useState } from 'react';
import { User, Mail, Loader2, Clock, GraduationCap, BicepsFlexed, RotateCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { enviarConsultaRequest } from '../api/contacto';
import { mensajeDeError } from '../api/errores';
import { useCategoriasPublicas } from '../hooks/useCategoriasPublicas';
import { CarruselDestacadas } from '../components/CarruselDestacadas';
import { Tiktok, Instagram } from 'react-bootstrap-icons';
import { ScrollReveal } from '../components/ScrollReveal';
import { HeroCarrusel } from '../components/HeroCarrusel';

const contactoSchema = z.object({
  // Mismos límites que el DTO del back (contacto.dto.ts).
  nombre: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es muy largo (máximo 100 caracteres)'),
  correo: z.string().trim().email('Ingresá un correo electrónico válido').max(255, 'El correo es muy largo'),
  mensaje: z.string().trim().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000, 'El mensaje es muy largo (máximo 1000 caracteres)'),
});

type ContactoFormValues = z.infer<typeof contactoSchema>;

const HomePage = () => {
  const { data: categorias = [], isPending: cargando, isLoadingError: isError, refetch, isFetching } = useCategoriasPublicas();
  const [flippedCard, setFlippedCard] = useState<string | number | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactoFormValues>({
    resolver: zodResolver(contactoSchema),
  });

  const onSubmitContacto = async (data: ContactoFormValues) => {
    // Sin reCAPTCHA (script bloqueado por un bloqueador de anuncios o sin conexión) el back rechaza el envío.
    if (!executeRecaptcha) {
      toast.error('No pudimos cargar la verificación de seguridad. Recargá la página o escribime por Instagram.', { id: 'contacto' });
      return;
    }
    let captchaToken: string;
    try {
      captchaToken = await executeRecaptcha('contacto_home');
    } catch {
      toast.error('Falló la verificación de seguridad. Recargá la página y volvé a intentar.', { id: 'contacto' });
      return;
    }
    try {
      const respuesta = await enviarConsultaRequest({ ...data, captchaToken });
      toast.success(respuesta.mensaje || '¡Consulta enviada! Te respondo lo antes posible.', { id: 'contacto' });
      reset();
    } catch (error) {
      toast.error(mensajeDeError(error, 'No pudimos enviar tu consulta. Revisá tu conexión y volvé a intentar.'), { id: 'contacto' });
    }
  };

  return (
    <main className="min-h-screen font-sans text-[#161616] pt-[67px] lg:pt-[78px]">
      <HeroCarrusel />
      <section id="biografia" className="w-full flex flex-col lg:flex-row bg-[#FDFDF8] overflow-hidden">
        <ScrollReveal direction="right" className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-full">
          <img
            src="https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto,c_limit,w_1200/v1779666110/flex-studio/categorias/zf6in7hepy8t9iookjei.jpg"
            alt="Cande Imbaud - Profesora de Flexibilidad"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </ScrollReveal>

        {/* Texto de Cande - Entra desde la derecha */}
        <ScrollReveal direction="left" className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 py-10 md:px-16 lg:px-24 text-center font-principal text-[#131313]">
          <h2 className="text-7xl md:text-9xl tracking-tight uppercase leading-none mb-10 lg:mb-16 text-[#d7f250] opacity-90">
            Cande Imbaud
          </h2>

          <div className="text-sm md:text-base font-normal leading-loose space-y-6 max-w-md mb-10 opacity-90">
            <p>
              Hola, soy Cande, tengo 27 años y soy profesora de educación física, acróbata y entrenadora especializada en flexibilidad para deportistas de todas las disciplinas.
            </p>
            <p>
              Con más de 8 años de experiencia, he acompañado a patinadoras, bailarinas, gimnastas y deportistas a mejorar su rendimiento y prevenir lesiones a través de la flexibilidad, compartiendo también el movimiento con los más pequeños.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 w-full max-w-3xl">
            <div className="flex items-center gap-2.5">
              <Clock className="w-6 h-6 text-[#d7f250] shrink-0" strokeWidth={2} />
              <span className="text-[12px] sm:text-[13px] md:text-sm font-bold tracking-wide text-[#131313] uppercase text-left">
                8+ Años de Experiencia
              </span>
            </div>
            <div className="hidden sm:block w-[1px] h-6 bg-[#302B1B]/10"></div>
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-[#d7f250] shrink-0" strokeWidth={2} />
              <span className="text-[12px] sm:text-[13px] md:text-sm font-bold tracking-wide text-[#131313] uppercase text-left">
                Profesora de Ed. Física
              </span>
            </div>
            <div className="hidden sm:block w-[1px] h-6 bg-[#302B1B]/10"></div>
            <div className="flex items-center gap-2.5">
              <BicepsFlexed className="w-6 h-6 text-[#d7f250] shrink-0 -mr-0.5" strokeWidth={2} />
              <span className="text-[12px] sm:text-[13px] md:text-sm font-bold tracking-wide text-[#131313] uppercase text-left">
                Especialista en Flexibilidad
              </span>
            </div>
          </div>
        </ScrollReveal>

      </section>

      <section id="clases" className="container mx-auto px-6 py-6 overflow-hidden scroll-mt-24">
        <ScrollReveal direction="down">
          <div className="flex justify-center mt-0 -mx-6 md:mx-0">
            <img
              src="https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto,c_limit,w_1600/v1774312501/titulo_rue8kw.png"
              alt="Explorar Clases"
              className="w-full h-auto object-cover"
            />
          </div>
        </ScrollReveal>
        {/* El carrusel muestra todas las clases (primero las destacadas). */}
        {cargando ? (
          <div className="w-full text-center py-16">
            <p className="text-xl text-gray-400 font-bold animate-pulse">Cargando clases disponibles...</p>
          </div>
        ) : isError ? (
          <div className="w-full flex flex-col items-center text-center gap-4 py-16">
            <p className="text-gray-500">No pudimos cargar las clases.</p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl bg-[#131313] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#d7f250] hover:text-[#131313] disabled:opacity-60"
            >
              <RotateCw size={16} className={isFetching ? 'animate-spin' : ''} /> Reintentar
            </button>
          </div>
        ) : categorias.length === 0 ? (
          <div className="w-full text-center py-16">
            <p className="text-gray-400">Pronto vas a encontrar acá las clases disponibles.</p>
          </div>
        ) : (
          <ScrollReveal direction="up" delay={0.2}>
            <CarruselDestacadas
              categorias={categorias}
              flippedCard={flippedCard}
              setFlippedCard={setFlippedCard}
            />
          </ScrollReveal>
        )}
        <ScrollReveal direction="up" delay={0.3}>
          <article className="w-[100%] sm:w-[80%] lg:w-[60%] xl:w-[50%] mx-auto border border-gray-300 bg-white/80 bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto/v1774312699/fondo_hwrosv.png')] bg-cover rounded-2xl p-6 md:p-10 shadow-inner">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold uppercase text-[#161616] tracking-tight mb-2 font-principal">¿Tenés una consulta?</h3>
              <p className="text-gray-500 text-sm">Completa con tus datos y te respondo lo antes posible.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmitContacto)} noValidate className="space-y-6">
              <div>
                <label htmlFor="contacto-nombre" className="block text-sm font-principal font-semibold text-[#161616] mb-1">Nombre</label>
                <div className="relative">
                  <User aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adb5bd] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className={`w-full bg-white/50 border border-[#dee2e6]/50 ${errors.nombre ? 'border-red-500/70 focus:ring-red-500/20' : 'border-[#d7f250]/30 focus:border-[#d7f250]/50 focus:ring-[#d7f250]/20'} focus:ring-[3px] rounded-xl pl-10 pr-3 py-3 text-[#161616] placeholder-[#adb5bd]/80 outline-none transition-all duration-200`}
                    id="contacto-nombre" autoComplete="name" aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? 'contacto-nombre-error' : undefined}
                    {...register('nombre')}
                  />
                </div>
                {errors.nombre && <p id="contacto-nombre-error" role="alert" className="mt-1.5 ml-1 text-xs text-red-600 font-semibold">{errors.nombre.message}</p>}
              </div>

              <div>
                <label htmlFor="contacto-correo" className="block text-sm font-principal font-semibold text-[#161616] mb-1">E-mail</label>
                <div className="relative">
                  <Mail aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adb5bd] w-4 h-4" />
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className={`w-full bg-white/50  border border-[#dee2e6]/50 ${errors.correo ? 'border-red-500/70 focus:ring-red-500/20' : 'border-[#d7f250]/30 focus:border-[#d7f250]/50 focus:ring-[#d7f250]/20'} focus:ring-[3px] rounded-xl pl-10 pr-3 py-3 text-[#161616] placeholder-[#adb5bd]/80 outline-none transition-all duration-200`}
                    id="contacto-correo" autoComplete="email" aria-invalid={!!errors.correo} aria-describedby={errors.correo ? 'contacto-correo-error' : undefined}
                    {...register('correo')}
                  />
                </div>
                {errors.correo && <p id="contacto-correo-error" role="alert" className="mt-1.5 ml-1 text-xs text-red-600 font-semibold">{errors.correo.message}</p>}
              </div>

              <div>
                <label htmlFor="contacto-mensaje" className="block text-sm font-principal font-semibold text-[#161616] mb-1">Consulta</label>
                <textarea
                  rows={4}
                  placeholder="Mensaje"
                  className={`w-full bg-white/50 border border-[#dee2e6]/50 ${errors.mensaje ? 'border-red-500/70 focus:ring-red-500/20' : 'border-[#d7f250]/30 focus:border-[#d7f250]/50 focus:ring-[#d7f250]/20'} focus:ring-[3px] rounded-xl p-4 text-[#161616] placeholder-[#adb5bd]/80 outline-none transition-all duration-200 resize-none`}
                  id="contacto-mensaje" aria-invalid={!!errors.mensaje} aria-describedby={errors.mensaje ? 'contacto-mensaje-error' : undefined}
                    {...register('mensaje')}
                />
                {errors.mensaje && <p id="contacto-mensaje-error" role="alert" className="mt-1.5 ml-1 text-xs text-red-600 font-semibold">{errors.mensaje.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#d7f250] px-6 py-3.5 text-lg font-principal font-bold text-[#131313] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#131313] hover:text-[#d7f250] hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin w-5 h-5" /> Enviando...</>
                ) : (
                  'Enviar'
                )}
              </button>
              <p className="text-[10px] text-gray-500 text-center leading-tight mt-4">
                Protegido por reCAPTCHA - <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#161616]">Privacidad</a> y <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#161616]">Términos</a>.
              </p>

              <div className="mt-10 pt-6 border-t border-gray-200/50 flex flex-col items-center">
                <h4 className="text-[20px] font-semibold text-black uppercase font-principal tracking-wider mb-4">
                  O escribime <span className='text-[#d7f250]'>a mis redes</span>
                </h4>

                <div className="flex flex-wrap justify-center items-center gap-5">
                  <a
                    href="https://www.instagram.com/flex_studioc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-[#161616] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-50/50 group-hover:bg-[#161616] group-hover:text-[#d7f250] transition-all duration-300">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm tracking-wide uppercase">@flex_studioc</span>
                  </a>

                  <a
                    href="https://www.tiktok.com/@flexstudioc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-[#161616] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 group-hover:bg-[#161616] group-hover:text-[#d7f250] transition-colors duration-300">
                      <Tiktok className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm tracking-wide uppercase">@flexstudioc</span>
                  </a>
                </div>
              </div>
            </form>
          </article>
        </ScrollReveal>

      </section>
    </main>
  );
};

export default HomePage;
