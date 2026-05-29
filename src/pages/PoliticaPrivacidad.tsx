import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Database, Cookie, Mail, UserCheck, Lock } from 'lucide-react';

interface SectionProps {
  titulo: string;
  icono: any;
  children: React.ReactNode;
}

export const PoliticaPrivacidad = () => {
  const ultimaActualizacion = "29 de mayo de 2026";

  const Section = ({ titulo, icono: Icono, children }: SectionProps) => (
    <div className="mb-10">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-3 mb-3">
        <div className="p-2 bg-[#d7f250]/40 rounded-full">
          <Icono size={20} className="text-gray-900" />
        </div>
        {titulo}
      </h2>
      <div className="text-gray-700 leading-relaxed text-[15px] space-y-4 md:pl-12">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <Link 
          to="/" 
          className="group inline-flex items-center text-gray-500 text-xs font-bold tracking-widest hover:text-black transition-colors uppercase mb-8"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 md:p-14 shadow-sm"
        >
          {/* Encabezado */}
          <div className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Política de Privacidad 
            </h1>
            <p className="text-gray-600 text-md">
              Tu privacidad es fundamental para nosotros. Conoce cómo cuidamos y protegemos tu información en Flex Studio.
            </p>
          </div>

          <div className="space-y-2">
            
            <Section icono={Database} titulo="1. Información que recopilamos">
              <p>
                Para brindarte acceso a nuestra plataforma, recopilamos información personal que nos proporcionas directamente al registrarte, como tu <strong>nombre, apellido y dirección de correo electrónico</strong>. No recopilamos datos sensibles sobre tu salud u origen.
              </p>
            </Section>

            <Section icono={UserCheck} titulo="2. Uso de tu información">
              <p>
                Utilizamos tus datos exclusivamente para:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Crear y gestionar tu cuenta de alumna en la plataforma.</li>
                <li>Habilitar el acceso vitalicio a los cursos y clases que adquieras.</li>
                <li>Enviarte correos electrónicos transaccionales (como códigos de verificación, restablecimiento de contraseñas y confirmaciones de compra).</li>
              </ul>
            </Section>

            <Section icono={Lock} titulo="3. Protección de Pagos">
              <p>
                <strong>Flex Studio no almacena, procesa ni tiene acceso a los datos de tus tarjetas de crédito o débito.</strong> 
              </p>
              <p>
                Todas las transacciones son procesadas de manera externa y encriptada por pasarelas de pago de nivel bancario (Mercado Pago y PayPal). Te recomendamos revisar las políticas de privacidad de estas plataformas al momento de realizar tu compra.
              </p>
            </Section>

            <Section icono={Cookie} titulo="4. Uso de Cookies y Sesiones">
              <p>
                Nuestra plataforma utiliza "cookies" técnicas estrictamente necesarias para mantener tu sesión activa y segura. 
              </p>
              <p className="text-gray-800 font-medium bg-gray-50 p-4 rounded-lg border border-gray-100">
                Al usar la opción "Mantenerme conectado", guardamos un token de acceso temporal en tu navegador para que no tengas que iniciar sesión constantemente. No utilizamos cookies para rastreo publicitario invasivo ni vendemos tu historial de navegación a terceros.
              </p>
            </Section>

            <Section icono={Shield} titulo="5. Seguridad y Terceros">
              <p>
                Tu contraseña se almacena de forma encriptada  utilizando estándares de seguridad modernos. Ningún administrador de Flex Studio puede conocer tu contraseña real.
              </p>
              <p>
                Para proteger nuestra plataforma contra spam y abusos, implementamos Google reCAPTCHA v3. El uso de este sistema está sujeto a la Política de Privacidad y Términos de Servicio de Google.
              </p>
            </Section>

            <Section icono={Mail} titulo="6. Tus Derechos (Ley 25.326)">
              <p>
                En cumplimiento con la Ley de Protección de Datos Personales N° 25.326 de la República Argentina, tienes derecho a solicitar el acceso, actualización, rectificación o eliminación de tu información personal de nuestra base de datos en cualquier momento, contactándonos a través de nuestros canales oficiales.
              </p>
            </Section>

          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 font-medium tracking-wide">
            <span>© {new Date().getFullYear()} Flex Studio - Candelaria Imbaud Lima.</span>
            <span className="mt-2 sm:mt-0">Última actualización: {ultimaActualizacion}</span>
          </div>

        </motion.div>
      </div>
    </div>
  );
};