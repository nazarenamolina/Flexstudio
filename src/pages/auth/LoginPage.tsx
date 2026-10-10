import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useLogin } from '../../hooks/useLogin';
import { RecuperarPasswordModal } from '../../components/RecuperarPasswordModal';
import { PantallaDividida, AvisoRecaptcha } from './DisenoAuth';
import { claseEtiqueta, claseCampo, claseError, claseBotonPrincipal, claseEnlace, claseBotonOjo, claseAvisoError } from './estilos';

export const LoginPage = () => {
  const [mostrarPass, setMostrarPass] = useState(false);
  const [modalRecuperar, setModalRecuperar] = useState(false);
  const { form: { register, formState: { errors, isSubmitting } }, errorServidor, onSubmit } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const toastMostrado = useRef(false);

  useEffect(() => {
    if (location.state?.mensaje && !toastMostrado.current) {
      toast.success(location.state.mensaje, { duration: 5000 });
      toastMostrado.current = true;
      navigate(location.pathname, { replace: true, state: { desde: location.state?.desde } });
    }
  }, [location, navigate]);

  return (
    <>
      <PantallaDividida frase="Iniciá sesión para continuar tu progreso.">
        <div className="text-center mb-8">
          <h1 className="font-principal text-3xl sm:text-4xl md:text-5xl uppercase leading-tight mb-2 break-words">
            Bienvenido/a <span className="bg-[#d7f250] px-2 box-decoration-clone">de nuevo</span>
          </h1>
          <p className="text-neutral-600 text-[15px]">Ingresá tus datos para acceder a tus clases.</p>
        </div>

        {errorServidor && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} role="alert" className={`${claseAvisoError} justify-center text-center mb-6`}>
            {errorServidor}
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="login-correo" className={claseEtiqueta}>Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
              <input
                id="login-correo"
                type="email"
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                aria-invalid={!!errors.correo}
                className={`${claseCampo(errors.correo)} pl-12`}
                {...register('correo')}
              />
            </div>
            {errors.correo && <p className={claseError}>{errors.correo.message}</p>}
          </div>

          <div>
            <label htmlFor="login-contrasena" className={claseEtiqueta}>Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
              <input
                id="login-contrasena"
                type={mostrarPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!errors.contrasena}
                className={`${claseCampo(errors.contrasena)} pl-12 pr-12`}
                {...register('contrasena')}
              />
              <button
                type="button"
                onClick={() => setMostrarPass(!mostrarPass)}
                aria-label={mostrarPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className={claseBotonOjo}
              >
                {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.contrasena && <p className={claseError}>{errors.contrasena.message}</p>}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pl-1">
            <label htmlFor="recordarme" className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                id="recordarme"
                className="w-4 h-4 rounded border-neutral-400 cursor-pointer accent-[#131313]"
                {...register('recordarme')}
              />
              Mantenerme conectado
            </label>
            <button type="button" onClick={() => setModalRecuperar(true)} className={`${claseEnlace} text-sm font-semibold cursor-pointer`}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" disabled={isSubmitting} className={claseBotonPrincipal}>
            {isSubmitting ? <><Loader2 className="animate-spin h-5 w-5" /> Iniciando…</> : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-neutral-600 text-sm mt-8">
          ¿Aún no tenés una cuenta?{' '}
          <Link to="/registro" state={location.state} className={claseEnlace}>Crear cuenta</Link>
        </p>

        <AvisoRecaptcha />
      </PantallaDividida>

      <RecuperarPasswordModal isOpen={modalRecuperar} onClose={() => setModalRecuperar(false)} />
    </>
  );
};
