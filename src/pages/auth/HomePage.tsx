import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { obtenerCategoriasRequest } from '../../api/categoria';

// 1. DEFINIMOS LA INTERFAZ
export interface Categoria {
  id: string; 
  imagenUrl?: string;
  titulo: string;
  descripcion: string;
}

const HomePage = () => {
  // 2. ESTADOS TIPADOS
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [hoveredCategoriaId, setHoveredCategoriaId] = useState<string | null>(null);

  // 3. LÓGICA DEL CARRUSEL NATIVO (Directo con Cloudinary)
  const slides = [
    // 👇 Reemplaza estas URLs con las tuyas de Cloudinary. 
    // Nota el uso de q_auto,f_auto para máxima optimización
    'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/q_auto,f_auto/v123456789/flex-studio/tu-banner.jpg',
    'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/q_auto,f_auto/v123456789/flex-studio/tu-quien-soy.jpg'
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 4. FETCH DE DATOS
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerCategoriasRequest();
        
        // 🚨 AGREGAMOS ESTE CONSOLE.LOG PARA VER QUÉ MANDA TU BACKEND REALMENTE
        console.log("Respuesta del backend:", data); 

        // 🛡️ ESCUDO PROTECTOR: Verificamos si es un Array antes de guardarlo
        if (Array.isArray(data)) {
          setCategorias(data);
        } 
        // A veces los backends mandan la data anidada dentro de una propiedad (ej: data.categorias)
        else if (data && Array.isArray((data as any).categorias)) {
          setCategorias((data as any).categorias);
        } 
        // Si no es un array ni está anidado, forzamos un array vacío para evitar el pantallazo negro
        else {
          console.error("El formato de datos no es válido", data);
          setCategorias([]); 
        }

      } catch (error) {
        console.error("Error al cargar las categorías:", error);
        setCategorias([]); // En caso de error, también forzamos array vacío
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);


  return (
    <main className="min-h-screen bg-[#111111] font-sans text-white pb-20">
      
      {/* --- SECCIÓN: CARRUSEL --- */}
      <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden group">
        <div 
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full shrink-0 relative">
              <img src={slide} alt={`Slide ${index}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30"></div> 
            </div>
          ))}
        </div>
        
        {/* Controles del Carrusel */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d7f250] hover:text-black text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d7f250] hover:text-black text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10">
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      <section className="container mx-auto px-6 py-16">
        
        {/* --- TÍTULO DESDE CLOUDINARY --- */}
        <div className="flex justify-center mb-16">
          {/* 👇 Reemplaza esta URL con la de tu título en Cloudinary 👇 */}
          <img 
            src="https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/q_auto,f_auto/v123456789/flex-studio/tu-titulo.png" 
            alt="Explorar Clases" 
            className="h-16 object-contain" 
          />
        </div>

        {/* --- SECCIÓN: GRID DE CATEGORÍAS --- */}
        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cargando ? (
            <div className="col-span-full text-center py-10">
              <h4 className="text-xl text-gray-400 font-bold animate-pulse">Cargando clases disponibles...</h4>
            </div>
          ) : categorias.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400">Aún no hay categorías disponibles.</p>
            </div>
          ) : (
            categorias.map((servicio) => (
              <div 
                key={servicio.id} 
                className="relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shadow-xl group"
                onMouseEnter={() => setHoveredCategoriaId(servicio.id)}
                onMouseLeave={() => setHoveredCategoriaId(null)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 grayscale opacity-40 group-hover:opacity-20" 
                  // Aseguramos que la imagen que viene de la BD también se vea bien
                  style={{ backgroundImage: `url(${servicio.imagenUrl || 'https://placehold.co/600x400/1a1a1a/FFF?text=Flex+Studio'})` }}
                />

                <div className="relative z-10 p-8 flex flex-col h-full min-h-87.5 justify-between">
                  
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold bg-[#d7f250]/10 border border-[#d7f250] text-[#d7f250] px-3 py-1 rounded tracking-widest uppercase">
                      Plan Mensual
                    </span>
                    <span className="flex items-center text-gray-400 text-xs font-bold tracking-wider">
                      <Clock className="w-4 h-4 mr-1.5 text-[#d7f250]" /> 1h 15min
                    </span>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">
                      {servicio.titulo}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                      {servicio.descripcion}
                    </p>

                    {hoveredCategoriaId === servicio.id && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[90%] bg-black border border-gray-700 p-3 rounded-lg shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-xs text-gray-300 text-center">¡Diseñado para ayudarte a alcanzar tus metas! Descubre más sobre esta disciplina.</p>
                      </div>
                    )}

                    <Link
                      to={`/categorias/${servicio.id}`}
                      className="w-full flex items-center justify-between bg-[#d7f250] hover:bg-[#c4dd46] text-black font-black text-sm py-3 px-5 rounded transition-colors"
                    >
                      <span className="tracking-widest uppercase">Ver Más</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </article>

        {/* --- SECCIÓN: CONTACTO --- */}
        <article className="mt-24 max-w-2xl mx-auto bg-[#1a1a1a] p-8 md:p-12 rounded-xl border border-gray-800 shadow-2xl">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-black text-[#d7f250] tracking-tighter mb-2">¿Tenés una consulta?</h3>
            <p className="text-gray-400 text-sm">Completa con tus datos y te respondo lo antes posible.</p>
          </div>
          
          <form className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Tu nombre" 
                  className="w-full bg-transparent border border-gray-700 focus:border-[#d7f250] rounded-md pl-11 pr-3 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="correo@ejemplo.com" 
                  className="w-full bg-transparent border border-gray-700 focus:border-[#d7f250] rounded-md pl-11 pr-3 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Consulta</label>
              <textarea
                rows={4}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full bg-transparent border border-gray-700 focus:border-[#d7f250] rounded-md p-3 text-white placeholder-gray-600 focus:outline-none transition-colors resize-none"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-black font-black text-sm py-3 px-4 rounded transition-colors mt-4 tracking-widest uppercase"
            >
              Enviar Mensaje
            </button>
          </form>
        </article>

        <div className="mt-20 text-center">
          <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest">
            Seguime en Instagram:{' '}
            <a 
              href="https://www.instagram.com/flex_studioc/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#d7f250] hover:text-white transition-colors"
            >
              @FLEX_STUDIOC
            </a>
          </h2>
        </div>
        
      </section>
    </main>
  );
};

export default HomePage;