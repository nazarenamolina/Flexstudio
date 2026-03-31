import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useRegistro } from '../../hooks/useRegistro';

export const RegistroPage = () => {
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmPass, setMostrarConfirmPass] = useState(false);
  const {
    form: { register, watch, formState: { errors, isSubmitting } }, onSubmit } = useRegistro();
  const contrasenaValue = watch('contrasena') || '';
  const reqs = {
    length: contrasenaValue.length >= 6,
    upper: /[A-Z]/.test(contrasenaValue),
    lower: /[a-z]/.test(contrasenaValue),
    number: /\d/.test(contrasenaValue),
    special: /[\W_]/.test(contrasenaValue),
  };

  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1";
  const inputClass = (error?: any) => `w-full bg-transparent border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-[#d7f250] focus:border-white focus:ring-white/20'
    } rounded-md px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all`;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-bg-card font-sans">

      {/* LADO IZQUIERDO (O ARRIBA): Imagen de la Gimnasta */}
      <div className="w-full lg:w-1/2 h-72 lg:h-full bg-cover bg-center grayscale shrink-0" style={{ backgroundImage: `url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1774998043/fondologin_iltsgx.jpg')`}}>
        <div className="w-full h-full bg-black/40 p-6 lg:p-8 flex flex-col justify-between">
          <Link to="/" className="text-white text-xs font-bold tracking-widest hover:text-[#d7f250] transition-colors">← VOLVER AL INICIO</Link>
        </div>
      </div>

      {/* LADO DERECHO (O ABAJO): Formulario */}
      <div className="w-full lg:w-1/2 lg:h-full overflow-y-auto flex flex-col items-center p-6 sm:p-12 pt-10 lg:pt-12 pb-20">

        <div className="w-full max-w-xl my-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-[#d7f250] tracking-tighter mb-2">
              Crear Cuenta
            </h1>
            <p className="text-gray-400 text-sm">
              Únete a Flex Studio y comenzá tu entrenamiento.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">

            {/* SECCIÓN: DATOS PERSONALES */}
            <div>
              <h3 className="text-white font-bold mb-4 border-b border-gray-800 pb-2">Datos Personales</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nombre *</label>
                  <input type="text" {...register('nombre')} className={inputClass(errors.nombre)} />
                  {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre?.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Apellido *</label>
                  <input type="text" {...register('apellido')} className={inputClass(errors.apellido)} />
                  {errors.apellido && <p className="text-xs text-red-500 mt-1">{errors.apellido?.message}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Email *</label>
                <input type="email" placeholder="nombre@ejemplo.com" {...register('correo')} className={inputClass(errors.correo)} />
                {errors.correo && <p className="text-xs text-red-500 mt-1">{errors.correo?.message}</p>}
              </div>

              {/* INPUT: CONTRASEÑA CON OJO */}
              <div className="mt-4 relative">
                <label className={labelClass}>Contraseña *</label>
                <div className="relative">
                  <input
                    type={mostrarPass ? "text" : "password"}
                    {...register('contrasena')}
                    className={`${inputClass(errors.contrasena)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPass(!mostrarPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d7f250] transition-colors focus:outline-none"
                  >
                    {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Badges dinámicos que se iluminan en vivo */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`text-[9px] px-2 py-1 rounded border transition-all duration-300 ${reqs.length ? 'bg-[#d7f250]/10 border-[#d7f250] text-[#d7f250]' : 'bg-[#1a1a1a] border-gray-700 text-gray-400'}`}>6+ CARACTERES</span>
                  <span className={`text-[9px] px-2 py-1 rounded border transition-all duration-300 ${reqs.upper ? 'bg-[#d7f250]/10 border-[#d7f250] text-[#d7f250]' : 'bg-[#1a1a1a] border-gray-700 text-gray-400'}`}>MAYÚSCULA</span>
                  <span className={`text-[9px] px-2 py-1 rounded border transition-all duration-300 ${reqs.lower ? 'bg-[#d7f250]/10 border-[#d7f250] text-[#d7f250]' : 'bg-[#1a1a1a] border-gray-700 text-gray-400'}`}>MINÚSCULA</span>
                  <span className={`text-[9px] px-2 py-1 rounded border transition-all duration-300 ${reqs.number ? 'bg-[#d7f250]/10 border-[#d7f250] text-[#d7f250]' : 'bg-[#1a1a1a] border-gray-700 text-gray-400'}`}>NÚMERO</span>
                  <span className={`text-[9px] px-2 py-1 rounded border transition-all duration-300 ${reqs.special ? 'bg-[#d7f250]/10 border-[#d7f250] text-[#d7f250]' : 'bg-[#1a1a1a] border-gray-700 text-gray-400'}`}>CARÁCTER ESPECIAL</span>
                </div>
                {errors.contrasena && <p className="text-xs text-red-500 mt-1">{errors.contrasena?.message}</p>}
              </div>

              {/* INPUT: CONFIRMAR CONTRASEÑA CON OJO */}
              <div className="mt-4 relative">
                <label className={labelClass}>Confirmar Contraseña *</label>
                <div className="relative">
                  <input
                    type={mostrarConfirmPass ? "text" : "password"}
                    {...register('confirmarContrasena')}
                    className={`${inputClass(errors.confirmarContrasena)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmPass(!mostrarConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d7f250] transition-colors focus:outline-none"
                  >
                    {mostrarConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmarContrasena && <p className="text-xs text-red-500 mt-1">{errors.confirmarContrasena?.message}</p>}
              </div>
            </div>

            {/* SECCIÓN: DATOS DE CONTACTO */}
            <div className="pt-4">
              <h3 className="text-white font-bold mb-4 border-b border-gray-800 pb-2">Datos de Contacto</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input type="tel" {...register('telefono')} className={inputClass(errors.telefono)} />
                </div>
                <div>
                  <label className={labelClass}>Fecha de Nacimiento</label>
                  <input type="date" {...register('fechaNacimiento')} className={inputClass(errors.fechaNacimiento)} />
                </div>

                <div>
                  <label className={labelClass}>País</label>
                  <input type="text" {...register('pais')} className={inputClass(errors.pais)} />
                </div>
                <div>
                  <label className={labelClass}>Provincia / Estado</label>
                  <input type="text" {...register('provincia')} className={inputClass(errors.provincia)} />
                </div>

                <div>
                  <label className={labelClass}>Ciudad</label>
                  <input type="text" {...register('ciudad')} className={inputClass(errors.ciudad)} />
                </div>
                <div>
                  <label className={labelClass}>Código Postal</label>
                  <input type="text" {...register('codigoPostal')} className={inputClass(errors.codigoPostal)} />
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Dirección</label>
                <input type="text" {...register('direccion')} className={inputClass(errors.direccion)} />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-bg-card font-black text-sm py-3 px-4 rounded transition-all duration-200 flex items-center justify-center disabled:opacity-70 mt-8"
            >
              {isSubmitting ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> CREANDO CUENTA...</> : 'CREAR CUENTA'}
            </button>
            <p className="text-center text-gray-400 text-xs mt-4">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-white font-bold hover:text-[#d7f250]">INICIAR SESIÓN</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};