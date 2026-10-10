import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { obtenerMiPerfilRequest, actualizarMiPerfilRequest } from '../api/usuario';
import { useAuthStore } from '../store/authStore';
import { mensajeDeError } from '../api/errores';

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
          fechaNacimiento: datosBD.fechaNacimiento || '',
          pais: datosBD.pais || '',
          provincia: datosBD.provincia || '',
          ciudad: datosBD.ciudad || '',
          direccion: datosBD.direccion || '',
          codigoPostal: datosBD.codigoPostal || '',
        });
      } catch {
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
      // Correo y país no se editan desde el perfil (los cambia soporte): solo se mandan estos campos.
      const { nombre, apellido, telefono, fechaNacimiento, provincia, ciudad, direccion, codigoPostal } = data;
      const datosAEnviar = { nombre, apellido, telefono, fechaNacimiento, provincia, ciudad, direccion, codigoPostal };
      const usuarioActualizado = await actualizarMiPerfilRequest(datosAEnviar);
      if (usuarioZustand) {
        setUsuario({ ...usuarioZustand, nombre: usuarioActualizado.nombre, apellido: usuarioActualizado.apellido });
      }
      toast.success('¡Perfil actualizado con éxito!', { id: loadingToast });
    } catch (error) {
      toast.error(mensajeDeError(error, 'Error al actualizar el perfil'), { id: loadingToast });
    }
  };

  return { register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting, cargandoDatos };
};