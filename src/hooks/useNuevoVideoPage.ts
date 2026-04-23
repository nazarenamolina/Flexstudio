import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as UpChunk from '@mux/upchunk';
import { solicitarUrlSubidaRequest } from '../api/videos'; 
import { obtenerCategoriasRequest, type Categoria } from '../api/categoria';
import toast from 'react-hot-toast';

export interface NuevoVideoForm {
  titulo: string;
  descripcion?: string;  
  idCategoria: string;
  duracion: number | string;
  orden: number | string;
}

export const useNuevoVideo = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NuevoVideoForm>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [archivos, setArchivos] = useState({
    video: null as File | null,
    imagen: null as File | null,
  });
  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'PIDIENDO_URL' | 'SUBIENDO' | 'COMPLETADO'>('IDLE');
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await obtenerCategoriasRequest();
        setCategorias(Array.isArray(res) ? res : (res as any).categorias || []);
      } catch (error) {
        toast.error("Error al cargar categorías");
      }
    };
    cargarCategorias();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'video' | 'imagen') => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos({ ...archivos, [tipo]: e.target.files[0] });
    }
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
      formData.append('duracion', data.duracion.toString() || '0');
      formData.append('orden', data.orden.toString() || '1');
      formData.append('descripcion', data.descripcion || '');

      if (archivos.imagen) {
        formData.append('imagen', archivos.imagen);  
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
  return {register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting, categorias, archivos, estadoSubida, progreso, handleFileChange, navigate};
};