import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as UpChunk from '@mux/upchunk';
import { solicitarUrlSubidaRequest } from '../api/videos'; 
import { obtenerCategoriasRequest} from '../api/categoria';
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
  const { data: categorias = [], isLoading: cargandoCategorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const res = await obtenerCategoriasRequest();
      return Array.isArray(res) ? res : (res as any).categorias || [];
    }
  });
  const [archivos, setArchivos] = useState({
    video: null as File | null,
    imagen: null as File | string | null,
  });

  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'PIDIENDO_URL' | 'SUBIENDO' | 'COMPLETADO'>('IDLE');
  const [progreso, setProgreso] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'video' | 'imagen') => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos({ ...archivos, [tipo]: e.target.files[0] });
    }
  };

  const handleSelectFromGallery = (url: string) => {
    setArchivos({ ...archivos, imagen: url });
  };

  const handleEliminarMiniatura = () => {
    setArchivos({ ...archivos, imagen: null });
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

      const { uploadUrl } = await solicitarUrlSubidaRequest(formData);
      setEstadoSubida('SUBIENDO');
      
      const upload = UpChunk.createUpload({
        endpoint: uploadUrl,
        file: archivos.video,
        chunkSize: 5120,
      });

      upload.on('progress', (e) => setProgreso(Math.floor(e.detail)));
      upload.on('success', () => {
        setEstadoSubida('COMPLETADO');
        setProgreso(100);
        toast.success('¡Video subido exitosamente!');
        setTimeout(() => navigate('/admin/videos'), 2000);
      });

      upload.on('error', () => {
        toast.error('Error al subir el video a Mux. Reintentando...');
        setEstadoSubida('IDLE');
      });

      upload.on('offline', () => {
        toast.error('Se cortó el internet. La subida está pausada...', { duration: 5000 });
      });

      upload.on('online', () => {
        toast.success('Internet recuperado. Retomando subida...');
      });

    } catch (error) {
      toast.error('Error al contactar con el servidor');
      setEstadoSubida('IDLE');
    }
  };

  return {
    register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting, 
    categorias, cargandoCategorias, archivos, estadoSubida, progreso, 
    handleFileChange, handleSelectFromGallery, handleEliminarMiniatura, navigate
  };
};