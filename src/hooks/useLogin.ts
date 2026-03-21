import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { loginRequest } from '../api/auth';
import { useAuthStore } from '../store/authStore';
const loginSchema = z.object({
  correo: z.string().email({ message: 'Debe ser un correo electrónico válido' }),
  contrasena: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const navigate = useNavigate();
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorServidor(null);
    try {
      const respuesta = await loginRequest(data);
      setUsuario(respuesta.usuario);
      toast.success(respuesta.mensaje || '¡Bienvenida de vuelta!');
      navigate('/admin');
    } catch (error: any) {
      const mensajeError = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      setErrorServidor(mensajeError);
      toast.error('Acceso denegado');
    }
  };

  return {
    form,
    errorServidor,
    onSubmit: form.handleSubmit(onSubmit), 
  };
};