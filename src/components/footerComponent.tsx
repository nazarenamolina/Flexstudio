import { Link } from "react-router-dom";
import { Instagram, Music2, Mail, MapPin } from "lucide-react";

export const FooterComponent = () => {
  return (
    <footer className="bg-[#161616] pt-15 text-[#cdcdcd]">

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-20 px-5 md:flex-row md:items-start md:justify-between md:px-1">
        
        {/* Columna 1: Logo */}
        <article className="flex w-full flex-1 flex-col items-center md:w-auto md:items-start">
          {/* Reemplaza con tu imagen real */}
          <img src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774490155/logofooter_u3j6cz.png" className="w-[100%] object-contain" alt="Logo Flex Studio" />
        </article>

        {/* Columna 2: Redes Sociales */}
        <article className="flex w-full flex-1 flex-col items-center text-center md:w-auto md:items-start md:text-left">
          <h3 className="mb-6 w-full border-b-2 border-[#d7f250] pb-1 text-[1.1rem] font-semibold text-white">
            Redes Sociales
          </h3>
          <div className="flex flex-col gap-[15px]">
            <a 
              href="https://www.instagram.com/flex_studioc/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center justify-center gap-[10px] text-[#cdcdcd] transition-colors duration-300 hover:text-[#d7f250] md:justify-start"
            >
              <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#252525] text-white transition-colors duration-300 group-hover:bg-[#d7f250] group-hover:text-[#161616]">
                <Instagram size={18} />
              </span> 
              Instagram
            </a>
            <a 
              href="https://www.tiktok.com/@flexstudioc" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center justify-center gap-[10px] text-[#cdcdcd] transition-colors duration-300 hover:text-[#d7f250] md:justify-start"
            >
              <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#252525] text-white transition-colors duration-300 group-hover:bg-[#d7f250] group-hover:text-[#161616]">
                <Music2 size={18} />
              </span> 
              Tiktok
            </a>
          </div>
        </article>

        {/* Columna 3: Información */}
        <article className="flex w-full flex-1 flex-col items-center text-center md:w-auto md:items-start md:text-left">
          <h3 className="mb-6 w-full border-b-2 border-[#d7f250] pb-1 text-[1.1rem] font-semibold text-white">
            Información
          </h3>
          <ul className="flex flex-col gap-3">
            {/* Efecto de padding en hover traducido: hover:pl-1.5 */}
            <li><Link to="/acerca-de" className="block text-[0.95rem] text-[#cdcdcd] transition-all duration-300 hover:pl-1.5 hover:text-[#d7f250]">Acerca de mí</Link></li>
            <li><Link to="/videos" className="block text-[0.95rem] text-[#cdcdcd] transition-all duration-300 hover:pl-1.5 hover:text-[#d7f250]">Ver Cursos</Link></li>
            <li><Link to="/terminos-y-condiciones" className="block text-[0.95rem] text-[#cdcdcd] transition-all duration-300 hover:pl-1.5 hover:text-[#d7f250]">Términos y Condiciones</Link></li>
            <li><Link to="/politica-de-privacidad" className="block text-[0.95rem] text-[#cdcdcd] transition-all duration-300 hover:pl-1.5 hover:text-[#d7f250]">Política de Privacidad</Link></li>
          </ul>
        </article>

        {/* Columna 4: Contacto */}
        <article className="flex w-full flex-1 flex-col items-center text-center md:w-auto md:items-start md:text-left">
          <h3 className="mb-6 w-full border-b-2 border-[#d7f250] pb-1 text-[1.1rem] font-semibold text-white">
            Contacto
          </h3>
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-center gap-[15px] md:justify-start">
              <Mail className="mt-[3px] text-[#d7f250]" size={20} />
              <p className="m-0 text-[0.95rem]">candeimbo@gmail.com</p>
            </div>
            <div className="flex items-start justify-center gap-[15px] md:justify-start">
              <MapPin className="mt-[3px] text-[#d7f250]" size={20} />
              <p className="m-0 text-[0.95rem]">Yerba Buena<br />Tucumán, Argentina</p>
            </div>
          </div>
        </article>

      </div>

      <div className="mt-8 w-full border-t border-[#333] py-6">
        <div className="mx-auto flex flex-col items-center justify-between gap-[15px] px-8 text-center text-[0.85rem] text-[#888] md:flex-row md:text-left">
          <p className="m-0">© {new Date().getFullYear()} Flex Studio. Todos los derechos reservados.</p>
          <div className="flex gap-[20px] md:gap-[30px]">
            <Link to="/aviso-legal" className="text-[#888] transition-colors duration-300 hover:text-[#d7f250]">Aviso Legal</Link>
            <Link to="/cookies" className="text-[#888] transition-colors duration-300 hover:text-[#d7f250]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;