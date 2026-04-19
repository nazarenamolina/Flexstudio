import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { cambiarContrasenaRequest } from '../../api/auth';

const resetSchema = z.object({
  nuevaContrasena: z.string().min(6, 'Debe tener al menos 6 caracteres'),
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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-red-500 mb-4">ENLACE NO VÁLIDO</h1>
          <p className="text-neutral-400 mb-6">El enlace de recuperación está incompleto.</p>
          <Link to="/login" className="text-[#d7f250] hover:underline font-bold">Ir al Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      <div className="w-full max-w-md bg-[#111111] p-8 rounded-2xl border border-neutral-800 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#d7f250] tracking-tighter mb-2">
            NUEVA CLAVE
          </h1>
          <p className="text-neutral-400 text-sm">
            Ingresa tu nueva contraseña para volver al entrenamiento.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Input: Nueva Contraseña */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
              NUEVA CONTRASEÑA
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-500" />
              </div>
              <input
                type={mostrarPass1 ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-3 bg-[#1a1a1a] border ${errors.nuevaContrasena ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-800 focus:border-[#d7f250] focus:ring-[#d7f250]/20'} rounded-lg text-white focus:outline-none focus:ring-2 transition-all`}
                {...register('nuevaContrasena')}
              />
              <button
                type="button"
                onClick={() => setMostrarPass1(!mostrarPass1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#d7f250]"
              >
                {mostrarPass1 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.nuevaContrasena && <p className="mt-1 text-xs text-red-500">{errors.nuevaContrasena.message}</p>}
          </div>

          {/* Input: Confirmar Contraseña */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
              CONFIRMAR CONTRASEÑA
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-500" />
              </div>
              <input
                type={mostrarPass2 ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-3 bg-[#1a1a1a] border ${errors.confirmarContrasena ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-800 focus:border-[#d7f250] focus:ring-[#d7f250]/20'} rounded-lg text-white focus:outline-none focus:ring-2 transition-all`}
                {...register('confirmarContrasena')}
              />
              <button
                type="button"
                onClick={() => setMostrarPass2(!mostrarPass2)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#d7f250]"
              >
                {mostrarPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmarContrasena && <p className="mt-1 text-xs text-red-500">{errors.confirmarContrasena.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#111111] font-black py-4 rounded-lg flex justify-center items-center uppercase tracking-widest transition-all disabled:opacity-70"
          >
            {isSubmitting ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> GUARDANDO...</> : 'GUARDAR CONTRASEÑA'}
          </button>
        </form>

      </div>
    </div>
  );
};