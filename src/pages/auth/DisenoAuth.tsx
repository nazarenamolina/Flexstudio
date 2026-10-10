import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { claseTarjeta } from './estilos';
import { optimizarCloudinary } from '../../imagenes';

// Una foto por formato: horizontal de fondo en escritorio y vertical arriba del formulario en celular.
// Cada una está en un elemento oculto en el otro tamaño, así que el navegador descarga solo la que muestra.
const IMAGEN_ESCRITORIO = optimizarCloudinary(
  'https://res.cloudinary.com/dmp7mcwie/image/upload/v1791650150/Gimnasta_en_equilibrio_sobre_la_viga_z3ckde.png',
  1920,
);
const IMAGEN_CELULAR = optimizarCloudinary(
  'https://res.cloudinary.com/dmp7mcwie/image/upload/v1774998043/fondologin_iltsgx.jpg',
  1000,
);
const DEGRADADO = 'bg-gradient-to-t from-[#131313]/80 via-[#131313]/30 to-[#131313]/10';

/** Login y registro: en escritorio, foto de fondo y formulario a la derecha; en celular, foto arriba y formulario abajo. */
export const PantallaDividida = ({ frase, children }: { frase?: string; children: React.ReactNode }) => (
  <div className="relative min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#131313] font-sans text-[#131313]">
    {/* La foto va con su proporción exacta (1671×941) para que nunca se recorte a la gimnasta, y los
        bordes se funden con el fondo oscuro. El ancho máximo (177vh) evita que sea más alta que la pantalla. */}
    <div
      className="hidden lg:block fixed left-[12vw] top-1/2 -translate-y-1/2 w-[min(72vw,177vh)] aspect-[1671/941] bg-cover grayscale [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_75%,transparent),linear-gradient(to_bottom,transparent,#000_12%,#000_90%,transparent)] [mask-composite:intersect]"
      style={{ backgroundImage: `url('${IMAGEN_ESCRITORIO}')` }}
    />
    <div className={`hidden lg:block fixed inset-0 ${DEGRADADO}`} />

    <div className="relative w-full lg:w-1/2 h-72 sm:h-80 lg:h-full shrink-0 overflow-hidden">
      <div className="lg:hidden absolute inset-0 bg-cover bg-[center_55%] grayscale" style={{ backgroundImage: `url('${IMAGEN_CELULAR}')` }} />
      <div className={`lg:hidden absolute inset-0 ${DEGRADADO}`} />
      <div className="relative z-10 w-full h-full p-6 lg:p-10 flex flex-col justify-between">
        <Link to="/" className="group inline-flex items-center self-start rounded-full bg-white/90 px-4 py-2 font-principal text-xs uppercase tracking-widest text-[#131313] hover:bg-[#d7f250] transition-colors">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>
        {frase && (
          <div className="hidden lg:block">
            <p className="font-cursiva text-7xl font-semibold leading-none text-white mb-3">
              Flex <span className="text-[#d7f250]">Studio</span>
            </p>
            <p className="font-principal text-lg uppercase tracking-wide text-white/80">{frase}</p>
          </div>
        )}
      </div>
    </div>

    <div className="relative z-10 w-full lg:w-1/2 lg:h-full overflow-y-auto flex flex-col items-center p-6 sm:p-10 lg:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`${claseTarjeta} w-full max-w-xl my-auto p-6 sm:p-10`}
      >
        {children}
      </motion.div>
    </div>
  </div>
);

/** Verificación de correo y nueva contraseña: tarjeta centrada con un ícono arriba. */
export const PantallaTarjeta = ({ icono, children }: { icono: React.ReactNode; children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFDF8] font-sans text-[#131313] p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${claseTarjeta} max-w-md w-full p-8 sm:p-10 flex flex-col items-center`}
    >
      <div className="w-20 h-20 bg-[#d7f250] rounded-full flex items-center justify-center mb-6">{icono}</div>
      {children}
    </motion.div>
  </div>
);

export const AvisoRecaptcha = () => (
  <p className="mt-8 text-center text-[11px] text-neutral-500 leading-relaxed">
    Este sitio está protegido por reCAPTCHA y se aplican la{' '}
    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#131313]">Política de privacidad</a> y los{' '}
    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#131313]">Términos de servicio</a> de Google.
  </p>
);
