import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { rutaDeRetorno } from '../router/rutaDeRetorno';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { loginRequest } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { mensajeDeError, datosDeError } from '../api/errores';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'; // 👈 Usamos la v3

const loginSchema = z.object({
  correo: z.string().email({ message: 'Debe ser un correo electrónico válido' }),
  contrasena: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  recordarme: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha(); 
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorServidor(null);
    if (!executeRecaptcha) {
      toast.error('Verificando seguridad, por favor espera un segundo...');
      return;
    }

    try {
      const captchaToken = await executeRecaptcha('login');
      const respuesta = await loginRequest({ ...data, captchaToken }); 
      setUsuario(respuesta.usuario);
      toast.success(respuesta.mensaje || '¡Bienvenida de vuelta!');
      // Vuelve a la página que pidió el login (carrito, una clase, el retorno del pago…). El panel
      // admin solo para administradores.
      const desde = rutaDeRetorno(location.state);
      const esAdmin = respuesta.usuario.rol === 'ADMIN';
      const destino = desde && (esAdmin || !desde.startsWith('/admin')) ? desde : esAdmin ? '/admin/categorias' : '/';
      navigate(destino, { replace: true });
    } catch (error) {
      // Contraseña correcta pero correo sin verificar: el back ya mandó un código nuevo si hacía falta.
      if (datosDeError(error)?.requiereVerificacion) {
        toast(mensajeDeError(error, 'Tenés que verificar tu correo.'));
        navigate('/verificar-email', { state: { correo: data.correo } });
        return;
      }
      setErrorServidor(mensajeDeError(error, 'Error al iniciar sesión. Verificá tus datos.'));
      toast.error('Acceso denegado');
    }
  };

  return {
    form,
    errorServidor,
    onSubmit: form.handleSubmit(onSubmit), 
  };
};