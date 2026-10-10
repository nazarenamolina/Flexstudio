import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { solicitarUrlSubidaRequest, eliminarVideoRequest } from '../api/videos';
import { mensajeDeError } from '../api/errores';
import { useCategoriasPublicas } from './useCategoriasPublicas';
import { CLAVE_VIDEOS_ADMIN } from './useAdminVideos';
import { useSubidasStore } from '../store/subidasStore';
import toast from 'react-hot-toast';

export interface NuevoVideoForm {
  titulo: string;
  descripcion?: string;
  idCategoria: string;
  orden: number | string;
}

export const useNuevoVideo = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NuevoVideoForm>();
  const queryClient = useQueryClient();
  const iniciarSubida = useSubidasStore((s) => s.iniciar);
  const { data: categorias = [], isLoading: cargandoCategorias } = useCategoriasPublicas();
  const [archivos, setArchivos] = useState({
    video: null as File | null,
    imagen: null as File | string | null,
  });

  // Solo el pedido de la URL: la subida en sí sigue en segundo plano (PanelSubidas).
  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'PIDIENDO_URL'>('IDLE');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'video' | 'imagen') => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos({ ...archivos, [tipo]: e.target.files[0] });
    }
  };

  const handleSelectFromGallery = (url: string) => {
    setArchivos({ ...archivos, imagen: url });
  };

  const quitarVideo = () => setArchivos((prev) => ({ ...prev, video: null }));

  const handleEliminarMiniatura = () => {
    setArchivos({ ...archivos, imagen: null });
  };

  const refrescarListas = () => {
    queryClient.invalidateQueries({ queryKey: CLAVE_VIDEOS_ADMIN });
    queryClient.invalidateQueries({ queryKey: ['categorias'] });
  };

  const onSubmit = async (data: NuevoVideoForm) => {
    if (!archivos.video) {
      toast.error('El video es obligatorio');
      return;
    }

    try {
      setEstadoSubida('PIDIENDO_URL');
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('idCategoria', data.idCategoria);
      formData.append('orden', data.orden.toString() || '1');
      if (data.descripcion) formData.append('descripcion', data.descripcion);
      if (archivos.imagen) {
        if (typeof archivos.imagen === 'string') {
          formData.append('imagenUrl', archivos.imagen);
        } else {
          formData.append('imagen', archivos.imagen);
        }
      }

      const { uploadUrl, videoId } = await solicitarUrlSubidaRequest(formData);
      // El back ya creó el video en PROCESANDO: la lista lo muestra al volver.
      refrescarListas();

      iniciarSubida({
        tipo: 'video',
        titulo: data.titulo,
        archivo: archivos.video,
        endpoint: uploadUrl,
        idVideo: videoId,
        alCompletar: refrescarListas,
        // Sin archivo, el video quedaría "Procesando" para siempre: se borra para que no estorbe.
        alFallar: async () => {
          try {
            await eliminarVideoRequest(videoId);
          } finally {
            refrescarListas();
          }
        },
      });
      toast.success('Subida iniciada: podés seguir usando el panel mientras se sube.');
      navigate('/admin/videos');
    } catch (error) {
      // Incluye el 503 de Mux cuando se alcanzó el límite de videos del plan.
      toast.error(mensajeDeError(error, 'No se pudo iniciar la subida. Revisá tu conexión y volvé a intentar.'), { duration: 8000 });
      setEstadoSubida('IDLE');
    }
  };

  return {
    register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting,
    categorias, cargandoCategorias, archivos, estadoSubida,
    handleFileChange, handleSelectFromGallery, handleEliminarMiniatura, quitarVideo, navigate
  };
};
