import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { Tiktok, Instagram } from "react-bootstrap-icons";

export const FooterComponent = () => {
  return (
    <footer className="bg-[#161616] pt-15 text-[#cdcdcd] overflow-hidden">

      {/* Cambio estructural en el Grid:
        - md:grid-cols-[0.8fr_1fr_1fr_1.4fr]: El logo ocupa menos (0.8), Info/Redes (1), Contacto ocupa más (1.4).
        - md:gap-4: Reducimos el espacio entre columnas en tablet para ganar pixeles.
        - lg:grid-cols-4 lg:gap-8: En desktop vuelve a ser simétrico con más espacio.
      */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-5 md:grid-cols-[0.8fr_1fr_1fr_1.4fr] md:gap-4 lg:grid-cols-4 lg:gap-8 lg:px-8">
        
        {/* Columna 1: Logo */}
        <article className="flex flex-col items-center md:items-start md:pr-2 min-w-0">
          <img 
            src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774490155/logofooter_u3j6cz.png" 
            className="w-44 md:w-full md:max-w-[150px] lg:max-w-[220px] object-contain opacity-90 transition-opacity hover:opacity-100" 
            alt="Logo Flex Studio" 
          />
        </article>

        {/* Columna 2: Redes Sociales */}
        <article className="flex flex-col items-center text-center md:items-start md:text-left w-full min-w-0">
          <h3 className="mb-6 w-full border-b-2 border-[#d7f250] pb-2 text-[1.1rem] font-semibold text-white">
            Redes Sociales
          </h3>
          <div className="flex flex-col gap-[15px] w-full items-center md:items-start">
            <a 
              href="https://www.instagram.com/flex_studioc/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-[12px] text-[#cdcdcd] transition-colors duration-300 hover:text-[#d7f250]"
            >
              <span className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-[#252525] text-white transition-colors duration-300 group-hover:bg-[#d7f250] group-hover:text-[#161616]">
                <Instagram size={18} />
              </span> 
              Instagram
            </a>
            <a 
              href="https://www.tiktok.com/@flexstudioc" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-[12px] text-[#cdcdcd] transition-colors duration-300 hover:text-[#d7f250]"
            >
              <span className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-[#252525] text-white transition-colors duration-300 group-hover:bg-[#d7f250] group-hover:text-[#161616]">
                <Tiktok size={18} />
              </span> 
              Tiktok
            </a>
          </div>
        </article>

        {/* Columna 3: Información */}
        <article className="flex flex-col items-center text-center md:items-start md:text-left w-full min-w-0">
          <h3 className="mb-6 w-full border-b-2 border-[#d7f250] pb-2 text-[1.1rem] font-semibold text-white">
            Información
          </h3>
          <ul className="flex flex-col gap-3 w-full">
            <li><Link to="/acerca-de" className="block text-[0.95rem] text-[#cdcdcd] transition-all duration-300 hover:pl-1.5 hover:text-[#d7f250]">Acerca de mí</Link></li>
            <li><Link to="/videos" className="block text-[0.95rem] text-[#cdcdcd] transition-all duration-300 hover:pl-1.5 hover:text-[#d7f250]">Ver Cursos</Link></li>
            <li><Link to="/terminos-y-condiciones" className="block text-[0.95rem] text-[#cdcdcd] transition-all duration-300 hover:pl-1.5 hover:text-[#d7f250]">Términos y Condiciones</Link></li>
            <li><Link to="/politica-de-privacidad" className="block text-[0.95rem] text-[#cdcdcd] transition-all duration-300 hover:pl-1.5 hover:text-[#d7f250]">Política de Privacidad</Link></li>
          </ul>
        </article>

        {/* Columna 4: Contacto */}
        <article className="flex flex-col items-center text-center md:items-start md:text-left w-full min-w-0">
          <h3 className="mb-6 w-full border-b-2 border-[#d7f250] pb-2 text-[1.1rem] font-semibold text-white">
            Contacto
          </h3>
          <div className="flex flex-col gap-5 w-full items-center md:items-start">
            <div className="flex items-start gap-[12px] max-w-full">
              <Mail className="mt-[3px] shrink-0 text-[#d7f250]" size={20} />
              {/* Removido break-all. El grid ahora le da el espacio necesario. */}
              <p className="m-0 text-[0.95rem]">candeimbo@gmail.com</p>
            </div>
            <div className="flex items-start gap-[12px] max-w-full">
              <MapPin className="mt-[3px] shrink-0 text-[#d7f250]" size={20} />
              <p className="m-0 text-[0.95rem] text-left">Yerba Buena<br />Tucumán, Argentina</p>
            </div>
          </div>
        </article>

      </div>

      <div className="mt-16 w-full border-t border-[#333] py-6">
        <div className="mx-auto flex flex-col items-center justify-center px-8 text-center text-[0.85rem] text-[#888]">
          <p className="m-0">© {new Date().getFullYear()} Flex Studio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;