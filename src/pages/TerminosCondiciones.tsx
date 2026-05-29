import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface SectionProps {titulo: string; children: React.ReactNode;}

export const TerminosCondiciones = () => {
  const ultimaActualizacion = "29 de mayo de 2026";
  const Section = ({ titulo, children }: SectionProps) => (
    <div className="mb-10">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-3 mb-3">
        {titulo}
      </h2>
      <div className="text-gray-700 leading-relaxed text-[15px] space-y-4 md:pl-5">
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
              Términos y Condiciones 
            </h1>
            <p className="text-gray-600 text-md">
              Por favor, lee detenidamente nuestras políticas antes de utilizar los servicios de Flex Studio.
            </p>
          </div>

          <div className="space-y-2">
            
            <Section titulo="1. Aceptación de los Términos">
              <p>
                Al acceder y utilizar la plataforma web de Flex Studio, aceptas cumplir con los presentes Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder a nuestros servicios ni adquirir nuestro contenido.
              </p>
            </Section>

            <Section titulo="2. Descripción del Servicio">
              <p>
                Flex Studio ofrece la comercialización de clases en video enfocadas en el entrenamiento físico y flexibilidad. Al adquirir una clase, el usuario obtiene un <strong>acceso vitalicio</strong> al contenido digital correspondiente, el cual podrá visualizar de forma ilimitada a través de su cuenta personal en nuestra plataforma.
              </p>
            </Section>
<Section titulo="3. Requisitos de Edad y Acceso">
              <p>
                La plataforma está diseñada para ser utilizada por adultos (mayores de 18 años). En el caso de menores de edad que deseen acceder a contenidos específicos (como las clases infantiles), el registro, la compra y el uso de la cuenta deben realizarse bajo la estricta supervisión y con la autorización expresa de sus padres o tutores legales, quienes asumen total responsabilidad.
              </p>
            </Section>

            <Section titulo="4. Veracidad de la Información">
              <p>
                Para registrar un perfil, adquirir cursos online o interactuar con la plataforma, te solicitaremos datos personales. El usuario garantiza que la dirección de correo electrónico proporcionada es activa y válida, y asume la responsabilidad de mantener actualizada su información.
              </p>
            </Section>

            <Section titulo="5. Responsabilidad Física y Salud">
              <p>
                Al participar en nuestras clases de entrenamiento y flexibilidad, el usuario reconoce y asume bajo su propia responsabilidad los riesgos inherentes a la actividad física. 
              </p>
              <p className="text-gray-800 font-medium bg-gray-50 p-4 rounded-lg border border-gray-100">
                Se recomienda encarecidamente contar con un apto médico o chequeo de salud vigente antes de iniciar cualquier programa. Flex Studio proporciona contenido instructivo, pero no se responsabiliza por lesiones, accidentes o problemas de salud que pudieran derivar de la ejecución de los ejercicios sin la supervisión física y presencial de un profesional.
              </p>
            </Section>

            <Section titulo="6. Cuentas de Usuario y Seguridad">
              <p>
                Para acceder a los contenidos, es obligatorio registrarse creando una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. 
              </p>
              <p className="text-gray-800 font-medium bg-gray-50 p-4 rounded-lg border border-gray-100">
                El acceso a los videos es estrictamente personal e intransferible. Compartir las credenciales de acceso con terceros resultará en la suspensión inmediata y definitiva de la cuenta sin derecho a reembolso.
              </p>
            </Section>

            <Section titulo="7. Pagos y Facturación">
              <p>
                Los pagos son procesados de forma segura a través de pasarelas de terceros (Mercado Pago para transacciones nacionales y PayPal para pagos internacionales en dólares). Flex Studio no almacena ni tiene acceso directo a los datos de tus tarjetas de crédito o débito en nuestros servidores.
              </p>
            </Section>

            <Section titulo="8. Política de Reembolsos">
              <p>
                Dada la naturaleza digital y de acceso inmediato de nuestro contenido (clases en video pregrabadas), <strong>no se ofrecen reembolsos ni devoluciones</strong> una vez que el pago ha sido procesado y el acceso al contenido ha sido habilitado en la cuenta del usuario.
              </p>
              <p>
                Solo se considerarán excepciones en casos de fallas técnicas comprobables y exclusivas de nuestra plataforma que impidan la visualización permanente del material adquirido.
              </p>
            </Section>

            <Section titulo="9. Propiedad Intelectual">
              <p>
                Todo el contenido disponible en la plataforma (videos, textos, logos, imágenes, y metodologías de entrenamiento) es propiedad exclusiva de Flex Studio. Queda estrictamente prohibida su descarga, copia, reproducción, distribución, venta o uso comercial no autorizado por ningún medio.
              </p>
            </Section>

            <Section titulo="10
            . Legislación Aplicable y Jurisdicción">
              <p>
                Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Para cualquier disputa legal que pudiera surgir, las partes se someten a la jurisdicción de los Tribunales Ordinarios de San Miguel de Tucumán, provincia de Tucumán, renunciando a cualquier otro fuero que pudiera corresponder.
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