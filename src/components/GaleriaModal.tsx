import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { obtenerGaleriaRequest, type RespuestaGaleria } from '../api/galeria';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectImagen: (url: string) => void;
}

export const GaleriaModal = ({ isOpen, onClose, onSelectImagen }: Props) => {
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
    queryKey: ['galeria-cloudinary'],
    queryFn: ({ pageParam }) => obtenerGaleriaRequest(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: RespuestaGaleria) => lastPage.nextCursor || undefined,
    enabled: isOpen,
  });

  const imagenes = data?.pages.flatMap((page: RespuestaGaleria) => page.imagenes) || [];
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        
        {/* Fondo oscuro blureado */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            
            {/* Panel del Modal */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl h-[85vh] flex flex-col transform overflow-hidden rounded-3xl bg-[#131313] border border-gray-800 text-left align-middle shadow-2xl transition-all">
                
                {/* HEADER DEL MODAL */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d7f250]/10 flex items-center justify-center">
                      <ImageIcon className="text-[#d7f250] w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-xl font-bold text-white tracking-wide uppercase italic">
                        Biblioteca de Medios
                      </Dialog.Title>
                      <p className="text-xs text-gray-400">Selecciona una imagen de la nube</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors outline-none focus:ring-2 focus:ring-[#d7f250]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* CONTENIDO (GRILLA) */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="w-10 h-10 animate-spin text-[#d7f250]" />
                    </div>
                  ) : imagenes.length === 0 ? (
                    <div className="flex flex-col h-full items-center justify-center text-gray-500">
                      <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                      <p>No hay imágenes en tu galería de Cloudinary aún.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {imagenes.map((img) => (
                          <div 
                            key={img.publicId}
                            onClick={() => {
                              onSelectImagen(img.url);
                              onClose();
                            }}
                            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#d7f250] transition-all bg-gray-900"
                          >
                            <img 
                              src={img.url} 
                              alt="Miniatura Cloudinary" 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 bg-[#d7f250] text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all">
                                Elegir
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {hasNextPage && (
                        <div className="mt-8 flex justify-center pb-4">
                          <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="flex items-center gap-2 px-6 py-3 border border-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 outline-none focus:ring-2 focus:ring-[#d7f250]"
                          >
                            {isFetchingNextPage ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isFetchingNextPage ? 'Cargando...' : 'Cargar más imágenes'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};