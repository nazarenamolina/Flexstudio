import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useLogin } from '../../hooks/useLogin';
import { RecuperarPasswordModal } from '../../components/RecuperarPasswordModal';

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
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // 👇 Clases premium unificadas con el Registro
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1";
  const inputClass = (error?: any) => `w-full bg-[#0a0a0a] border ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-800 focus:border-[#d7f250] focus:ring-[#d7f250]/20'} focus:ring-4 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none transition-all duration-300 shadow-inner font-medium`;

  return (
    <>
      <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#131313] font-sans">

        {/* =========================================
            LADO IZQUIERDO (IMAGEN)
        ========================================= */}
        <div className="relative w-full lg:w-1/2 h-72 lg:h-full shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center grayscale"
            style={{ backgroundImage: `url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1774998043/fondologin_iltsgx.jpg')` }}
          />
          {/* Degradado para fundir la imagen con el fondo oscuro */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent" />

          <div className="relative z-10 w-full h-full p-6 lg:p-10 flex flex-col justify-between">
            <Link to="/" className="group inline-flex items-center text-gray-400 text-xs font-bold tracking-widest hover:text-[#d7f250] transition-colors uppercase">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>
            <div className="hidden lg:block">
              <h2 className="text-4xl font-black text-white tracking-tighter mb-2">FLEXSTUDIO</h2>
              <p className="text-gray-400 text-lg">Inicia sesión para continuar tu progreso.</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 lg:h-full overflow-y-auto flex flex-col items-center justify-center p-6 sm:p-12 custom-scrollbar bg-[#111111]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md my-auto"
          >

            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-[#d7f250] tracking-tighter leading-tight mb-2">
                Bienvenido/a<br />de nuevo
              </h1>
              <p className="text-gray-400 text-[15px]">Ingresa tus credenciales para acceder.</p>
            </div>

            {errorServidor && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium text-center p-4 rounded-xl mb-6 shadow-sm">
                {errorServidor}
              </motion.div>
            )}

            {/* Formulario */}
            <form onSubmit={onSubmit} className="space-y-6">

              {/* Input: Correo */}
              <div>
                <label className={labelClass}>EMAIL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className={`${inputClass(errors.correo)} pl-12`}
                    {...register('correo')}
                  />
                </div>
                {errors.correo && <p className="mt-1.5 ml-1 text-xs text-red-400 font-bold">{errors.correo.message}</p>}
              </div>

              {/* Input: Contraseña con Ojo */}
              <div>
                <label className={labelClass}>CONTRASEÑA</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-600" />
                  </div>
                  <input
                    type={mostrarPass ? "text" : "password"}
                    placeholder="••••••••"
                    className={`${inputClass(errors.contrasena)} pl-12 pr-12`}
                    {...register('contrasena')}
                  />
                  {/* Botón flotante del Ojo */}
                  <button
                    type="button"
                    onClick={() => setMostrarPass(!mostrarPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d7f250] transition-colors focus:outline-none"
                  >
                    {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.contrasena && <p className="mt-1.5 ml-1 text-xs text-red-400 font-bold">{errors.contrasena.message}</p>}
              </div>

              {/* Extras: Checkbox y Olvidaste contraseña */}
              

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] font-black text-[15px] py-4 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-70 hover:shadow-[0_0_20px_rgba(215,242,80,0.2)] hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    INICIANDO...
                  </>
                ) : (
                  'INICIAR SESIÓN'
                )}
              </button>

            </form>
            <div className="flex items-center justify-center mt-4 pt-1">
                <button
                  type="button"
                  onClick={() => setModalRecuperar(true)}
                  className="text-[11px] font-bold text-gray-400 hover:text-[#d7f250] transition-colors uppercase tracking-wider"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

            {/* Enlace al Registro */}
            <p className="text-center text-gray-400 text-sm mt-8">
              ¿Aún no tenés una cuenta?{' '}
              <Link to="/registro" className="text-white font-bold hover:text-[#d7f250] transition-colors">
                CREAR CUENTA
              </Link>
            </p>

            <div className="mt-10 text-center text-[11px] text-gray-500 leading-relaxed">
              Este sitio está protegido por reCAPTCHA y se aplican la{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#d7f250] hover:underline transition-all">Política de privacidad</a> y los{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#d7f250] hover:underline transition-all">Términos de servicio</a> de Google.
            </div>

          </motion.div>
        </div>
      </div>

      <RecuperarPasswordModal
        isOpen={modalRecuperar}
        onClose={() => setModalRecuperar(false)}
      />
    </>
  );
};