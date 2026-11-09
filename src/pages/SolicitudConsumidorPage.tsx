import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { crearSolicitudRequest, type TipoSolicitud } from '../api/solicitudes';
import { mensajeDeError } from '../api/errores';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { CORREO_ATENCION, RUTA_ATENCION } from '../legal';
import { claseAvisoError, claseBotonPrincipal, claseCampo, claseEnlace, claseError, claseEtiqueta, claseTarjeta } from './auth/estilos';

// Mismos límites que crear-solicitud.dto.ts en el back.
const esquema = z.object({
  nombre: z.string().trim().min(2, 'Escribí tu nombre y apellido').max(150, 'El nombre es muy largo (máximo 150 caracteres)'),
  correo: z.string().trim().email('Ingresá un correo electrónico válido').max(255, 'El correo es muy largo'),
  numeroComprobante: z.string().trim().max(40, 'El número es muy largo (máximo 40 caracteres)'),
  detalle: z.string().trim().max(1000, 'El mensaje es muy largo (máximo 1000 caracteres)'),
});

type ValoresFormulario = z.infer<typeof esquema>;

const TEXTOS: Record<TipoSolicitud, {
  titulo: string;
  descripcionGoogle: string;
  introduccion: ReactNode;
  etiquetaDetalle: string;
  textoBoton: string;
  exito: string;
}> = {
  ARREPENTIMIENTO: {
    titulo: 'Botón de arrepentimiento',
    descripcionGoogle: 'Revocá tu compra en Flex Studio dentro de los 10 días corridos, sin costo y sin necesidad de registrarte.',
    introduccion: (
      <>
        <p>
          Tenés <strong>10 días corridos</strong> desde tu compra para revocarla, sin costo y sin dar motivos. No necesitás iniciar sesión.
        </p>
        <p>
          Este derecho no aplica si ya empezaste más de un video del mes que compraste (Disposición 954/2025, art. 3). Si tenés dudas sobre tu caso, enviá igual el pedido y lo revisamos.
        </p>
      </>
    ),
    etiquetaDetalle: 'Comentarios (opcional)',
    textoBoton: 'Enviar arrepentimiento',
    exito: 'Registramos tu pedido de arrepentimiento.',
  },
  BAJA: {
    titulo: 'Botón de baja de servicio',
    descripcionGoogle: 'Pedí la baja de tu servicio en Flex Studio sin necesidad de registrarte ni hacer otros trámites.',
    introduccion: (
      <>
        <p>
          Podés pedir la baja del servicio contratado sin iniciar sesión ni hacer otros trámites.
        </p>
        <p>
          Cada mes de una clase se paga una sola vez: no hay suscripciones ni débitos automáticos. Si querés devolver una compra reciente, usá el <Link to="/boton-de-arrepentimiento" className={claseEnlace}>Botón de arrepentimiento</Link>.
        </p>
      </>
    ),
    etiquetaDetalle: '¿Qué querés dar de baja? (opcional)',
    textoBoton: 'Enviar pedido de baja',
    exito: 'Registramos tu pedido de baja.',
  },
};

export const SolicitudConsumidorPage = ({ tipo }: { tipo: TipoSolicitud }) => {
  const textos = TEXTOS[tipo];
  useTituloPagina(textos.titulo, textos.descripcionGoogle);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<ValoresFormulario>({
    resolver: zodResolver(esquema),
    defaultValues: { nombre: '', correo: '', numeroComprobante: '', detalle: '' },
  });

  const enviar = async (datos: ValoresFormulario) => {
    setError(null);
    if (!executeRecaptcha) {
      setError(`No pudimos cargar la verificación de seguridad. Recargá la página o escribinos a ${CORREO_ATENCION}.`);
      return;
    }
    try {
      const captchaToken = await executeRecaptcha('solicitud_consumidor');
      const respuesta = await crearSolicitudRequest({
        tipo,
        nombre: datos.nombre,
        correo: datos.correo,
        numeroComprobante: datos.numeroComprobante || undefined,
        detalle: datos.detalle || undefined,
        captchaToken,
      });
      setCodigo(respuesta.codigo);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      const mensaje = mensajeDeError(e, 'No pudimos registrar tu pedido.');
      setError(`${mensaje} Si el problema sigue, escribinos a ${CORREO_ATENCION}.`);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-12 pt-[100px] sm:px-6 lg:pt-[112px]">
      <div className={`${claseTarjeta} mx-auto w-full max-w-2xl p-6 text-[#131313] sm:p-10`}>
        <h1 className="mb-6 font-principal text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">{textos.titulo}</h1>

        {codigo ? (
          <div role="status" className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-14 w-14 text-[#131313]" aria-hidden="true" />
            <p className="text-lg font-semibold">{textos.exito}</p>
            <p className="text-neutral-600">Este es el código de identificación de tu pedido:</p>
            <p className="rounded-xl bg-[#131313] px-6 py-3 font-principal text-2xl font-bold tracking-widest text-[#d7f250]">{codigo}</p>
            <p className="text-sm text-neutral-600">
              También te lo enviamos a <strong className="break-all">{getValues('correo')}</strong>. Vamos a responderte a ese correo y, por seguridad, podemos pedirte que confirmes algún dato. Si no lo ves, revisá la carpeta de spam.
            </p>
            <Link to="/" className={claseEnlace}>Volver al inicio</Link>
          </div>
        ) : (
          <>
            <div className="mb-8 space-y-3 leading-relaxed text-neutral-700">{textos.introduccion}</div>

            <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-5">
              <div>
                <label htmlFor="solicitud-nombre" className={claseEtiqueta}>Nombre y apellido</label>
                <input
                  id="solicitud-nombre" type="text" autoComplete="name"
                  aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? 'solicitud-nombre-error' : undefined}
                  className={claseCampo(errors.nombre)} {...register('nombre')}
                />
                {errors.nombre && <p id="solicitud-nombre-error" role="alert" className={claseError}>{errors.nombre.message}</p>}
              </div>

              <div>
                <label htmlFor="solicitud-correo" className={claseEtiqueta}>Correo electrónico</label>
                <input
                  id="solicitud-correo" type="email" autoComplete="email"
                  aria-invalid={!!errors.correo} aria-describedby={errors.correo ? 'solicitud-correo-error' : undefined}
                  className={claseCampo(errors.correo)} {...register('correo')}
                />
                {errors.correo && <p id="solicitud-correo-error" role="alert" className={claseError}>{errors.correo.message}</p>}
              </div>

              <div>
                <label htmlFor="solicitud-comprobante" className={claseEtiqueta}>N° de comprobante (opcional)</label>
                <input
                  id="solicitud-comprobante" type="text" placeholder="Ej: FLEX-0012"
                  aria-invalid={!!errors.numeroComprobante} aria-describedby={errors.numeroComprobante ? 'solicitud-comprobante-error' : undefined}
                  className={claseCampo(errors.numeroComprobante)} {...register('numeroComprobante')}
                />
                {errors.numeroComprobante && <p id="solicitud-comprobante-error" role="alert" className={claseError}>{errors.numeroComprobante.message}</p>}
              </div>

              <div>
                <label htmlFor="solicitud-detalle" className={claseEtiqueta}>{textos.etiquetaDetalle}</label>
                <textarea
                  id="solicitud-detalle" rows={4}
                  aria-invalid={!!errors.detalle} aria-describedby={errors.detalle ? 'solicitud-detalle-error' : undefined}
                  className={`${claseCampo(errors.detalle)} resize-none`} {...register('detalle')}
                />
                {errors.detalle && <p id="solicitud-detalle-error" role="alert" className={claseError}>{errors.detalle.message}</p>}
              </div>

              {error && <p role="alert" className={claseAvisoError}>{error}</p>}

              <button type="submit" disabled={isSubmitting} className={claseBotonPrincipal}>
                {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Enviando…</> : textos.textoBoton}
              </button>
              <p className="text-center text-xs leading-relaxed text-neutral-500">
                Te enviamos el código de tu pedido en el momento. ¿Otra consulta? Mirá <Link to={RUTA_ATENCION} className="underline hover:text-[#131313]">Atención al consumidor</Link>.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
