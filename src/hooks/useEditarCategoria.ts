import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast';
import { obtenerCategoriaPorIdRequest, actualizarCategoriaRequest } from '../api/categoria';
import { mensajeDeError } from '../api/errores';
import { useSubidasStore } from '../store/subidasStore';
import { isAxiosError } from 'axios';

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
  const iniciarSubida = useSubidasStore((s) => s.iniciar);
  
  const {register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting }} = useForm<EditarCategoriaForm>({
    defaultValues: { beneficios: [], destacada: false } 
  });

  const { fields: beneficiosFields, append: appendBeneficio, remove: removeBeneficio } = useFieldArray({
    control,
    name: "beneficios",
  });

  // El video de muestra nuevo se sube en segundo plano (PanelSubidas); acá solo se guardan los cambios.
  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'ACTUALIZANDO_CATEGORIA'>('IDLE');
  
  // 👇 MODIFICACIÓN 1: Aceptamos string (URL de la Galería) además de File
  const [archivos, setArchivos] = useState({
    imagenTarjeta: null as File | string | null,
    imagenHero: null as File | string | null,
    videoMuestra: null as File | null,
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

    }
  }, [categoria, reset]);

  // Lo guardado, menos lo que se marcó para quitar (se aplica al guardar).
  const imagenesActuales = {
    imagenTarjeta: borrar.tarjeta ? '' : categoria?.imagenTarjeta || '',
    imagenHero: borrar.hero ? '' : categoria?.imagenHero || '',
    tieneVideo: !borrar.video && !!categoria?.playbackIdMuestra,
  };

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
      setBorrar(prev => ({ ...prev, hero: true }));
    }
    if (tipo === 'tarjeta') {
      setArchivos(prev => ({ ...prev, imagenTarjeta: null }));
      setBorrar(prev => ({ ...prev, tarjeta: true }));
    }
    if (tipo === 'video') {
      setArchivos(prev => ({ ...prev, videoMuestra: null }));
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
      formData.append('precioArs', String(Number(data.precioArs) || 0));
      formData.append('precioUsd', String(Number(data.precioUsd) || 0));
      formData.append('destacada', String(data.destacada));
      // Se mandan siempre, aunque estén vacíos: el back solo cambia los campos que recibe, así que
      // antes no había forma de borrar una descripción ni de quitar todos los beneficios.
      formData.append('descripcionCard', data.descripcionCard ?? '');
      formData.append('descripcionBreve', data.descripcionBreve ?? '');
      formData.append('descripcionDetallada', data.descripcionDetallada ?? '');
      const beneficiosValidos = (data.beneficios ?? []).filter(b => b.titulo.trim() !== '');
      formData.append('beneficios', JSON.stringify(beneficiosValidos));
      
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
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
      
      if (archivos.videoMuestra && uploadUrl) {
        // La muestra actual sigue visible hasta que Mux procese la nueva (el back la reemplaza).
        iniciarSubida({
          tipo: 'muestra',
          titulo: data.titulo,
          archivo: archivos.videoMuestra,
          endpoint: uploadUrl,
          alCompletar: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            queryClient.invalidateQueries({ queryKey: ['categoria', id] });
          },
        });
      }

      navigate('/admin/categorias');
    } catch (error) {
      toast.error(mensajeDeError(error, 'No se pudieron guardar los cambios.'), { id: loadingToast, duration: 8000 });
      setEstadoSubida('IDLE');
      // 503: los cambios se guardaron, pero Mux no aceptó el video de muestra nuevo.
      if (isAxiosError(error) && error.response?.status === 503) {
        queryClient.invalidateQueries({ queryKey: ['categorias'] });
        queryClient.invalidateQueries({ queryKey: ['categoria', id] });
        navigate('/admin/categorias');
      }
    }
  };

  return {
    register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting, cargandoDatos, 
    estadoSubida, archivos, imagenesActuales, handleFileChange, handleSelectFromGallery, 
    handleEliminarMultimedia, watch, navigate, beneficiosFields, appendBeneficio, removeBeneficio, control
  };
};