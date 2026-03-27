import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tituloItem: string;
  estaEliminando: boolean;
}

export const ConfirmarEliminarModal = ({ isOpen, onClose, onConfirm, tituloItem, estaEliminando }: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={estaEliminando ? () => {} : onClose}>
        {/* Fondo oscuro desenfocado */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/93" />
        </Transition.Child>

        {/* Contenedor centralizado del Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#131313] border border-gray-800 p-6 text-left align-middle shadow-2xl transition-all font-sans">
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-500/10 rounded-full shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <Dialog.Title as="h3" className="text-xl font-extrabold text-white leading-tight">
                    Eliminar Disciplina
                  </Dialog.Title>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    ¿Estás segura de que deseas eliminar <strong>"{tituloItem}"</strong>? 
                    Esta acción borrará todas sus imágenes y videos asociados y no se puede deshacer.
                  </p>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" disabled={estaEliminando}  className="inline-flex justify-center rounded-xl border border-gray-700 bg-transparent px-4 py-2.5 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={estaEliminando}
                    className="inline-flex justify-center items-center gap-2 rounded-xl border border-transparent bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-70 cursor-pointer"
                    onClick={onConfirm}
                  >
                    {estaEliminando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sí, Eliminar'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};