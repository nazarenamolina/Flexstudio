import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { solicitarRecuperacionRequest } from '../api/auth';
import { mensajeDeError } from '../api/errores';
import { claseTarjeta, claseEtiqueta, claseCampo, claseBotonPrincipal } from '../pages/auth/estilos';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RecuperarPasswordModal = ({ isOpen, onClose }: Props) => {
  const [correo, setCorreo] = useState('');
  const [cargando, setCargando] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo) return toast.error('Ingresa tu correo electrónico');

    if (!executeRecaptcha) {
      return toast.error('Verificando seguridad...');
    }

    setCargando(true);
    try {
      const captchaToken = await executeRecaptcha('recuperacion');
      const respuesta = await solicitarRecuperacionRequest({ correo, captchaToken });
      
      toast.success(respuesta.mensaje || 'Revisa tu bandeja de entrada', { duration: 5000 });
      setCorreo('');
      onClose();
    } catch (error) {
      toast.error(mensajeDeError(error, 'No pudimos procesar la solicitud. Intentá de nuevo.'));
    } finally {
      setCargando(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Fondo oscuro con desenfoque*/}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60"/>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Contenedor principal del modal */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className={`${claseTarjeta} w-full max-w-md transform overflow-hidden p-6 sm:p-8 text-left align-middle transition-all relative text-[#131313]`}>
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="absolute top-4 right-4 text-neutral-500 hover:text-[#131313] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131313] rounded-full p-1 cursor-pointer"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-6">
                  <Dialog.Title as="h2" className="font-principal text-2xl uppercase mb-2">
                    Recuperar contraseña
                  </Dialog.Title>
                  <p className="text-sm text-neutral-600">
                    Ingresá tu correo y te enviamos un enlace para elegir una contraseña nueva.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div>
                    <label htmlFor="recuperar-correo" className={claseEtiqueta}>Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                      <input
                        id="recuperar-correo"
                        type="email"
                        autoComplete="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="tu@correo.com"
                        className={`${claseCampo()} pl-11`}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={cargando} className={claseBotonPrincipal}>
                    {cargando ? <><Loader2 className="animate-spin h-4 w-4" /> Enviando…</> : 'Enviar enlace'}
                  </button>

                  <p className="text-[10px] text-neutral-500 text-center leading-tight">
                    Este sitio está protegido por reCAPTCHA y se aplican la{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#131313]">Política de privacidad</a> y los{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#131313]">Términos de servicio</a> de Google.
                  </p>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};