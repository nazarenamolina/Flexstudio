import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import { useRegistro } from '../../hooks/useRegistro';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Controller, useWatch } from 'react-hook-form';
import { Country, State } from 'country-state-city';
import { PantallaDividida, AvisoRecaptcha } from './DisenoAuth';
import { RequisitosContrasena } from '../../components/RequisitosContrasena';
import { claseEtiqueta, claseCampo, claseError, claseBotonPrincipal, claseEnlace, claseBotonOjo } from './estilos';

const claseSeccion = 'font-principal text-lg uppercase tracking-wide border-b-2 border-[#d7f250] pb-2';

export const RegistroPage = () => {
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmPass, setMostrarConfirmPass] = useState(false);

  const { form: { register, control, formState: { errors, isSubmitting } }, onSubmit } = useRegistro();

  const paisSeleccionadoNombre = useWatch({ control, name: 'pais' });
  const contrasena = useWatch({ control, name: 'contrasena' }) ?? '';
  const paisIsoCode = Country.getAllCountries().find(c => c.name === paisSeleccionadoNombre)?.isoCode;

  return (
    <PantallaDividida frase="Creá tu cuenta y empezá a entrenar.">
      <div className="mb-8">
        <h1 className="font-principal text-4xl uppercase leading-tight mb-2">
          Crear <span className="bg-[#d7f250] px-2">cuenta</span>
        </h1>
        <p className="text-neutral-600 text-[15px]">Completá tus datos para comenzar tu entrenamiento.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div className="space-y-5">
          <h2 className={claseSeccion}>Datos personales</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="registro-nombre" className={claseEtiqueta}>Nombre *</label>
              <input id="registro-nombre" type="text" autoComplete="given-name" placeholder="Tu nombre" {...register('nombre')} className={claseCampo(errors.nombre)} />
              {errors.nombre && <p className={claseError}>{errors.nombre.message}</p>}
            </div>
            <div>
              <label htmlFor="registro-apellido" className={claseEtiqueta}>Apellido *</label>
              <input id="registro-apellido" type="text" autoComplete="family-name" placeholder="Tu apellido" {...register('apellido')} className={claseCampo(errors.apellido)} />
              {errors.apellido && <p className={claseError}>{errors.apellido.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="registro-correo" className={claseEtiqueta}>Email *</label>
            <input id="registro-correo" type="email" autoComplete="email" placeholder="correo@ejemplo.com" {...register('correo')} className={claseCampo(errors.correo)} />
            {errors.correo && <p className={claseError}>{errors.correo.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="registro-contrasena" className={claseEtiqueta}>Contraseña *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <input
                  id="registro-contrasena"
                  type={mostrarPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-describedby="registro-requisitos"
                  {...register('contrasena')}
                  className={`${claseCampo(errors.contrasena)} pl-11 pr-12`}
                />
                <button type="button" onClick={() => setMostrarPass(!mostrarPass)} aria-label={mostrarPass ? 'Ocultar contraseña' : 'Mostrar contraseña'} className={claseBotonOjo}>
                  {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.contrasena && <p className={claseError}>{errors.contrasena.message}</p>}
            </div>

            <div>
              <label htmlFor="registro-confirmar" className={claseEtiqueta}>Confirmar contraseña *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <input
                  id="registro-confirmar"
                  type={mostrarConfirmPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register('confirmarContrasena')}
                  className={`${claseCampo(errors.confirmarContrasena)} pl-11 pr-12`}
                />
                <button type="button" onClick={() => setMostrarConfirmPass(!mostrarConfirmPass)} aria-label={mostrarConfirmPass ? 'Ocultar contraseña' : 'Mostrar contraseña'} className={claseBotonOjo}>
                  {mostrarConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmarContrasena && <p className={claseError}>{errors.confirmarContrasena.message}</p>}
            </div>

            <div className="md:col-span-2 -mt-2">
              <RequisitosContrasena valor={contrasena} id="registro-requisitos" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h2 className={claseSeccion}>Datos de contacto</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="registro-telefono" className={claseEtiqueta}>Teléfono *</label>
              <Controller
                name="telefono"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className={`flex items-center w-full bg-white border ${errors.telefono ? 'border-red-500 focus-within:ring-red-500/20' : 'border-neutral-300 focus-within:border-[#131313] focus-within:ring-[#d7f250]/50'} focus-within:ring-4 rounded-xl px-4 py-1.5 transition-all duration-200`}>
                    <PhoneInput
                      id="registro-telefono"
                      international
                      defaultCountry="AR"
                      countryCallingCodeEditable={false}
                      autoComplete="tel"
                      value={value}
                      onChange={onChange}
                      className="w-full bg-transparent outline-none text-[#131313] telefono-claro"
                    />
                  </div>
                )}
              />
              {errors.telefono && <p className={claseError}>{errors.telefono.message}</p>}
            </div>

            <div>
              <label htmlFor="registro-nacimiento" className={claseEtiqueta}>Fecha de nacimiento</label>
              <input id="registro-nacimiento" type="date" autoComplete="bday" {...register('fechaNacimiento')} className={claseCampo(errors.fechaNacimiento)} />
            </div>

            <div>
              <label htmlFor="registro-pais" className={claseEtiqueta}>País</label>
              <select id="registro-pais" autoComplete="country-name" {...register('pais')} className={claseCampo(errors.pais)}>
                <option value="">Seleccioná un país</option>
                {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.name}>{country.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="registro-provincia" className={claseEtiqueta}>Provincia / Estado</label>
              <select id="registro-provincia" {...register('provincia')} className={claseCampo(errors.provincia)} disabled={!paisIsoCode}>
                <option value="">Seleccioná una provincia</option>
                {paisIsoCode && State.getStatesOfCountry(paisIsoCode).map((state) => (
                  <option key={state.isoCode} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="registro-ciudad" className={claseEtiqueta}>Ciudad</label>
              <input id="registro-ciudad" type="text" autoComplete="address-level2" placeholder="Ej: Buenos Aires" {...register('ciudad')} className={claseCampo(errors.ciudad)} />
            </div>

            <div>
              <label htmlFor="registro-cp" className={claseEtiqueta}>Código postal</label>
              <input id="registro-cp" type="text" autoComplete="postal-code" placeholder="Ej: 1425" {...register('codigoPostal')} className={claseCampo(errors.codigoPostal)} />
            </div>
          </div>

          <div>
            <label htmlFor="registro-direccion" className={claseEtiqueta}>Dirección</label>
            <input id="registro-direccion" type="text" autoComplete="street-address" placeholder="Ej: Av. Corrientes 1234" {...register('direccion')} className={claseCampo(errors.direccion)} />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className={claseBotonPrincipal}>
          {isSubmitting ? <><Loader2 className="animate-spin h-5 w-5" /> Creando cuenta…</> : 'Crear cuenta'}
        </button>

        <p className="text-center text-neutral-600 text-sm">
          ¿Ya tenés una cuenta? <Link to="/login" className={claseEnlace}>Iniciar sesión</Link>
        </p>
      </form>

      <AvisoRecaptcha />
    </PantallaDividida>
  );
};
