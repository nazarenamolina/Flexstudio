import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast';
import * as UpChunk from '@mux/upchunk';
import { obtenerCategoriaPorIdRequest, actualizarCategoriaRequest } from '../api/categoria';

export interface EditarCategoriaForm {
  titulo: string;
  precioArs: number | string;
  precioUsd: number | string;
  descripcionCard: string;
  descripcionBreve: string;
  descripcionDetallada: string;
  beneficios: { titulo: string; descripcion: string; icono?: string }[];
  destacada: boolean;
}

export const useEditarCategoria = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient(); 
  
  const {register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting }} = useForm<EditarCategoriaForm>({
    defaultValues: { beneficios: [], destacada: false } 
  });

  const { fields: beneficiosFields, append: appendBeneficio, remove: removeBeneficio } = useFieldArray({
    control,
    name: "beneficios",
  });

  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'ACTUALIZANDO_CATEGORIA' | 'SUBIENDO_VIDEO' | 'COMPLETADO'>('IDLE');
  const [progreso, setProgreso] = useState(0);
  
  // 👇 MODIFICACIÓN 1: Aceptamos string (URL de la Galería) además de File
  const [archivos, setArchivos] = useState({
    imagenTarjeta: null as File | string | null,
    imagenHero: null as File | string | null,
    videoMuestra: null as File | null,
  });

  const [imagenesActuales, setImagenesActuales] = useState({
    imagenTarjeta: '',
    imagenHero: '',
    tieneVideo: false,
  });
  const [borrar, setBorrar] = useState({ hero: false, tarjeta: false, video: false });

  const { data: categoria, isLoading: cargandoDatos } = useQuery({
    queryKey: ['categoria', id],
    queryFn: () => obtenerCategoriaPorIdRequest(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, 
  });

  useEffect(() => {
    if (categoria) {
      reset({
        titulo: categoria.titulo || '',
        precioArs: categoria.precioArs || '',
        precioUsd: categoria.precioUsd || '',
        descripcionCard: categoria.descripcionCard || '',
        descripcionBreve: categoria.descripcionBreve || '',
        descripcionDetallada: categoria.descripcionDetallada || '',
        beneficios: categoria.beneficios || [],
        destacada: categoria.destacada || false, 
      });

      setImagenesActuales({
        imagenTarjeta: categoria.imagenTarjeta || '',
        imagenHero: categoria.imagenHero || '',
        tieneVideo: !!categoria.playbackIdMuestra,
      });
    }
  }, [categoria, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: keyof typeof archivos) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos({ ...archivos, [tipo]: e.target.files[0] });
      if (tipo === 'imagenHero') setBorrar(prev => ({ ...prev, hero: false }));
      if (tipo === 'imagenTarjeta') setBorrar(prev => ({ ...prev, tarjeta: false }));
      if (tipo === 'videoMuestra') setBorrar(prev => ({ ...prev, video: false }));
    }
  };

  // 👇 MODIFICACIÓN 2: Función para seleccionar desde Galería
  const handleSelectFromGallery = (url: string, tipo: 'imagenTarjeta' | 'imagenHero') => {
    setArchivos(prev => ({ ...prev, [tipo]: url }));
    if (tipo === 'imagenHero') setBorrar(prev => ({ ...prev, hero: false }));
    if (tipo === 'imagenTarjeta') setBorrar(prev => ({ ...prev, tarjeta: false }));
  };

  const handleEliminarMultimedia = (tipo: 'hero' | 'tarjeta' | 'video') => {
    if (tipo === 'hero') {
      setArchivos(prev => ({ ...prev, imagenHero: null }));
      setImagenesActuales(prev => ({ ...prev, imagenHero: '' }));
      setBorrar(prev => ({ ...prev, hero: true }));
    }
    if (tipo === 'tarjeta') {
      setArchivos(prev => ({ ...prev, imagenTarjeta: null }));
      setImagenesActuales(prev => ({ ...prev, imagenTarjeta: '' }));
      setBorrar(prev => ({ ...prev, tarjeta: true }));
    }
    if (tipo === 'video') {
      setArchivos(prev => ({ ...prev, videoMuestra: null }));
      setImagenesActuales(prev => ({ ...prev, tieneVideo: false }));
      setBorrar(prev => ({ ...prev, video: true }));
    }
  };

  const onSubmit = async (data: EditarCategoriaForm) => {
    if (!id) return;
    setEstadoSubida('ACTUALIZANDO_CATEGORIA');
    const loadingToast = toast.loading('Guardando cambios...');
    
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
        if (beneficiosValidos.length > 0) formData.append('beneficios', JSON.stringify(beneficiosValidos));
      }
      
      // 👇 MODIFICACIÓN 3: Diferenciar File local de string URL
      if (archivos.imagenTarjeta) {
        if (typeof archivos.imagenTarjeta === 'string') {
          formData.append('imagenTarjetaUrl', archivos.imagenTarjeta);
        } else {
          formData.append('imagenTarjeta', archivos.imagenTarjeta);
        }
      }
      
      if (archivos.imagenHero) {
        if (typeof archivos.imagenHero === 'string') {
          formData.append('imagenHeroUrl', archivos.imagenHero);
        } else {
          formData.append('imagenHero', archivos.imagenHero);
        }
      }

      if (borrar.hero && !archivos.imagenHero) formData.append('eliminarImagenHero', 'true');
      if (borrar.tarjeta && !archivos.imagenTarjeta) formData.append('eliminarImagenTarjeta', 'true');
      
      if (archivos.videoMuestra) {
        formData.append('necesitaVideoMuestra', 'true');
      } else if (borrar.video) {
        formData.append('necesitaVideoMuestra', 'false');
      }
      
      const respuestaBackend = await actualizarCategoriaRequest(id, formData);
      const uploadUrl = respuestaBackend.uploadUrl;
      
      toast.success('¡Textos y fotos actualizados!', { id: loadingToast });
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['categoria', id] });
      
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
          toast.success('¡Video actualizado!');
          setTimeout(() => navigate('/admin/categorias'), 2000);
        });
        upload.on('error', () => {
          toast.error('Error al subir el nuevo video. Lo demás sí se guardó.');
          navigate('/admin/categorias');
        });
        return;
      }

      navigate('/admin/categorias');
    } catch (error: any) {
      const mensaje = error.response?.data?.message || 'Error al actualizar';
      toast.error(Array.isArray(mensaje) ? mensaje[0] : mensaje, { id: loadingToast });
      setEstadoSubida('IDLE');
    }
  };

  return {
    register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting, cargandoDatos, 
    estadoSubida, progreso, archivos, imagenesActuales, handleFileChange, handleSelectFromGallery, 
    handleEliminarMultimedia, watch, navigate, beneficiosFields, appendBeneficio, removeBeneficio, control
  };
};