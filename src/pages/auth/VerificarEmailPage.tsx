import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, MailCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { verificarEmailRequest } from '../../api/auth';

export const VerificarEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const correo = location.state?.correo;
  const [cargando, setCargando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<{ codigo: string }>();

  if (!correo) {
    return <Navigate to="/registro" replace />;
  }

  const onSubmit = async (data: { codigo: string }) => {
    setCargando(true);
    setErrorGlobal(null);
    try {
      await verificarEmailRequest({ correo, codigo: data.codigo });
      navigate('/login', { state: { mensaje: '¡Cuenta verificada! Ya puedes iniciar sesión.' } });
    } catch (error: any) {
      setErrorGlobal(error.response?.data?.message || 'Código incorrecto o expirado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313] font-sans p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ opacity: [0.15, 0.3, 0.15] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(215,242,80,0.1)_0%,transparent_60%)] rounded-full" 
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(215,242,80,0.08)_0%,transparent_60%)] rounded-full" 
        />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full bg-[#111111]/90 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center"
      >
        
        {/* Ícono animado */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(215,242,80,0)", "0px 0px 20px rgba(215,242,80,0.2)", "0px 0px 0px rgba(215,242,80,0)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-[#d7f250]/10 rounded-full flex items-center justify-center mb-6 border border-[#d7f250]/20"
        >
          <MailCheck className="text-[#d7f250] w-10 h-10" />
        </motion.div>
        
        <h1 className="text-3xl font-black text-white tracking-tight mb-3">Revisa tu correo</h1>
        <p className="text-gray-400 text-[15px] text-center mb-8 leading-relaxed">
          Enviamos un código de seguridad de 6 dígitos a <br/>
          <strong className="text-white font-bold tracking-wide">{correo}</strong>
        </p>

        {errorGlobal && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="w-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl mb-6 flex items-center gap-3 font-medium"
          >
            <AlertCircle size={18} className="flex-shrink-0" /> {errorGlobal}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div>
            <div className="relative">
              <input 
                type="text" 
                maxLength={6}
                placeholder="000000" 
                autoComplete="off"
                className={`w-full bg-[#0a0a0a] border ${errors.codigo ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-800 focus:border-[#d7f250] focus:ring-[#d7f250]/20'} focus:ring-4 rounded-2xl px-4 py-5 text-center text-4xl tracking-[0.5em] font-black focus:outline-none transition-all duration-300 text-white placeholder-gray-800 shadow-inner`}
                {...register('codigo', { 
                  required: 'Ingresa el código',
                  pattern: { value: /^[0-9]{6}$/, message: 'Debe contener exactamente 6 números' }
                })} 
              />
            </div>
            {errors.codigo && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs flex justify-center mt-3 font-bold">
                {errors.codigo.message}
              </motion.span>
            )}
          </div>

          <button 
            type="submit" 
            disabled={cargando} 
            className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] font-black text-[15px] py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-70 hover:shadow-[0_0_20px_rgba(215,242,80,0.2)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {cargando ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> VERIFICANDO...</> : 'CONFIRMAR CORREO'}
          </button>
        </form>

        <button 
          onClick={() => navigate('/registro')} 
          className="group text-gray-500 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors mt-8 uppercase tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" /> Corregir correo
        </button>
      </motion.div>
    </div>
  );
};