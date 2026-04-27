import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as UpChunk from '@mux/upchunk';
import { crearCategoriaRequest } from '../api/categoria';

export interface NuevaCategoriaForm {
  titulo: string;
  precioArs: number;
  precioUsd: number;
  descripcionCard: string;
  descripcionBreve: string;
  descripcionDetallada: string;
  beneficios: { titulo: string; descripcion: string; icono?: string }[];
  destacada: boolean;
}

export const useNuevaCategoria = () => {
  const navigate = useNavigate();

  const {register, handleSubmit, control, watch, formState: { errors, isSubmitting }} = useForm<NuevaCategoriaForm>({
  defaultValues: { 
    beneficios: [],
    destacada: false  
  }
});
  const { fields: beneficiosFields, append: appendBeneficio, remove: removeBeneficio } = useFieldArray({
    control,
    name: "beneficios",
  });
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

  const handleEliminarMultimedia = (tipo: 'hero' | 'tarjeta' | 'video') => {
    if (tipo === 'hero') setArchivos(prev => ({ ...prev, imagenHero: null }));
    if (tipo === 'tarjeta') setArchivos(prev => ({ ...prev, imagenTarjeta: null }));
    if (tipo === 'video') setArchivos(prev => ({ ...prev, videoMuestra: null }));
  };

  const onSubmit = async (data: NuevaCategoriaForm) => {
    setEstadoSubida('CREANDO_CATEGORIA');
    const loadingToast = toast.loading('Guardando datos y fotos...');

    try {
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('precioArs', data.precioArs.toString());
      formData.append('precioUsd', data.precioUsd.toString());
      formData.append('destacada', String(data.destacada));
      if (data.descripcionCard) formData.append('descripcionCard', data.descripcionCard);
      if (data.descripcionBreve) formData.append('descripcionBreve', data.descripcionBreve);
      if (data.descripcionDetallada) formData.append('descripcionDetallada', data.descripcionDetallada);

      if (data.beneficios && data.beneficios.length > 0) {
        const beneficiosValidos = data.beneficios.filter(b => b.titulo.trim() !== '');
        if (beneficiosValidos.length > 0) {
          formData.append('beneficios', JSON.stringify(beneficiosValidos));
        }
      }

      if (archivos.imagenTarjeta) formData.append('imagenTarjeta', archivos.imagenTarjeta);
      if (archivos.imagenHero) formData.append('imagenHero', archivos.imagenHero);
      if (archivos.videoMuestra) formData.append('necesitaVideoMuestra', 'true');

      const respuestaBackend = await crearCategoriaRequest(formData);
      const uploadUrl = respuestaBackend.uploadUrl;

      toast.success('¡Categoría base creada!', { id: loadingToast });

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
  return { register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting, estadoSubida, progreso, archivos, handleFileChange, handleEliminarMultimedia, watch, navigate, beneficiosFields, appendBeneficio, removeBeneficio, control };
};