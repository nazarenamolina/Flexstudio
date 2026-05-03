import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, ArrowLeft, Lock } from 'lucide-react';
import { useRegistro } from '../../hooks/useRegistro';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Controller } from 'react-hook-form';
import { Country, State } from 'country-state-city';
import { motion } from 'framer-motion';

export const RegistroPage = () => {
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmPass, setMostrarConfirmPass] = useState(false);

  const { form: { register, watch, control, formState: { errors, isSubmitting } }, onSubmit } = useRegistro();

  // 👇 Nuevas clases premium para inputs y labels
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1";
  const inputClass = (error?: any) => `w-full bg-[#0a0a0a] border ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-800 focus:border-[#d7f250] focus:ring-[#d7f250]/20'} focus:ring-4 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none transition-all duration-300 shadow-inner font-medium`;

  const paisSeleccionadoNombre = watch('pais');
  const paisIsoCode = Country.getAllCountries().find(c => c.name === paisSeleccionadoNombre)?.isoCode;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#131313] font-sans">
      
      {/* =========================================
          LADO IZQUIERDO (IMAGEN)
      ========================================= */}
      <div className="relative w-full lg:w-1/2 h-72 lg:h-full shrink-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale" 
          style={{ backgroundImage: `url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1774998043/fondologin_iltsgx.jpg')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent" />
        
        <div className="relative z-10 w-full h-full p-6 lg:p-10 flex flex-col justify-between">
          <Link to="/" className="group inline-flex items-center text-gray-400 text-xs font-bold tracking-widest hover:text-[#d7f250] transition-colors uppercase">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Volver al inicio
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-1/2 lg:h-full overflow-y-auto flex flex-col items-center p-6 sm:p-10 pt-4 lg:pt-12 pb-20 custom-scrollbar bg-[#111111]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl my-auto"
        >
          
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              Crear <span className="text-[#d7f250]">Cuenta</span>
            </h1>
            <p className="text-gray-400 text-[15px]">Completa tus datos para comenzar tu entrenamiento.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            
            {/* SECCIÓN: DATOS PERSONALES */}
            <div className="space-y-5">
              <h3 className="text-white font-black uppercase tracking-widest text-sm border-b border-gray-800 pb-3">Datos Personales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Nombre *</label>
                  <input type="text" placeholder="Tu nombre" {...register('nombre')} className={inputClass(errors.nombre)} />
                  {errors.nombre && <p className="text-xs text-red-400 font-bold mt-1.5 ml-1">{errors.nombre?.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Apellido *</label>
                  <input type="text" placeholder="Tu apellido" {...register('apellido')} className={inputClass(errors.apellido)} />
                  {errors.apellido && <p className="text-xs text-red-400 font-bold mt-1.5 ml-1">{errors.apellido?.message}</p>}
                </div>
              </div>
              
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" placeholder="correo@ejemplo.com" {...register('correo')} className={inputClass(errors.correo)} />
                {errors.correo && <p className="text-xs text-red-400 font-bold mt-1.5 ml-1">{errors.correo?.message}</p>}
              </div>

              {/* CONTRASEÑA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className={labelClass}>Contraseña *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-600" />
                    </div>
                    <input 
                      type={mostrarPass ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...register('contrasena')} 
                      className={`${inputClass(errors.contrasena)} pl-11 pr-12`} 
                    />
                    <button type="button" onClick={() => setMostrarPass(!mostrarPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d7f250] transition-colors focus:outline-none">
                      {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.contrasena && <p className="text-xs text-red-400 font-bold mt-1.5 ml-1">{errors.contrasena?.message}</p>}
                </div>

                {/* CONFIRMAR CONTRASEÑA */}
                <div className="relative">
                  <label className={labelClass}>Confirmar Clave *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-600" />
                    </div>
                    <input 
                      type={mostrarConfirmPass ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...register('confirmarContrasena')} 
                      className={`${inputClass(errors.confirmarContrasena)} pl-11 pr-12`} 
                    />
                    <button type="button" onClick={() => setMostrarConfirmPass(!mostrarConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d7f250] transition-colors focus:outline-none">
                      {mostrarConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmarContrasena && <p className="text-xs text-red-400 font-bold mt-1.5 ml-1">{errors.confirmarContrasena?.message}</p>}
                </div>
              </div>
            </div>

            {/* SECCIÓN: DATOS DE CONTACTO */}
            <div className="space-y-5 pt-4">
              <h3 className="text-white font-black uppercase tracking-widest text-sm border-b border-gray-800 pb-3">Datos de Contacto</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* TELÉFONO INTERNACIONAL */}
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <Controller
                    name="telefono"
                    control={control}
                    rules={{
                      required: 'El teléfono es obligatorio', validate: (value) => {
                        if (!value) return true;
                        return isValidPhoneNumber(value) || 'Número no válido para este país';
                      }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <div className={`flex items-center w-full bg-[#0a0a0a] border ${errors.telefono ? 'border-red-500 focus-within:ring-red-500/20' : 'border-gray-800 focus-within:border-[#d7f250] focus-within:ring-[#d7f250]/20'} focus-within:ring-4 rounded-xl px-4 py-1.5 transition-all duration-300 shadow-inner`}>
                        <PhoneInput
                          international
                          defaultCountry="AR"
                          countryCallingCodeEditable={false}
                          value={value}
                          onChange={onChange}
                          className="w-full bg-transparent outline-none text-white phone-input-premium"
                        />
                      </div>
                    )}
                  />
                  {errors.telefono && <p className="text-xs text-red-400 font-bold mt-1.5 ml-1">{errors.telefono?.message}</p>}
                </div>
                
                <div>
                  <label className={labelClass}>Fecha de Nacimiento</label>
                  <input type="date" {...register('fechaNacimiento')} className={`color-scheme-dark ${inputClass(errors.fechaNacimiento)}`} style={{ colorScheme: "dark" }} />
                </div>

                <div>
                  <label className={labelClass}>País</label>
                  <select {...register('pais')} className={inputClass(errors.pais)}>
                    <option value="" className="bg-[#131313]">Seleccione un país</option>
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.name} className="bg-[#131313]">
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Provincia / Estado</label>
                  <select {...register('provincia')} className={inputClass(errors.provincia)} disabled={!paisIsoCode}>
                    <option value="" className="bg-[#131313]">Seleccione una provincia</option>
                    {paisIsoCode && State.getStatesOfCountry(paisIsoCode).map((state) => (
                      <option key={state.isoCode} value={state.name} className="bg-[#131313]">
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Ciudad</label>
                  <input type="text" placeholder="Ej: Buenos Aires" {...register('ciudad')} className={inputClass(errors.ciudad)} />
                </div>
                
                <div>
                  <label className={labelClass}>Código Postal</label>
                  <input type="text" placeholder="Ej: 1425" {...register('codigoPostal')} className={inputClass(errors.codigoPostal)} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Dirección</label>
                <input type="text" placeholder="Ej: Av. Corrientes 1234" {...register('direccion')} className={inputClass(errors.direccion)} />
              </div>
            </div>

            {/* BOTÓN DE SUBMIT */}
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full mt-10 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] font-black text-[15px] py-4 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-70 hover:shadow-[0_0_20px_rgba(215,242,80,0.2)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> CREANDO CUENTA...</> : 'CREAR CUENTA'}
            </button>
            
            <p className="text-center text-gray-400 text-sm mt-6">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-white font-bold hover:text-[#d7f250] transition-colors">INICIAR SESIÓN</Link>
            </p>
          </form>

          {/* FOOTER LEGAL */}
          <div className="mt-12 text-center text-[11px] text-gray-500 leading-relaxed">
            Este sitio está protegido por reCAPTCHA y se aplican la{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#d7f250] hover:underline transition-all">
              Política de Privacidad
            </a>{' '}
            y los{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#d7f250] hover:underline transition-all">
              Términos de Servicio
            </a>{' '}
            de Google.
          </div>

        </motion.div>
      </div>
    </div>
  );
};