import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { registroRequest, type RegistroData } from '../api/auth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const registroSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  correo: z.string().email('Formato de correo inválido'),
  contrasena: z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
    'Debe tener al menos 6 caracteres, mayúscula, minúscula, número y símbolo'
  ),
  confirmarContrasena: z.string(),
  telefono: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  pais: z.string().optional(),
  provincia: z.string().optional(),
  ciudad: z.string().optional(),
  codigoPostal: z.string().optional(),
  direccion: z.string().optional(),
}).refine((data) => data.contrasena === data.confirmarContrasena, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarContrasena"],
});

export type RegistroFormValues = z.infer<typeof registroSchema>;

export const useRegistro = () => {
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const form = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
  });

  const onSubmit = async (data: RegistroFormValues) => {
    try {
      if (!executeRecaptcha) {toast.error('Verificando seguridad, por favor intenta de nuevo en unos segundos.');
        return;
      }
      const captchaToken = await executeRecaptcha('registro');
      console.log("¡Token de Google generado con éxito!:", captchaToken);
      const { confirmarContrasena, ...datosParaBackend } = data;
      await registroRequest({ ...datosParaBackend, captchaToken } as RegistroData);
      toast.success('¡Registro casi listo! Te enviamos un código a tu correo.');
      navigate('/verificar-email', { state: { correo: data.correo } });

    } catch (error: any) {
      console.error("🚨 ERROR COMPLETO DETECTADO:", error);
      const mensaje = error.response?.data?.message || 'Error al crear la cuenta';
      toast.error(typeof mensaje === 'string' ? mensaje : mensaje[0]);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};