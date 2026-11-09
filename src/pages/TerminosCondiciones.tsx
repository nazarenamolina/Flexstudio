import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { RUTA_ARREPENTIMIENTO, RUTA_ATENCION, RUTA_BAJA } from '../legal';

// Si cambia, actualizar también VERSION_TERMINOS en el back (compra/terminos.ts).
// La numeración de las cláusulas se cita en otros lugares (por ejemplo, la 8 en los correos de
// rechazo de motivosRechazo.ts y la 2 bis en el checkout): no renumerar sin revisarlos.
const ultimaActualizacion = "9 de noviembre de 2026";

const Section = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-3 mb-3">
      {titulo}
    </h2>
    <div className="text-gray-700 leading-relaxed text-[15px] space-y-4 md:pl-5">
      {children}
    </div>
  </section>
);

const claseDestacado = 'text-gray-800 font-medium bg-gray-50 p-4 rounded-lg border border-gray-100';

export const TerminosCondiciones = () => {
  useTituloPagina('Términos y Condiciones', 'Términos y condiciones de Flex Studio: compra de clases online de flexibilidad, pagos con Mercado Pago y PayPal, derecho de arrepentimiento y uso de la plataforma.');

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
              Términos y Condiciones
            </h1>
            <p className="text-gray-600 text-md">
              Por favor, lee detenidamente nuestras políticas antes de utilizar los servicios de Flex Studio.
            </p>
          </div>

          <div className="space-y-2">

            <Section titulo="1. Aceptación de los Términos">
              <p>
                Estos Términos y Condiciones regulan el uso de la plataforma web de Flex Studio y la compra de sus clases. Los aceptás al crear tu cuenta y, de forma expresa, al confirmar cada compra. Si no estás de acuerdo con alguna parte, no podrás adquirir nuestro contenido.
              </p>
              <p>
                El servicio lo presta <strong>Candelaria Imbaud Lima (Flex Studio)</strong>, con domicilio en Yerba Buena, Tucumán, Argentina. Podés contactarnos desde <Link to={RUTA_ATENCION} className="font-semibold underline underline-offset-2">Atención al consumidor</Link>.
              </p>
            </Section>

            <Section titulo="2. Descripción del Servicio">
              <p>
                Flex Studio ofrece la comercialización de clases en video enfocadas en el entrenamiento físico y flexibilidad, organizadas en categorías y meses. Al adquirir un mes, el usuario obtiene <strong>acceso</strong> al contenido digital correspondiente, que podrá ver las veces que quiera desde su cuenta personal durante el plazo indicado en el punto 2 bis.
              </p>
              <p>
                <strong>Actualización del contenido.</strong> Podemos mejorar, corregir o reemplazar videos de un mes por versiones equivalentes o mejores. Mientras tengas acceso a un mes comprado, no vamos a reducir el contenido que tenía al momento de tu compra.
              </p>
            </Section>

            <Section titulo="2 bis. Duración del acceso y compra por meses">
              <p>
                <strong>Compra por meses.</strong> Cada mes tiene su propio precio y se compra por separado, de a uno por vez.
              </p>
              <p>
                <strong>Orden.</strong> El primer mes se puede comprar directamente. Cada mes siguiente se habilita cuando terminás todos los videos disponibles del mes anterior, aunque el acceso a ese mes ya haya vencido. Si venció sin que lo terminaras, primero tenés que volver a comprarlo y terminarlo.
              </p>
              <p>
                <strong>Plazo de acceso.</strong> El acceso a cada mes dura <strong>3 meses</strong>, contados desde que se acredita el pago. Al terminar ese plazo, los videos de ese mes dejan de estar disponibles en tu cuenta, sin necesidad de aviso previo y sin que corresponda un reembolso por el vencimiento.
              </p>
              <p>
                <strong>Información del vencimiento.</strong> La duración se informa antes de pagar, y la fecha de vencimiento figura en el comprobante y en "Mis clases".
              </p>
              <p>
                <strong>Volver a comprar.</strong> Para ver de nuevo un mes vencido hay que comprarlo otra vez, al precio vigente en ese momento. Tu avance se conserva.
              </p>
              <p>
                <strong>Compras anteriores.</strong> Las compras hechas antes de la publicación de esta cláusula mantienen las condiciones vigentes al momento de comprar.
              </p>
            </Section>

            <Section titulo="3. Requisitos de Edad y Acceso">
              <p>
                La plataforma está diseñada para ser utilizada por adultos (mayores de 18 años). En el caso de menores de edad que deseen acceder a contenidos específicos (como las clases infantiles), el registro, la compra y el uso de la cuenta deben realizarse bajo la estricta supervisión y con la autorización expresa de sus padres o tutores legales, quienes asumen total responsabilidad.
              </p>
            </Section>

            <Section titulo="4. Veracidad de la Información y Comunicaciones">
              <p>
                Para registrar un perfil, adquirir cursos online o interactuar con la plataforma, te solicitaremos datos personales. El usuario garantiza que la dirección de correo electrónico proporcionada es activa y válida, y asume la responsabilidad de mantener actualizada su información.
              </p>
              <p>
                <strong>El correo de tu cuenta es nuestro canal oficial.</strong> Ahí te enviamos el comprobante de cada compra, los códigos de seguridad, las respuestas a tus solicitudes y cualquier aviso sobre tu cuenta. Revisá también la carpeta de spam y, si cambiás de correo, actualizalo en tu perfil.
              </p>
            </Section>

            <Section titulo="5. Salud y Responsabilidad en la Práctica">
              <p>
                Las clases son de entrenamiento físico y flexibilidad. Como toda actividad física, implican riesgos propios (por ejemplo, molestias musculares, distensiones o lesiones) que el usuario conoce y acepta al practicar.
              </p>
              <p className={claseDestacado}>
                Se recomienda encarecidamente contar con un apto médico o chequeo de salud vigente antes de iniciar cualquier programa. Si estás embarazada, tuviste una lesión o una cirugía reciente, o tenés alguna condición de salud, consultá antes con un profesional. El contenido es instructivo y general: no reemplaza un diagnóstico, un tratamiento médico ni la supervisión presencial de un profesional.
              </p>
              <p>
                <strong>Al practicar, te pedimos que:</strong> respetes tus límites y la progresión de los meses; hagas la entrada en calor indicada; uses un espacio despejado y una superficie segura; y detengas el ejercicio si sentís dolor, mareo o cualquier malestar.
              </p>
              <p>
                Flex Studio no se hace responsable por lesiones o daños que resulten de no seguir estas indicaciones o las de cada video, de forzar posiciones más allá de tus posibilidades, de practicar en condiciones inseguras o de no haber consultado a un profesional cuando correspondía.
              </p>
              <p>
                Nada de lo anterior limita la responsabilidad que la ley no permite excluir ni los derechos que te reconoce como consumidor.
              </p>
            </Section>

            <Section titulo="6. Cuentas de Usuario y Seguridad">
              <p>
                Para acceder a los contenidos, es obligatorio registrarse creando una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.
              </p>
              <p className={claseDestacado}>
                El acceso a los videos es estrictamente personal e intransferible. Compartir las credenciales de acceso con terceros es un incumplimiento de estos términos.
              </p>
              <p>
                <strong>Actividad inusual.</strong> Si detectamos un uso que indica que la cuenta se comparte o se usa de forma indebida (por ejemplo, accesos simultáneos desde muchos dispositivos o lugares), podemos suspender el acceso de forma temporal. Te avisamos por correo y podés explicarnos la situación; si fue un error, restablecemos el acceso. Ante incumplimientos graves o repetidos, podemos cerrar la cuenta.
              </p>
              <p>
                <strong>Baja de la cuenta.</strong> Podés pedir la baja de tu cuenta en cualquier momento desde el <Link to={RUTA_BAJA} className="font-semibold underline underline-offset-2">Botón de baja de servicio</Link> o desde <Link to={RUTA_ATENCION} className="font-semibold underline underline-offset-2">Atención al consumidor</Link>. Con la baja perdés el acceso a los meses que tengas vigentes, salvo lo que corresponda por el derecho de arrepentimiento (punto 8).
              </p>
            </Section>

            <Section titulo="7. Pagos">
              <p>
                Los pagos son procesados de forma segura a través de pasarelas de terceros (Mercado Pago para transacciones nacionales y PayPal para pagos internacionales en dólares). Flex Studio no almacena ni tiene acceso directo a los datos de tus tarjetas de crédito o débito en nuestros servidores.
              </p>
              <p>
                <strong>Precio final.</strong> El precio que se muestra antes de pagar es el precio final del mes. Los intereses por pagar en cuotas, las comisiones o los impuestos que aplique tu banco, tu tarjeta o la pasarela (por ejemplo, al pagar en dólares con una tarjeta argentina) dependen de las condiciones que tengas con ellos.
              </p>
              <p>
                <strong>Acreditación.</strong> El acceso se habilita cuando la pasarela confirma el pago. Si el pago queda en revisión, el acceso se habilita al acreditarse y te avisamos por correo; no hace falta pagar de nuevo.
              </p>
            </Section>

            <Section titulo="8. Derecho de Arrepentimiento">
              <p className={claseDestacado}>
                Tenés <strong>10 días corridos</strong> desde que se confirmó tu compra para revocarla, sin costo y sin dar motivos (art. 34 de la Ley 24.240 y art. 1110 del Código Civil y Comercial).
              </p>
              <p>
                Podés hacerlo desde el <Link to={RUTA_ARREPENTIMIENTO} className="font-semibold underline underline-offset-2">Botón de arrepentimiento</Link>, visible en todo el sitio, sin registrarte ni iniciar sesión. Dentro de las 24 horas te informamos el código de tu pedido. Podemos pedirte que confirmes algún dato, solo para verificar tu identidad. Una vez verificado, te devolvemos el dinero por el mismo medio de pago y se cierra el acceso a ese mes.
              </p>
              <p>
                <strong>Excepción:</strong> este derecho no aplica si ya empezaste más de un video del mes que querés devolver. Un video cuenta como empezado desde que le das reproducir, aunque no lo termines (art. 3 de la Disposición 954/2025 y art. 1116 del Código Civil y Comercial).
              </p>
              <p>
                Si una falla técnica de nuestra plataforma te impide ver lo que compraste, escribinos y lo resolvemos, sin perjuicio de los demás derechos que te reconoce la ley.
              </p>
            </Section>

            <Section titulo="9. Propiedad Intelectual y Usos Prohibidos">
              <p>
                Todo el contenido disponible en la plataforma (videos, textos, logos, imágenes, y metodologías de entrenamiento) es propiedad exclusiva de Flex Studio. Tu compra te da una licencia personal, no exclusiva e intransferible para ver los videos desde tu cuenta, para tu práctica individual y durante el plazo de acceso.
              </p>
              <p><strong>Sin autorización previa y por escrito de Flex Studio, no está permitido:</strong></p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Descargar, grabar la pantalla, copiar o reproducir los videos por cualquier medio.</li>
                <li>Compartir, vender, revender, alquilar o publicar el contenido, total o parcialmente, incluso en grupos o redes sociales.</li>
                <li>Usar los videos o la metodología para dar clases, particulares o grupales, o proyectarlos en un estudio, gimnasio o ante otras personas.</li>
                <li>Usar la marca Flex Studio o la imagen de Candelaria Imbaud para promocionar otros servicios.</li>
              </ul>
              <p>
                El incumplimiento de esta cláusula puede dar lugar a la suspensión o el cierre de la cuenta (punto 6), sin perjuicio de las acciones legales que correspondan.
              </p>
            </Section>

            <Section titulo="10. Cupones y Promociones">
              <p>
                Podemos ofrecer cupones de descuento. Cada cupón tiene sus propias condiciones (clases en las que vale, vigencia y cantidad de usos disponibles), que se validan al aplicarlo en el carrito.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Se puede usar un cupón por compra, y no se combina con otros.</li>
                <li>Los cupones no se canjean por dinero.</li>
                <li>Un cupón con usos limitados puede agotarse mientras otras personas lo están usando: el descuento se confirma al pagar.</li>
                <li>Si se devuelve una compra hecha con cupón, se reintegra el monto efectivamente pagado.</li>
              </ul>
              <p>
                Las promociones o sorteos especiales pueden tener condiciones propias, que se informan en cada caso.
              </p>
            </Section>

            <Section titulo="11. Requisitos Técnicos y Disponibilidad">
              <p>
                Para ver las clases necesitás un dispositivo con un navegador actualizado y una conexión a internet estable. La calidad de reproducción depende de tu conexión y de tu dispositivo.
              </p>
              <p>
                Trabajamos para que la plataforma esté siempre disponible, pero puede haber interrupciones por mantenimiento, actualizaciones o fallas de proveedores. Si una falla nuestra te impide ver un mes que compraste durante más de 48 horas seguidas, escribinos y <strong>extendemos tu acceso</strong> por el tiempo que estuvo sin funcionar.
              </p>
            </Section>

            <Section titulo="12. Cambios en estos Términos">
              <p>
                Podemos actualizar estos Términos y Condiciones. La fecha de la última actualización figura al pie de esta página y, si el cambio es importante, te avisamos por correo. Los cambios se aplican a las compras que hagas después de su publicación: cada compra se rige por los términos que aceptaste al confirmarla.
              </p>
            </Section>

            <Section titulo="13. Legislación Aplicable y Jurisdicción">
              <p>
                Estos Términos y Condiciones se rigen por las leyes de la República Argentina, incluidas las de defensa del consumidor. Para cualquier conflicto es competente la jurisdicción del lugar donde recibiste o debiste recibir el servicio (art. 1109 del Código Civil y Comercial).
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
