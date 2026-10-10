import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { cambiarContrasenaRequest } from '../../api/auth';
import { esquemaContrasena } from '../../validaciones';
import { RequisitosContrasena } from '../../components/RequisitosContrasena';
import { PantallaTarjeta } from './DisenoAuth';
import { mensajeDeError } from '../../api/errores';
import { claseEtiqueta, claseCampo, claseError, claseBotonPrincipal, claseBotonOjo } from './estilos';

// Misma regla que el registro y el back (ver validaciones.ts).
const resetSchema = z.object({
  nuevaContrasena: esquemaContrasena,
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

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });
  const nuevaContrasena = useWatch({ control, name: 'nuevaContrasena' }) ?? '';

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
    } catch (error) {
      toast.error(mensajeDeError(error, 'El enlace caducó o es inválido. Pedí uno nuevo.'));
    }
  };

  if (!token) {
    return (
      <PantallaTarjeta icono={<AlertCircle className="w-10 h-10 text-[#131313]" />}>
        <h1 className="font-principal text-3xl uppercase mb-2 text-center">Enlace no válido</h1>
        <p className="text-neutral-600 mb-8 text-center">El enlace de recuperación está incompleto o fue modificado. Pedí uno nuevo desde el inicio de sesión.</p>
        <Link to="/login" className={claseBotonPrincipal}>Ir al inicio de sesión</Link>
      </PantallaTarjeta>
    );
  }

  return (
    <PantallaTarjeta icono={<ShieldCheck className="text-[#131313] w-10 h-10" />}>
      <div className="text-center mb-8 w-full">
        <h1 className="font-principal text-3xl uppercase mb-2">Nueva contraseña</h1>
        <p className="text-neutral-600 text-[15px] leading-relaxed">Elegí una contraseña nueva para tu cuenta de <strong className="text-[#131313]">Flex Studio</strong>.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5" noValidate>
          <div>
            <label htmlFor="reset-nueva" className={claseEtiqueta}>Nueva contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
              <input
                id="reset-nueva"
                type={mostrarPass1 ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.nuevaContrasena}
                aria-describedby="reset-requisitos"
                className={`${claseCampo(errors.nuevaContrasena)} pl-12 pr-12`}
                {...register('nuevaContrasena')}
              />
              <button type="button" onClick={() => setMostrarPass1(!mostrarPass1)} aria-label={mostrarPass1 ? 'Ocultar contraseña' : 'Mostrar contraseña'} className={claseBotonOjo}>
                {mostrarPass1 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.nuevaContrasena && <p className={claseError}>{errors.nuevaContrasena.message}</p>}
            <RequisitosContrasena valor={nuevaContrasena} id="reset-requisitos" />
          </div>

          <div>
            <label htmlFor="reset-confirmar" className={claseEtiqueta}>Confirmar contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
              <input
                id="reset-confirmar"
                type={mostrarPass2 ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.confirmarContrasena}
                className={`${claseCampo(errors.confirmarContrasena)} pl-12 pr-12`}
                {...register('confirmarContrasena')}
              />
              <button type="button" onClick={() => setMostrarPass2(!mostrarPass2)} aria-label={mostrarPass2 ? 'Ocultar contraseña' : 'Mostrar contraseña'} className={claseBotonOjo}>
                {mostrarPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmarContrasena && <p className={claseError}>{errors.confirmarContrasena.message}</p>}
          </div>

        <div className="pt-4">
          <button type="submit" disabled={isSubmitting} className={claseBotonPrincipal}>
            {isSubmitting ? <><Loader2 className="animate-spin h-5 w-5" /> Guardando…</> : 'Guardar contraseña'}
          </button>
        </div>
      </form>
    </PantallaTarjeta>
  );
};
