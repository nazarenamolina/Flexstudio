import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Shield, Database, Cookie, UserCheck, Lock, ListChecks, Share2, Clock, Scale, Users, RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useTituloPagina } from '../hooks/useTituloPagina';

const ULTIMA_ACTUALIZACION = '11 de octubre de 2026';
const CORREO = 'flexstudio89@gmail.com';

// Proveedores que reciben datos (ley 25.326: informar a quién se ceden).
const PROVEEDORES: { nombre: string; para: string; datos: string }[] = [
  { nombre: 'Mercado Pago', para: 'Pagos en pesos', datos: 'Datos de la compra, nombre, correo y documento' },
  { nombre: 'PayPal', para: 'Pagos en dólares', datos: 'Datos de la compra' },
  { nombre: 'Mux', para: 'Alojamiento y reproducción de los videos', datos: 'Dirección IP y datos técnicos de reproducción' },
  { nombre: 'Cloudinary', para: 'Alojamiento de imágenes', datos: 'Dirección IP al cargar las imágenes' },
  { nombre: 'Resend', para: 'Envío de correos', datos: 'Tu nombre y correo electrónico' },
  { nombre: 'Google reCAPTCHA', para: 'Protección contra bots en formularios', datos: 'Datos técnicos del navegador y la IP' },
  { nombre: 'Google Fonts', para: 'Tipografías del sitio', datos: 'Dirección IP' },
  { nombre: 'GeoJS', para: 'Detectar tu país para la moneda', datos: 'Dirección IP' },
  { nombre: 'Vercel', para: 'Alojamiento de la página web', datos: 'Dirección IP y datos técnicos' },
  { nombre: 'Hostinger', para: 'Servidor donde funciona la plataforma y se guarda la base de datos', datos: 'Todos los datos de la cuenta' },
];

const Section = ({ titulo, icono: Icono, children }: { titulo: string; icono: LucideIcon; children: ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-3 mb-3">
      <span className="p-2 bg-[#d7f250]/40 rounded-full shrink-0">
        <Icono size={20} className="text-gray-900" aria-hidden="true" />
      </span>
      {titulo}
    </h2>
    <div className="text-gray-700 leading-relaxed text-[15px] space-y-4 md:pl-12">
      {children}
    </div>
  </section>
);

const Destacado = ({ children }: { children: ReactNode }) => (
  <p className="text-gray-800 font-medium bg-gray-50 p-4 rounded-lg border border-gray-100">{children}</p>
);

const EnlaceCorreo = () => (
  <a href={`mailto:${CORREO}`} className="font-semibold text-gray-900 underline decoration-[#d7f250] decoration-2 underline-offset-2 hover:text-black">
    {CORREO}
  </a>
);

export const PoliticaPrivacidad = () => {
  useTituloPagina('Política de Privacidad', 'Cómo Flex Studio cuida tus datos: qué información usamos, con qué proveedores la compartimos, cookies y tus derechos según la Ley 25.326.');

  return (
    <div className="min-h-screen font-sans pt-[115px] lg:pt-[126px] pb-12 px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-4xl md:text-5xl font-principal font-bold uppercase text-gray-900 tracking-tight mb-4">
              Política de Privacidad
            </h1>
            <p className="text-gray-600 text-md">
              Tu privacidad es fundamental para nosotros. Acá te contamos qué datos usamos, para qué y con quién los compartimos.
            </p>
          </div>

          <div className="space-y-2">

            <Section icono={UserCheck} titulo="1. Responsable de los datos">
              <p>
                El responsable de la base de datos es <strong>Candelaria Imbaud Lima (Flex Studio)</strong>, con domicilio en Yerba Buena, Tucumán, Argentina. Para cualquier consulta sobre tus datos podés escribir a <EnlaceCorreo />.
              </p>
            </Section>

            <Section icono={Database} titulo="2. Información que recopilamos">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Al registrarte:</strong> nombre, apellido, correo electrónico, contraseña y teléfono. De forma opcional: fecha de nacimiento, país, provincia y ciudad.
                </li>
                <li>
                  <strong>Al comprar:</strong> documento de identidad, dirección y código postal, que se usan para el comprobante de compra y los exige la pasarela de pago.
                </li>
                <li>
                  <strong>Al usar la plataforma:</strong> las clases que compraste, el historial de pagos (estado y monto, nunca los datos de la tarjeta) y tu avance en cada video, para que puedas retomarlo donde lo dejaste.
                </li>
                <li>
                  <strong>Al escribirnos por el formulario de contacto:</strong> nombre, correo y el mensaje. Se nos envían por correo electrónico y no se guardan en la plataforma.
                </li>
                <li>
                  <strong>Tu país aproximado:</strong> se calcula a partir de tu dirección IP para mostrarte los precios en la moneda correcta: pesos o dólares.
                </li>
              </ul>
              <p>No recopilamos datos sensibles, como información sobre tu salud.</p>
            </Section>

            <Section icono={ListChecks} titulo="3. Uso de tu información">
              <p>Utilizamos tus datos exclusivamente para:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Crear y gestionar tu cuenta de alumna en la plataforma.</li>
                <li>Procesar tus compras, emitir el comprobante y habilitar el acceso a las clases que adquieras.</li>
                <li>Enviarte correos transaccionales: códigos de verificación, restablecimiento de contraseña y confirmaciones de compra.</li>
                <li>Responder tus consultas.</li>
                <li>Proteger la plataforma contra fraudes, spam y abusos.</li>
              </ul>
              <p>No vendemos ni alquilamos tus datos, y no los usamos para publicidad.</p>
            </Section>

            <Section icono={Share2} titulo="4. Con quién compartimos tus datos">
              <p>
                Para que la plataforma funcione trabajamos con estos proveedores. Cada uno recibe solo los datos necesarios para su tarea:
              </p>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                {PROVEEDORES.map((p) => (
                  <li key={p.nombre} className="px-4 py-3">
                    <p className="font-bold text-gray-900">{p.nombre}</p>
                    <p className="text-sm">{p.para}.</p>
                    <p className="text-sm text-gray-500">Recibe: {p.datos.charAt(0).toLowerCase() + p.datos.slice(1)}.</p>
                  </li>
                ))}
              </ul>
              <p>
                Algunos de estos proveedores procesan datos <strong>fuera de Argentina</strong>, por ejemplo en Brasil o en Estados Unidos. Al usar la plataforma aceptás esa transferencia internacional, que se hace solo con los fines descritos en esta política.
              </p>
              <p>Solo entregaremos datos a una autoridad cuando una ley o una orden judicial lo exija.</p>
            </Section>

            <Section icono={Lock} titulo="5. Pagos">
              <p>
                <strong>Flex Studio no almacena, procesa ni tiene acceso a los datos de tus tarjetas de crédito o débito.</strong>
              </p>
              <p>
                Los pagos los procesan Mercado Pago y PayPal en sus propias plataformas, de forma encriptada. Te recomendamos revisar sus políticas de privacidad al momento de comprar.
              </p>
            </Section>

            <Section icono={Cookie} titulo="6. Cookies y almacenamiento en tu navegador">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Cookie de sesión:</strong> es una sola cookie técnica, imprescindible para mantener tu sesión iniciada. No se puede leer desde el código de la página, dura 1 día (o 30 días si elegís "Mantenerme conectado") y se borra al cerrar la sesión.
                </li>
                <li>
                  <strong>Almacenamiento local:</strong> guardamos el contenido de tu carrito y los datos básicos de tu perfil (nombre y tipo de cuenta) para que el sitio cargue más rápido y no pierdas el carrito.
                </li>
                <li>
                  <strong>reCAPTCHA de Google:</strong> puede usar sus propias cookies para distinguir personas de bots.
                </li>
              </ul>
              <Destacado>No usamos cookies de publicidad ni de seguimiento.</Destacado>
            </Section>

            <Section icono={Shield} titulo="7. Seguridad">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Contraseña:</strong> se guarda encriptada y nadie en Flex Studio puede conocerla.</li>
                <li><strong>Conexión:</strong> toda la comunicación con la plataforma viaja cifrada (HTTPS).</li>
                <li><strong>Videos:</strong> se reproducen con enlaces firmados que vencen a las pocas horas.</li>
              </ul>
            </Section>

            <Section icono={Clock} titulo="8. Cuánto tiempo guardamos tus datos">
              <p>
                Guardamos los datos de tu cuenta mientras esté activa, para que mantengas el acceso a tus clases. Si pedís la baja, los eliminamos. La excepción son los registros de compras, que podemos conservar el tiempo que exijan las normas contables e impositivas.
              </p>
            </Section>

            <Section icono={Scale} titulo="9. Tus derechos (Ley 25.326)">
              <p>
                Podés pedir en cualquier momento el <strong>acceso, la rectificación, la actualización o la eliminación</strong> de tus datos escribiendo a <EnlaceCorreo />. Muchos datos también los podés corregir vos misma desde <Link to="/mi-perfil" className="font-semibold text-gray-900 underline decoration-[#d7f250] decoration-2 underline-offset-2 hover:text-black">Mi Perfil</Link>.
              </p>
              <p>
                Respondemos los pedidos de acceso dentro de los 10 días corridos y los de rectificación o eliminación dentro de los 5 días hábiles, como fija la ley.
              </p>
              <Destacado>
                La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
              </Destacado>
            </Section>

            <Section icono={Users} titulo="10. Menores de edad">
              <p>
                La plataforma está pensada para mayores de 18 años. Si una persona menor de edad usa la plataforma, por ejemplo para las clases infantiles, su madre, padre o tutor es quien debe crear la cuenta y dar sus datos.
              </p>
            </Section>

            <Section icono={RefreshCw} titulo="11. Cambios en esta política">
              <p>
                Si cambiamos esta política vamos a actualizar la fecha de abajo. Si el cambio es importante, también te avisaremos por correo.
              </p>
            </Section>

          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 font-medium tracking-wide">
            <span>© {new Date().getFullYear()} Flex Studio - Candelaria Imbaud Lima.</span>
            <span className="mt-2 sm:mt-0">Última actualización: {ULTIMA_ACTUALIZACION}</span>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
