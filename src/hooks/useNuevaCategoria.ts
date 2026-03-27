import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as UpChunk from '@mux/upchunk';
import { crearCategoriaRequest } from '../api/categoria'; // Ajusta la ruta si es necesario

// 1. Definimos qué campos de texto tendrá el formulario
export interface NuevaCategoriaForm {
  titulo: string;
  precio: number;
  descripcionCard: string;
  descripcionBreve: string;
  descripcionDetallada: string;
}

export const useNuevaCategoria = () => {
  const navigate = useNavigate();
  
  // 2. Inicializamos React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<NuevaCategoriaForm>();

  // 3. Estados para archivos y progreso (esto sigue igual porque es para la UI)
  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'CREANDO_CATEGORIA' | 'SUBIENDO_VIDEO' | 'COMPLETADO'>('IDLE');
  const [progreso, setProgreso] = useState(0);
  const [archivos, setArchivos] = useState({
    imagenTarjeta: null as File | null,
    imagenHero: null as File | null,
    videoMuestra: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: keyof typeof archivos) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos({ ...archivos, [tipo]: e.target.files[0] });
    }
  };

  // 4. La función maestra que se ejecuta SOLO si todo es válido
  const onSubmit = async (data: NuevaCategoriaForm) => {
    setEstadoSubida('CREANDO_CATEGORIA');
    const loadingToast = toast.loading('Guardando datos y fotos...');

    try {
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('precio', data.precio.toString());
      if (data.descripcionCard) formData.append('descripcionCard', data.descripcionCard);
      if (data.descripcionBreve) formData.append('descripcionBreve', data.descripcionBreve);
      if (data.descripcionDetallada) formData.append('descripcionDetallada', data.descripcionDetallada);
      
      if (archivos.imagenTarjeta) formData.append('imagenTarjeta', archivos.imagenTarjeta);
      if (archivos.imagenHero) formData.append('imagenHero', archivos.imagenHero);
      if (archivos.videoMuestra) formData.append('necesitaVideoMuestra', 'true');

      const respuestaBackend = await crearCategoriaRequest(formData);
      const uploadUrl = respuestaBackend.uploadUrl;

      toast.success('¡Categoría base creada!', { id: loadingToast });

      // Fase de Upchunk
      if (archivos.videoMuestra && uploadUrl) {
        setEstadoSubida('SUBIENDO_VIDEO');
        const upload = UpChunk.createUpload({
          endpoint: uploadUrl,
          file: archivos.videoMuestra,
          chunkSize: 5120, 
        });

        upload.on('progress', (e) => setProgreso(Math.floor(e.detail)));
        upload.on('success', () => {
          setEstadoSubida('COMPLETADO');
          setProgreso(100);
          toast.success('¡Video de muestra subido exitosamente!');
          setTimeout(() => navigate('/admin/categorias'), 2000);
        });
        upload.on('error', () => {
          toast.error('Error al subir el video a Mux. La categoría se creó sin video.');
          setEstadoSubida('IDLE');
          navigate('/admin/categorias');
        });
        return; 
      }

      navigate('/admin/categorias');

    } catch (error: any) {
      const mensaje = error.response?.data?.message || 'Error al contactar con el servidor';
      toast.error(Array.isArray(mensaje) ? mensaje[0] : mensaje, { id: loadingToast });
      setEstadoSubida('IDLE');
    }
  };

  // 5. Devolvemos TODO lo que la UI necesita para pintarse
  return {
    register,
    handleSubmit: handleSubmit(onSubmit), // Envolvemos nuestra función con la de RHF
    errors,
    isSubmitting,
    estadoSubida,
    progreso,
    archivos,
    handleFileChange,
    navigate
  };
};