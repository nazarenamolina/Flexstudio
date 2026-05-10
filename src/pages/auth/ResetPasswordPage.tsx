import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { cambiarContrasenaRequest } from '../../api/auth';

// 👇 Agregamos validaciones estrictas con mensajes detallados
const resetSchema = z.object({
  nuevaContrasena: z.string()
    .min(6, 'Debe tener al menos 6 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirmarContrasena: z.string()
}).refine((data) => data.nuevaContrasena === data.confirmarContrasena, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarContrasena"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [mostrarPass1, setMostrarPass1] = useState(false);
  const [mostrarPass2, setMostrarPass2] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    if (!token) {
      toast.error('Enlace inválido. Por favor, solicita uno nuevo.');
      return;
    }

    try {
      const respuesta = await cambiarContrasenaRequest({ 
        token, 
        nuevaContrasena: data.nuevaContrasena 
      });
      
      toast.success(respuesta.mensaje || 'Contraseña actualizada');
      navigate('/login', { state: { mensaje: 'Inicia sesión con tu nueva contraseña' } });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'El enlace caducó o es inválido');
    }
  };

  // PANTALLA DE ERROR SI NO HAY TOKEN (Mantiene la estética)
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131313] p-4 relative overflow-hidden">
        <div className="relative z-10 max-w-md w-full bg-[#111111]/90 backdrop-blur-xl border border-red-900/50 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2">ENLACE NO VÁLIDO</h1>
          <p className="text-gray-400 mb-8">El enlace de recuperación está incompleto o fue modificado.</p>
          <Link to="/login" className="bg-[#1a1a1a] hover:bg-[#222222] text-white border border-gray-800 font-bold py-3 px-6 rounded-xl transition-all">
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313] font-sans p-4 relative overflow-hidden">
      
      {/* =========================================
          LUCES DE FONDO (Igual que VerificarEmail)
      ========================================= */}
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

      {/* =========================================
          TARJETA PRINCIPAL (Glassmorphism)
      ========================================= */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full bg-[#111111]/90 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center"
      >
        
        {/* Ícono animado de Seguridad */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(215,242,80,0)", "0px 0px 20px rgba(215,242,80,0.2)", "0px 0px 0px rgba(215,242,80,0)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-[#d7f250]/10 rounded-full flex items-center justify-center mb-6 border border-[#d7f250]/20"
        >
          <ShieldCheck className="text-[#d7f250] w-10 h-10" />
        </motion.div>

        <div className="text-center mb-8 w-full">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            NUEVA CLAVE
          </h1>
          <p className="text-gray-400 text-[15px] leading-relaxed">
            Asegura tu cuenta para volver a <br/>
            <strong className="text-white font-bold tracking-wide">Flex Studio</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          
          {/* Input: Nueva Contraseña */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              NUEVA CONTRASEÑA
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-600" />
              </div>
              <input
                type={mostrarPass1 ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3.5 bg-[#0a0a0a] border ${errors.nuevaContrasena ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-800 focus:border-[#d7f250] focus:ring-[#d7f250]/20'} focus:ring-4 rounded-2xl text-white placeholder-gray-700 focus:outline-none transition-all duration-300 shadow-inner font-medium`}
                {...register('nuevaContrasena')}
              />
              <button
                type="button"
                onClick={() => setMostrarPass1(!mostrarPass1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d7f250] transition-colors"
              >
                {mostrarPass1 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.nuevaContrasena && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs flex mt-2 font-bold ml-1">
                {errors.nuevaContrasena.message}
              </motion.span>
            )}
          </div>

          {/* Input: Confirmar Contraseña */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1 mt-6">
              CONFIRMAR CONTRASEÑA
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-600" />
              </div>
              <input
                type={mostrarPass2 ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3.5 bg-[#0a0a0a] border ${errors.confirmarContrasena ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-800 focus:border-[#d7f250] focus:ring-[#d7f250]/20'} focus:ring-4 rounded-2xl text-white placeholder-gray-700 focus:outline-none transition-all duration-300 shadow-inner font-medium`}
                {...register('confirmarContrasena')}
              />
              <button
                type="button"
                onClick={() => setMostrarPass2(!mostrarPass2)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d7f250] transition-colors"
              >
                {mostrarPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmarContrasena && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs flex mt-2 font-bold ml-1">
                {errors.confirmarContrasena.message}
              </motion.span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] font-black text-[15px] py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-70 hover:shadow-[0_0_20px_rgba(215,242,80,0.2)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> GUARDANDO...</> : 'GUARDAR CONTRASEÑA'}
          </button>
        </form>

      </motion.div>
    </div>
  );
};