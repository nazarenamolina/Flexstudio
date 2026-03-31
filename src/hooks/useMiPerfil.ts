import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { obtenerMiPerfilRequest, actualizarMiPerfilRequest } from '../api/usuario';
import { useAuthStore } from '../store/authStore';

export interface PerfilForm {
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  fechaNacimiento?: string;
  pais?: string;
  provincia?: string;
  ciudad?: string;
  direccion?: string;
  codigoPostal?: string;
}

export const useMiPerfil = () => {
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const usuarioZustand = useAuthStore((state) => state.usuario);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PerfilForm>();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datosBD = await obtenerMiPerfilRequest();
        reset({
          nombre: datosBD.nombre || '',
          apellido: datosBD.apellido || '',
          correo: datosBD.correo || '', 
          telefono: datosBD.telefono || '',
          fechaNacimiento: datosBD.fechaNacimiento ? String(datosBD.fechaNacimiento).split('T')[0] : '',
          pais: datosBD.pais || '',
          provincia: datosBD.provincia || '',
          ciudad: datosBD.ciudad || '',
          direccion: datosBD.direccion || '',
          codigoPostal: datosBD.codigoPostal || '',
        });
      } catch (error) {
        toast.error('No se pudieron cargar los datos de tu perfil.');
      } finally {
        setCargandoDatos(false);
      }
    };
    cargarPerfil();
  }, [reset]);

  const onSubmit = async (data: PerfilForm) => {
    const loadingToast = toast.loading('Guardando cambios...');
    try {
      const { correo,pais, ...datosAEnviar } = data;
      const usuarioActualizado = await actualizarMiPerfilRequest(datosAEnviar);
      if (usuarioZustand) {
        setUsuario({ ...usuarioZustand, nombre: usuarioActualizado.nombre, apellido: usuarioActualizado.apellido });
      }
      toast.success('¡Perfil actualizado con éxito!', { id: loadingToast });
    } catch (error: any) {
      const mensaje = error.response?.data?.message || 'Error al actualizar el perfil';
      toast.error(Array.isArray(mensaje) ? mensaje[0] : mensaje, { id: loadingToast });
    }
  };

  return { register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting, cargandoDatos };
};