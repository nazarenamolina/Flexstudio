import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLogin } from '../../hooks/useLogin';

export const LoginPage = () => {
  const [mostrarPass, setMostrarPass] = useState(false);
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

  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1";
  const inputClass = (error?: any) => `w-full pl-10 pr-10 py-3 bg-transparent border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-[#d7f250] focus:border-white focus:ring-white/20'
    } rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all`;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg-card font-sans">

      {/* --- LADO IZQUIERDO: Imagen --- */}
      <div
        className="w-full lg:w-1/2 h-72 lg:h-auto lg:min-h-screen bg-cover bg-center grayscale shrink-0"
        style={{ backgroundImage: `url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1774998043/fondologin_iltsgx.jpg')` }}
      >
        <div className="w-full h-full bg-black/40 p-6 lg:p-8 flex flex-col justify-between">
          <Link to="/" className="text-white text-xs font-bold tracking-widest hover:text-[#d7f250] transition-colors">
            ← VOLVER AL INICIO
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex-1 flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-[#d7f250] tracking-tighter leading-tight">
              Bienvenido/a<br />de nuevo
            </h1>
          </div>

          {errorServidor && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center p-3 rounded-lg mb-6">
              {errorServidor}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={onSubmit} className="space-y-6">

            {/* Input: Correo */}
            <div>
              <label className={labelClass}>EMAIL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  className={inputClass(errors.correo)}
                  {...register('correo')}
                />
              </div>
              {errors.correo && <p className="mt-1 text-xs text-red-500">{errors.correo.message}</p>}
            </div>

            {/* Input: Contraseña con Ojo */}
            <div>
              <label className={labelClass}>CONTRASEÑA</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type={mostrarPass ? "text" : "password"}
                  placeholder="••••••••"
                  className={inputClass(errors.contrasena)}
                  {...register('contrasena')}
                />
                {/* Botón flotante del Ojo */}
                <button
                  type="button"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d7f250] transition-colors focus:outline-none"
                >
                  {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.contrasena && <p className="mt-1 text-xs text-red-500">{errors.contrasena.message}</p>}
            </div>

            {/* Extras: Checkbox y Olvidaste contraseña */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 accent-[#d7f250] cursor-pointer" />
                <span className="ml-2 text-[10px] font-bold text-white tracking-widest uppercase group-hover:text-[#d7f250] transition-colors">
                  RECORDARME
                </span>
              </label>
              <Link to="#" className="text-xs text-gray-400 hover:text-[#d7f250] transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-bg-card font-black text-sm py-4 px-4 rounded-md transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4 uppercase tracking-widest"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  INICIANDO...
                </>
              ) : (
                'INICIAR SESIÓN'
              )}
            </button>
          </form>

          {/* Enlace al Registro */}
          <p className="text-center text-gray-400 text-xs mt-8">
            ¿Aún no tenés una cuenta?{' '}
            <Link to="/registro" className="text-white font-bold hover:text-[#d7f250] transition-colors">
              CREAR CUENTA
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};