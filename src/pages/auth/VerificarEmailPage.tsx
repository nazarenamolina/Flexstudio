import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, MailCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { verificarEmailRequest, reenviarOtpRequest } from '../../api/auth';
import { PantallaTarjeta } from './DisenoAuth';
import { mensajeDeError } from '../../api/errores';
import { claseAvisoError, claseError, claseBotonPrincipal, claseEnlace } from './estilos';

// El correo llega por el state de la navegación (registro o login sin verificar). Se guarda en la
// sesión del navegador para que recargar la página no lo pierda, junto con la hora del último envío
// del código: el back no permite reenviarlo antes de 1 minuto.
const CLAVE_CORREO = 'flex-verificar-correo';
const CLAVE_ENVIO = 'flex-verificar-enviado';
const ESPERA_REENVIO_S = 60;

const leer = (clave: string) => { try { return sessionStorage.getItem(clave); } catch { return null; } };
const guardar = (clave: string, valor: string) => { try { sessionStorage.setItem(clave, valor); } catch { /* modo privado */ } };
const borrar = () => { try { sessionStorage.removeItem(CLAVE_CORREO); sessionStorage.removeItem(CLAVE_ENVIO); } catch { /* modo privado */ } };

export const VerificarEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const correoNavegacion: string | undefined = location.state?.correo;
  const correo = correoNavegacion ?? leer(CLAVE_CORREO) ?? undefined;
  // Si se llega desde el registro o el login, el código se acaba de enviar.
  const [enviadoEn, setEnviadoEn] = useState(() => (correoNavegacion ? Date.now() : Number(leer(CLAVE_ENVIO)) || 0));
  const [ahora, setAhora] = useState(() => Date.now());
  const restante = Math.max(0, ESPERA_REENVIO_S - Math.floor((ahora - enviadoEn) / 1000));

  useEffect(() => {
    if (!correo) return;
    guardar(CLAVE_CORREO, correo);
    guardar(CLAVE_ENVIO, String(enviadoEn));
  }, [correo, enviadoEn]);

  useEffect(() => {
    if (restante <= 0) return;
    const reloj = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(reloj);
  }, [restante]);
  const [cargando, setCargando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [mensajeReenvio, setMensajeReenvio] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<{ codigo: string }>();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const reenviarCodigo = async () => {
    if (!executeRecaptcha || !correo || restante > 0) return;
    setReenviando(true);
    setErrorGlobal(null);
    setMensajeReenvio(null);
    try {
      const captchaToken = await executeRecaptcha('reenviar_otp');
      const respuesta = await reenviarOtpRequest({ correo, captchaToken });
      setMensajeReenvio(respuesta.mensaje);
      setEnviadoEn(Date.now());
      setAhora(Date.now());
    } catch (error) {
      setErrorGlobal(mensajeDeError(error, 'No pudimos reenviar el código. Intentá en un minuto.'));
    } finally {
      setReenviando(false);
    }
  };

  if (!correo) {
    return <Navigate to="/registro" replace />;
  }

  const onSubmit = async (data: { codigo: string }) => {
    setCargando(true);
    setErrorGlobal(null);
    try {
      await verificarEmailRequest({ correo, codigo: data.codigo });
      borrar();
      navigate('/login', { state: { mensaje: '¡Cuenta verificada! Ya puedes iniciar sesión.' } });
    } catch (error) {
      setErrorGlobal(mensajeDeError(error, 'Código incorrecto o expirado.'));
    } finally {
      setCargando(false);
    }
  };

  return (
    <PantallaTarjeta icono={<MailCheck className="text-[#131313] w-10 h-10" />}>
      <h1 className="font-principal text-3xl uppercase mb-3 text-center">Revisá tu correo</h1>
      <p className="text-neutral-600 text-[15px] text-center mb-8 leading-relaxed">
        Enviamos un código de 6 dígitos a <br />
        <strong className="text-[#131313] font-bold break-all">{correo}</strong>
      </p>

      {errorGlobal && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} role="alert" className={`${claseAvisoError} mb-6`}>
          <AlertCircle size={18} className="flex-shrink-0" /> {errorGlobal}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6" noValidate>
        <div>
          <label htmlFor="codigo-otp" className="sr-only">Código de verificación</label>
          <input
            id="codigo-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            aria-invalid={!!errors.codigo}
            className={`w-full bg-white border ${errors.codigo ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-300 focus:border-[#131313] focus:ring-[#d7f250]/50'} focus:ring-4 rounded-2xl px-4 py-5 text-center font-principal text-3xl sm:text-4xl tracking-[0.3em] sm:tracking-[0.5em] focus:outline-none transition-all duration-200 text-[#131313] placeholder-neutral-300`}
            {...register('codigo', {
              required: 'Ingresá el código',
              pattern: { value: /^[0-9]{6}$/, message: 'Debe contener exactamente 6 números' }
            })}
          />
          {errors.codigo && <p className={`${claseError} text-center`}>{errors.codigo.message}</p>}
        </div>

        <button type="submit" disabled={cargando} className={claseBotonPrincipal}>
          {cargando ? <><Loader2 className="animate-spin h-5 w-5" /> Verificando…</> : 'Confirmar correo'}
        </button>
      </form>

      <button
        type="button"
        onClick={reenviarCodigo}
        disabled={reenviando || restante > 0}
        className={`${claseEnlace} text-sm mt-6 disabled:opacity-60 disabled:no-underline disabled:cursor-default cursor-pointer`}
      >
        {reenviando ? 'Reenviando…'
          : restante > 0 ? `Podés pedir otro código en 0:${String(restante).padStart(2, '0')}`
          : '¿No te llegó o expiró? Reenviar código'}
      </button>
      {mensajeReenvio && <p className="text-[#131313] bg-[#d7f250]/40 rounded-lg px-3 py-1.5 text-xs text-center mt-3">{mensajeReenvio}</p>}

      <button
        type="button"
        onClick={() => { borrar(); navigate('/registro'); }}
        className="group text-neutral-500 hover:text-[#131313] font-principal text-xs flex items-center gap-2 transition-colors mt-8 uppercase tracking-widest cursor-pointer"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" /> Corregir correo
      </button>
    </PantallaTarjeta>
  );
};
