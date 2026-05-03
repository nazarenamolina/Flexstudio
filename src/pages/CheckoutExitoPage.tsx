import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Trophy } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

export const CheckoutExitoPage = () => {
  const clearCart = useCartStore((state) => state.clearCart);
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    clearCart();
    window.scrollTo(0, 0);
  }, [clearCart]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313] px-6 overflow-hidden relative">
      {/* Energy Pulse Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d7f250]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(215,242,80,0.05)_0%,transparent_70%)]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-lg w-full text-center"
      >
        {/* Hero Icon Section */}
        <motion.div
          variants={itemVariants}
          className="relative mx-auto mb-8 w-32 h-32"
        >
          <div className="absolute inset-0 bg-[#d7f250]/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-full h-full bg-[#1a1a1a] border-2 border-[#d7f250]/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(215,242,80,0.1)]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
            >
              <CheckCircle2 className="w-16 h-16 text-[#d7f250]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
              ¡Pago <span className="text-[#d7f250]">Exitoso!</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-sm mx-auto leading-relaxed">
              Tu pago se ha procesado. Ya tienes acceso a las clases de <span className="text-white font-semibold">Flex Studio</span>.
            </p>
          </div>

          {paymentId && (
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-800 text-gray-400"
            >
              <Trophy size={16} className="text-[#d7f250]" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Comprobante: <span className="text-[#d7f250] font-mono ml-1">{paymentId}</span>
              </span>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="pt-8">
            <Link
              to="/mi-perfil"
              className="group relative w-full inline-flex items-center justify-center gap-3 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] font-black py-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-tighter text-lg shadow-[0_10px_20px_rgba(215,242,80,0.2)]"
            >
              Empezar Entrenamiento <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};