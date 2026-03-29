import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { obtenerTodosLosVideosRequest, actualizarVideoRequest } from '../api/videos'; // Ajusta la ruta
import { obtenerCategoriasRequest, type Categoria } from '../api/categoria'; // Ajusta la ruta

// Definimos los campos que manejará React Hook Form
export interface EditarVideoForm {
  titulo: string;
  idCategoria: string;
  duracion: number | string;
  orden: number | string;
}

export const useEditarVideo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Inicializamos React Hook Form
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditarVideoForm>();

  const [cargando, setCargando] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  // Estados visuales para la miniatura
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [imagenActual, setImagenActual] = useState('');

  // 1. CARGA INICIAL
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!id) return;

        // Cargamos categorías para el <select>
        const resCat = await obtenerCategoriasRequest();
        setCategorias(Array.isArray(resCat) ? resCat : (resCat as any).categorias || []);

        // Cargamos el video actual
        const resVideos = await obtenerTodosLosVideosRequest();
        const videos = Array.isArray(resVideos) ? resVideos : (resVideos as any).data || [];
        const video = videos.find((v: any) => v.id === id);

        if (video) {
          // 🪄 Inyectamos los datos directamente en el formulario
          reset({
            titulo: video.titulo,
            idCategoria: video.categoria?.id || video.idCategoria || '',
            duracion: video.duracion || '',
            orden: video.orden || '',
          });
          setImagenActual(video.imagenUrl || '');
        } else {
          toast.error('Video no encontrado');
          navigate('/admin/videos');
        }
      } catch (error) {
        toast.error('Error al cargar la información');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id, navigate, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivoImagen(e.target.files[0]);
    }
  };

  // 2. FUNCIÓN DE ENVÍO
  const onSubmit = async (data: EditarVideoForm) => {
    if (!id) return;
    const loadingToast = toast.loading('Guardando cambios...');

    try {
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('idCategoria', data.idCategoria);
      formData.append('duracion', data.duracion.toString());
      formData.append('orden', data.orden.toString());

      if (archivoImagen) {
        formData.append('imagen', archivoImagen);
      }

      await actualizarVideoRequest(id, formData);

      toast.success('¡Video actualizado con éxito!', { id: loadingToast });
      navigate('/admin/videos');

    } catch (error) {
      toast.error('Error al guardar los cambios', { id: loadingToast });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    cargando,
    categorias,
    archivoImagen,
    imagenActual,
    handleImageChange,
    navigate
  };
};