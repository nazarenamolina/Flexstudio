import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { obtenerVideoPorIdRequest, actualizarVideoRequest, solicitarReemplazoArchivoRequest } from '../api/videos';
import { useSubidasStore } from '../store/subidasStore';
import { mensajeDeError } from '../api/errores';
import { useCategoriasPublicas } from './useCategoriasPublicas';
import { CLAVE_VIDEOS_ADMIN } from './useAdminVideos';

export interface EditarVideoForm {
  titulo: string;
  descripcion?: string;
  idCategoria: string;
  orden: number | string;
}

export const useEditarVideo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditarVideoForm>();
  const [archivoImagen, setArchivoImagen] = useState<File | string | null>(null);
  // Archivo de video nuevo: reemplaza al actual cuando Mux lo termina de procesar.
  const [archivoVideo, setArchivoVideo] = useState<File | null>(null);
  const iniciarSubida = useSubidasStore((s) => s.iniciar);
  const { data: categorias = [], isLoading: cargandoCat } = useCategoriasPublicas();
  const { data: video, isLoading: cargandoVideo } = useQuery({
    queryKey: ['video', id],
    queryFn: () => obtenerVideoPorIdRequest(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
  const imagenActual = video?.imagenUrl || '';
  useEffect(() => {
    if (video) {
      reset({
        titulo: video.titulo || '',
        descripcion: video.descripcion || '',
        idCategoria: video.categoria?.id || video.idCategoria || '',
        orden: video.orden || '1',
      });
    }
  }, [video, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivoImagen(e.target.files[0]);
    }
  };
  const handleSelectFromGallery = (url: string) => {
    setArchivoImagen(url);
  };

  const handleEliminarMiniaturaNueva = () => {
    setArchivoImagen(null);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setArchivoVideo(e.target.files[0]);
  };
  const quitarArchivoVideo = () => setArchivoVideo(null);

  const refrescarListas = () => {
    queryClient.invalidateQueries({ queryKey: CLAVE_VIDEOS_ADMIN });
    // Si cambió de clase, cambian la cantidad de videos y la duración de las dos.
    queryClient.invalidateQueries({ queryKey: ['categorias'] });
    queryClient.invalidateQueries({ queryKey: ['video', id] });
  };

  const onSubmit = async (data: EditarVideoForm) => {
    if (!id) return;
    const loadingToast = toast.loading('Guardando cambios...');

    try {
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('idCategoria', data.idCategoria);
      formData.append('orden', data.orden.toString());
      // Siempre, aunque esté vacía: si no, no había forma de borrar la descripción.
      formData.append('descripcion', data.descripcion ?? '');
      if (archivoImagen) {
        if (typeof archivoImagen === 'string') {
          formData.append('imagenUrl', archivoImagen);
        } else {
          formData.append('imagen', archivoImagen);
        }
      }

      await actualizarVideoRequest(id, formData);
      refrescarListas();
    } catch (error) {
      toast.error(mensajeDeError(error, 'No se pudieron guardar los cambios.'), { id: loadingToast });
      return;
    }

    if (archivoVideo) {
      try {
        const { uploadUrl } = await solicitarReemplazoArchivoRequest(id);
        iniciarSubida({
          tipo: 'reemplazo',
          titulo: data.titulo,
          archivo: archivoVideo,
          endpoint: uploadUrl,
          idVideo: id,
          alCompletar: refrescarListas,
        });
        toast.success('Cambios guardados. El archivo nuevo se sube en segundo plano; las alumnas ven el actual hasta que esté listo.', { id: loadingToast, duration: 6000 });
      } catch (error) {
        // Por ejemplo, el límite de videos del plan de Mux: el resto de los cambios ya se guardó.
        toast.error(`Los cambios se guardaron, pero el archivo no se pudo reemplazar. ${mensajeDeError(error, 'Volvé a intentarlo.')}`, { id: loadingToast, duration: 9000 });
      }
    } else {
      toast.success('¡Video actualizado con éxito!', { id: loadingToast });
    }
    navigate('/admin/videos');
  };

  return {register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting,cargando: cargandoCat || cargandoVideo, categorias, archivoImagen, imagenActual, 
    handleImageChange, handleSelectFromGallery, handleEliminarMiniaturaNueva, navigate,
    archivoVideo, handleVideoChange, quitarArchivoVideo, estado: video?.estado};};