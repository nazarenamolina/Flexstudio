import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

export type TonoResultado = 'cargando' | 'exito' | 'espera' | 'error';

interface Props {
  tono: TonoResultado;
  titulo: React.ReactNode;
  texto: React.ReactNode;
  accion?: { to: string; label: string };
  accionSecundaria?: { to: string; label: string };
  extra?: React.ReactNode;
}

/** Resalta una palabra del título: verde de la marca como fondo (sobre blanco no se lee como texto). */
export const Resaltado = ({ children, tono = 'marca' }: { children: React.ReactNode; tono?: 'marca' | 'error' }) => (
  <span className={tono === 'error' ? 'text-red-600' : 'bg-[#d7f250] px-2 box-decoration-clone'}>{children}</span>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ICONOS = {
  cargando: <Loader2 className="w-12 h-12 text-[#131313] animate-spin" />,
  exito: <CheckCircle2 className="w-12 h-12 text-[#131313]" />,
  espera: <Clock className="w-12 h-12 text-[#131313]" />,
  error: <XCircle className="w-12 h-12 text-red-600" />,
};

/** Pantalla de resultado de un pago, con el mismo estilo claro que el resto del checkout. */
export const ResultadoPago = ({ tono, titulo, texto, accion, accionSecundaria, extra }: Props) => (
  <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 md:px-6 font-sans text-[#131313]">
    <motion.div
      key={tono}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg bg-white bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto/v1774312699/fondo_hwrosv.png')] border border-neutral-100 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 text-center"
    >
      <motion.div
        variants={itemVariants}
        className={`mx-auto mb-6 w-24 h-24 rounded-full flex items-center justify-center ${tono === 'error' ? 'bg-red-50 border border-red-200' : 'bg-[#d7f250]'}`}
      >
        {ICONOS[tono]}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h1 className="font-principal text-4xl sm:text-5xl uppercase leading-tight break-words">{titulo}</h1>
        <p className="text-neutral-700 text-base sm:text-lg max-w-sm mx-auto leading-relaxed">{texto}</p>
      </motion.div>

      {extra && <motion.div variants={itemVariants} className="mt-6">{extra}</motion.div>}

      {accion && (
        <motion.div variants={itemVariants} className="pt-8 flex flex-col items-center gap-4">
          <Link
            to={accion.to}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-neon-pink px-8 py-4 font-principal text-lg sm:text-xl font-bold text-[#131313]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md"
          >
            {accion.label}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          {accionSecundaria && (
            <Link to={accionSecundaria.to} className="font-principal text-sm uppercase tracking-widest text-neutral-600 underline underline-offset-4 hover:text-[#131313] transition-colors">
              {accionSecundaria.label}
            </Link>
          )}
        </motion.div>
      )}
    </motion.div>
  </section>
);
