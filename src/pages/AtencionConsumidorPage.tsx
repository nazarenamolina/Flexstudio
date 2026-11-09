import { Link } from 'react-router-dom';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { CORREO_ATENCION, HORARIO_ATENCION, RUTA_ARREPENTIMIENTO, RUTA_BAJA } from '../legal';
import { claseEnlace, claseTarjeta } from './auth/estilos';

const claseSubtitulo = 'mb-2 font-principal text-xl font-bold uppercase';

export const AtencionConsumidorPage = () => {
  useTituloPagina('Atención al consumidor', 'Cómo hacer una consulta o un reclamo en Flex Studio: canales de contacto, horarios y área responsable.');

  return (
    <div className="min-h-screen px-4 pb-12 pt-[100px] sm:px-6 lg:pt-[112px]">
      <div className={`${claseTarjeta} mx-auto w-full max-w-2xl space-y-8 p-6 text-[#131313] sm:p-10`}>
        <h1 className="font-principal text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">Atención al consumidor</h1>

        <section>
          <h2 className={claseSubtitulo}>Consultas y reclamos</h2>
          <ul className="space-y-2 leading-relaxed text-neutral-700">
            <li><strong>Área responsable:</strong> Atención al cliente de Flex Studio (Candelaria Imbaud Lima).</li>
            <li><strong>Correo:</strong> <a href={`mailto:${CORREO_ATENCION}`} className={claseEnlace}>{CORREO_ATENCION}</a></li>
            <li><strong>Formulario:</strong> <Link to="/#consulta" className={claseEnlace}>escribinos desde la página de inicio</Link></li>
            <li><strong>Horario de atención:</strong> {HORARIO_ATENCION}.</li>
            <li><strong>Domicilio:</strong> Yerba Buena, Tucumán, Argentina.</li>
          </ul>
        </section>

        <section>
          <h2 className={claseSubtitulo}>Tus derechos</h2>
          <ul className="space-y-2 leading-relaxed text-neutral-700">
            <li><Link to={RUTA_ARREPENTIMIENTO} className={claseEnlace}>Botón de arrepentimiento</Link>: revocá tu compra dentro de los 10 días corridos.</li>
            <li><Link to={RUTA_BAJA} className={claseEnlace}>Botón de baja de servicio</Link>: pedí la baja del servicio contratado.</li>
            <li><Link to="/terminos-condiciones" className={claseEnlace}>Términos y Condiciones</Link> y <Link to="/politica-de-privacidad" className={claseEnlace}>Política de Privacidad</Link>.</li>
          </ul>
        </section>

        <section>
          <h2 className={claseSubtitulo}>Defensa del consumidor</h2>
          <p className="leading-relaxed text-neutral-700">
            Si no pudimos resolver tu reclamo, podés acudir a la autoridad de aplicación. Conocé tus derechos en{' '}
            <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/conoce-tus-derechos" target="_blank" rel="noopener noreferrer" className={claseEnlace}>Defensa del Consumidor</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
