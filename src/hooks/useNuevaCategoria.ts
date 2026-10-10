import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { crearCategoriaRequest } from '../api/categoria';
import { mensajeDeError } from '../api/errores';
import { useSubidasStore } from '../store/subidasStore';
import { isAxiosError } from 'axios';

export interface NuevaCategoriaForm {
  titulo: string;
  precioArs: number | string;
  precioUsd: number | string;
  descripcionCard: string;
  descripcionBreve: string;
  descripcionDetallada: string;
  beneficios: { titulo: string; descripcion: string; icono?: string }[];
  destacada: boolean;
}

export const useNuevaCategoria = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const iniciarSubida = useSubidasStore((s) => s.iniciar);

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

  // El video de muestra se sube en segundo plano (PanelSubidas); acá solo se guarda la clase.
  const [estadoSubida, setEstadoSubida] = useState<'IDLE' | 'CREANDO_CATEGORIA'>('IDLE');
  const [archivos, setArchivos] = useState({
    imagenTarjeta: null as File | string | null,
    imagenHero: null as File | string | null,
    videoMuestra: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: keyof typeof archivos) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivos({ ...archivos, [tipo]: e.target.files[0] });
    }
  };
 
  const handleSelectFromGallery = (url: string, tipo: 'imagenTarjeta' | 'imagenHero') => {
    setArchivos(prev => ({ ...prev, [tipo]: url }));
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
      formData.append('precioArs', String(Number(data.precioArs) || 0));
      formData.append('precioUsd', String(Number(data.precioUsd) || 0));
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
          formData.append('imagenHero', archivos.imagenHero) 
        }
      }

      if (archivos.videoMuestra) formData.append('necesitaVideoMuestra', 'true');

      const respuestaBackend = await crearCategoriaRequest(formData);
      const uploadUrl = respuestaBackend.uploadUrl;

      toast.success('¡Categoría base creada!', { id: loadingToast });
      // Sin esto la clase nueva no aparecía en la lista ni en la home hasta recargar.
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });

      if (archivos.videoMuestra && uploadUrl) {
        iniciarSubida({
          tipo: 'muestra',
          titulo: data.titulo,
          archivo: archivos.videoMuestra,
          endpoint: uploadUrl,
          alCompletar: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
        });
      }
      navigate('/admin/categorias');

    } catch (error) {
      toast.error(mensajeDeError(error, 'No se pudo crear la clase. Revisá tu conexión y volvé a intentar.'), { id: loadingToast, duration: 8000 });
      setEstadoSubida('IDLE');
      // 503: la clase se creó, pero Mux no aceptó el video de muestra (por ejemplo, límite del
      // plan). Se vuelve a la lista para no crearla dos veces al reintentar.
      if (isAxiosError(error) && error.response?.status === 503) {
        queryClient.invalidateQueries({ queryKey: ['categorias'] });
        navigate('/admin/categorias');
      }
    }
  };

  return { 
    register, 
    handleSubmit: handleSubmit(onSubmit), 
    errors, 
    isSubmitting, 
    estadoSubida, 
    archivos, 
    handleFileChange, 
    handleSelectFromGallery, 
    handleEliminarMultimedia, 
    watch, 
    navigate, 
    beneficiosFields, 
    appendBeneficio, 
    removeBeneficio, 
    control 
  };
};