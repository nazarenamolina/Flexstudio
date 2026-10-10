import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { claseTarjeta } from './estilos';

const IMAGEN_LATERAL = 'https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto,c_limit,w_1200/v1774998043/fondologin_iltsgx.jpg';

/** Login y registro: foto a la izquierda (arriba en celular) y formulario claro a la derecha. */
export const PantallaDividida = ({ frase, children }: { frase?: string; children: React.ReactNode }) => (
  <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#FDFDF8] font-sans text-[#131313]">
    <div className="relative w-full lg:w-1/2 h-56 sm:h-72 lg:h-full shrink-0 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center grayscale" style={{ backgroundImage: `url('${IMAGEN_LATERAL}')` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/80 via-[#131313]/30 to-[#131313]/10" />
      <div className="relative z-10 w-full h-full p-6 lg:p-10 flex flex-col justify-between">
        <Link to="/" className="group inline-flex items-center self-start rounded-full bg-white/90 px-4 py-2 font-principal text-xs uppercase tracking-widest text-[#131313] hover:bg-[#d7f250] transition-colors">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>
        {frase && (
          <div className="hidden lg:block">
            <p className="font-principal text-5xl uppercase leading-none text-white mb-3">Flex <span className="text-[#d7f250]">Studio</span></p>
            <p className="text-white/80 text-lg">{frase}</p>
          </div>
        )}
      </div>
    </div>

    <div className="w-full lg:w-1/2 lg:h-full overflow-y-auto flex flex-col items-center p-6 sm:p-10 lg:p-12">
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
