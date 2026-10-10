import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { registroRequest, type RegistroData } from '../api/auth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { mensajeDeError } from '../api/errores';
import { esquemaContrasena } from '../validaciones';

const registroSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  correo: z.string().email('Formato de correo inválido'),
  contrasena: esquemaContrasena,
  confirmarContrasena: z.string(),
  // Obligatorio y válido para el país elegido, como lo exige el back. Va en el esquema porque con
  // zodResolver las `rules` del <Controller> se ignoran (antes un teléfono inválido llegaba al back).
  telefono: z.string().optional()
    .refine((valor) => !!valor, 'El teléfono es obligatorio')
    .refine((valor) => !valor || isValidPhoneNumber(valor), 'Número no válido para el país elegido'),
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
      // confirmarContrasena es solo del formulario: no se manda (el back rechaza campos desconocidos).
      const datosParaBackend: RegistroData = {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        contrasena: data.contrasena,
        telefono: data.telefono,
        fechaNacimiento: data.fechaNacimiento,
        pais: data.pais,
        provincia: data.provincia,
        ciudad: data.ciudad,
        codigoPostal: data.codigoPostal,
        direccion: data.direccion,
        captchaToken,
      };
      await registroRequest(datosParaBackend);
      toast.success('¡Registro casi listo! Te enviamos un código a tu correo.');
      navigate('/verificar-email', { state: { correo: data.correo } });

    } catch (error) {
      toast.error(mensajeDeError(error, 'No pudimos crear la cuenta. Intentá de nuevo.'));
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};