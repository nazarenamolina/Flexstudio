import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { solicitarRecuperacionRequest } from '../api/auth';

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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Fondo oscuro con desenfoque (Backdrop) */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80"/>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#111111] border border-neutral-800 p-6 sm:p-8 text-left align-middle shadow-2xl transition-all relative">
                
                {/* Botón de cerrar (X) */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#d7f250] rounded-full p-1"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-6">
                  <Dialog.Title as="h2" className="text-2xl font-black text-white uppercase tracking-wide mb-2">
                    Recuperar Contraseña
                  </Dialog.Title>
                  <p className="text-sm text-neutral-400">
                    Ingresa tu correo y te enviaremos un enlace mágico para restablecer tu acceso.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                      EMAIL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-neutral-500" />
                      </div>
                      <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-neutral-800 focus:border-[#d7f250] focus:ring-[#d7f250]/20 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#111111] font-black text-sm py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111111] focus:ring-[#d7f250]"
                  >
                    {cargando ? (
                      <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> ENVIANDO...</>
                    ) : (
                      'ENVIAR ENLACE'
                    )}
                  </button>

                  <p className="text-[10px] text-neutral-500 text-center leading-tight">
                    Este sitio está protegido por reCAPTCHA y se aplican la{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#d7f250] underline focus:outline-none focus:ring-1 focus:ring-[#d7f250]">Política de privacidad</a> y los{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#d7f250] underline focus:outline-none focus:ring-1 focus:ring-[#d7f250]">Términos de servicio</a> de Google.
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