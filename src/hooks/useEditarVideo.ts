import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { obtenerVideoPorIdRequest, actualizarVideoRequest } from '../api/videos';
import { obtenerCategoriasRequest} from '../api/categoria';

export interface EditarVideoForm {
  titulo: string;
  descripcion?: string;
  idCategoria: string;
  duracion: number | string;
  orden: number | string;
}

export const useEditarVideo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditarVideoForm>();
  const [archivoImagen, setArchivoImagen] = useState<File | string | null>(null);
  const [imagenActual, setImagenActual] = useState('');
  const { data: categorias = [], isLoading: cargandoCat } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const res = await obtenerCategoriasRequest();
      return Array.isArray(res) ? res : (res as any).categorias || [];
    }
  });
  const { data: video, isLoading: cargandoVideo } = useQuery({
    queryKey: ['video', id],
    queryFn: () => obtenerVideoPorIdRequest(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
  useEffect(() => {
    if (video) {
      reset({
        titulo: video.titulo || '',
        descripcion: video.descripcion || '',
        idCategoria: video.categoria?.id || video.idCategoria || '',
        duracion: video.duracion || '0',
        orden: video.orden || '1',
      });
      setImagenActual(video.imagenUrl || '');
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

  const onSubmit = async (data: EditarVideoForm) => {
    if (!id) return;
    const loadingToast = toast.loading('Guardando cambios...');

    try {
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('idCategoria', data.idCategoria);
      formData.append('duracion', data.duracion.toString());
      formData.append('orden', data.orden.toString());
      if (data.descripcion) formData.append('descripcion', data.descripcion);
      if (archivoImagen) {
        if (typeof archivoImagen === 'string') {
          formData.append('imagenUrl', archivoImagen);
        } else {
          formData.append('imagen', archivoImagen);
        }
      }

      await actualizarVideoRequest(id, formData);
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['video', id] });
      toast.success('¡Video actualizado con éxito!', { id: loadingToast });
      navigate('/admin/videos');
    } catch (error) {
      toast.error('Error al guardar los cambios', { id: loadingToast });
    }
  };

  return {register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting,cargando: cargandoCat || cargandoVideo, categorias, archivoImagen, imagenActual, 
    handleImageChange, handleSelectFromGallery, handleEliminarMiniaturaNueva, navigate};};