import { Play, Share2, Bookmark, CheckCircle, Lock, Download, ArrowRight, Pause, Volume2, Settings, Maximize } from 'lucide-react';

const VideosPage = () => {
  return (
    <div className="min-h-screen text-[#131313] pt-25 px-5 md:pt-25">
      
      {/* GRID SUPERIOR: Video y Detalles vs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* COLUMNA IZQUIERDA: Reproductor y Detalles (Ocupa 2 de 3 columnas) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Reproductor de Video Dummy */}
          <div className="w-full aspect-video bg-[#131313] rounded-xl overflow-hidden relative group">
            {/* Simulando el video con un gradiente/imagen estática */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center opacity-50">
              <div className="w-full h-full rounded-full border-[20px] border-neutral-700/30 scale-150 blur-xl"></div>
            </div>
            
            {/* Controles del reproductor */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4">
              <Pause className="w-5 h-5 text-[#ffffff] cursor-pointer" />
              <Volume2 className="w-5 h-5 text-[#ffffff] cursor-pointer" />
              <span className="text-xs text-[#ffffff] font-medium tracking-wide">03:54 / 08:19</span>
              
              {/* Barra de progreso de video */}
              <div className="flex-1 h-1.5 bg-white/20 rounded-full relative cursor-pointer ml-2">
                <div className="absolute top-0 left-0 h-full bg-[#d7f250] rounded-full w-[45%]"></div>
                {/* Thumb/Handle de la barra */}
                <div className="absolute top-1/2 left-[45%] -translate-y-1/2 w-3 h-3 bg-[#ffffff] rounded-full shadow-lg"></div>
              </div>
              
              <Settings className="w-5 h-5 text-[#ffffff] cursor-pointer ml-2" />
              <Maximize className="w-5 h-5 text-[#ffffff] cursor-pointer" />
            </div>
          </div>

          {/* Tarjeta de Detalles del Video */}
          <div className="bg-[#131313] rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Apertura de cadera avanzado</h1>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1 text-[#d7f250] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#d7f250]"></span> Nivel Élite
                  </span>
                  <span className="text-[#a1a1aa]">&bull; 8:19 Duración</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-semibold">
                  <Share2 className="w-4 h-4" /> Compartir
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-semibold">
                  <Bookmark className="w-4 h-4" /> Guardar
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 py-4 border-y border-white/10">
              <div className="w-12 h-12 bg-neutral-700 rounded-full overflow-hidden">
                <img src="/api/placeholder/48/48" alt="Instructor" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-[#a1a1aa] uppercase tracking-widest font-semibold mb-1">Instructor</p>
                <p className="text-[#ffffff] font-bold">Marco Valerio</p>
              </div>
            </div>

            <p className="text-[#a1a1aa] leading-relaxed mb-8">
              En esta sesión avanzada, nos enfocaremos en la descompresión articular de la cadera utilizando técnicas de PNF (Facilitación Neuromuscular Propioceptiva). Diseñado para atletas que buscan maximizar su rango de movimiento y profundidad en splits laterales y frontales.
            </p>

            <div className="flex flex-wrap gap-3">
              {['Biomecánica', 'Movilidad Activa', 'Recuperación'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/5 text-[#a1a1aa] text-xs font-semibold rounded uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Temario y Progreso */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Temario del Curso */}
          <div className="bg-[#131313] rounded-xl p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-[#d7f250] block rounded-sm"></span>
              Contenido del Curso
            </h2>

            <div className="space-y-6">
              {/* Módulo 1 */}
              <div>
                <p className="text-xs text-[#a1a1aa] uppercase tracking-widest font-semibold mb-4">Módulo 1: Introducción</p>
                <div className="flex gap-4 items-center opacity-60">
                  <div className="relative w-24 aspect-video bg-neutral-800 rounded flex-shrink-0">
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1 text-[10px] rounded">4:20</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#ffffff]">Bases de la flexibilidad</p>
                    <p className="text-xs text-[#a1a1aa] flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3" /> Completado
                    </p>
                  </div>
                </div>
              </div>

              {/* Módulo 2 */}
              <div>
                <p className="text-xs text-[#a1a1aa] uppercase tracking-widest font-semibold mb-4">Módulo 2: Estiramientos Dinámicos</p>
                <div className="space-y-4 relative border-l-2 border-white/10 pl-4">
                  {/* Item Activo */}
                  <div className="absolute -left-[2px] top-0 bottom-1/2 border-l-2 border-[#d7f250]"></div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="relative w-24 aspect-video bg-neutral-800 rounded flex-shrink-0 border border-[#d7f250]/50">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play className="w-6 h-6 text-[#d7f250] fill-[#d7f250]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#d7f250]">Apertura de cadera avanzado</p>
                      <p className="text-xs text-[#a1a1aa] mt-1">Reproduciendo ahora</p>
                    </div>
                  </div>

                  {/* Siguiente Item */}
                  <div className="flex gap-4 items-center mt-4">
                    <div className="relative w-24 aspect-video bg-neutral-800 rounded flex-shrink-0">
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1 text-[10px] rounded">12:45</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#ffffff]">Dinámicas de pierna</p>
                      <p className="text-xs text-[#a1a1aa] mt-1">Siguiente video</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Módulo 3 */}
              <div>
                <p className="text-xs text-[#a1a1aa] uppercase tracking-widest font-semibold mb-4">Módulo 3: Flexibilidad Estática</p>
                <div className="flex gap-4 items-center opacity-40">
                  <div className="relative w-24 aspect-video bg-neutral-800 rounded flex-shrink-0">
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1 text-[10px] rounded">18:15</div>
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-[#ffffff]">Isometría profunda</p>
                      <p className="text-xs text-[#a1a1aa] mt-1">Bloqueado</p>
                    </div>
                    <Lock className="w-4 h-4 text-[#a1a1aa]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Progreso */}
          <div className="bg-[#131313] rounded-xl p-6">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xs text-[#a1a1aa] uppercase tracking-widest font-semibold">Tu Progreso</h3>
              <span className="text-lg font-bold text-[#d7f250]">64%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full mb-6">
              <div className="h-full bg-[#d7f250] rounded-full w-[64%] shadow-[0_0_10px_rgba(215,242,80,0.5)]"></div>
            </div>
            
            <button className="w-full py-4 bg-[#d7f250] text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-[#c4e03b] transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Descargar Guía PDF
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Cursos Recomendados */}
      <div className="max-w-7xl mx-auto mt-16 pb-12">
        <h2 className="text-2xl font-bold mb-8">Cursos Recomendados</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Grande Izquierda */}
          <div className="bg-[#131313] rounded-xl p-8 flex flex-col justify-end min-h-[400px] relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/80 to-transparent z-10"></div>
            {/* Aquí iría la imagen de fondo con opacidad */}
            <div className="relative z-20">
              <span className="inline-block px-3 py-1 bg-[#d7f250] text-black text-xs font-bold uppercase tracking-wider mb-4 rounded-sm">Masterclass</span>
              <h3 className="text-3xl font-bold mb-3">Columna de Acero</h3>
              <p className="text-[#a1a1aa] text-sm mb-6 max-w-md">
                Domina la movilidad de la columna torácica con técnicas de fisioterapia deportiva.
              </p>
              <span className="flex items-center gap-2 text-[#d7f250] font-semibold text-sm group-hover:gap-3 transition-all">
                Ver curso <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Grid Derecha (2 chicas arriba, 1 ancha abajo) */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              
              {/* Card Hombros Pro */}
              <div className="bg-[#131313] rounded-xl p-6 flex flex-col justify-end min-h-[180px] relative cursor-pointer">
                 <h4 className="text-xl font-bold mb-1">Hombros Pro</h4>
                 <p className="text-[#a1a1aa] text-xs mb-4">Salud articular extrema.</p>
                 <Play className="w-6 h-6 text-[#d7f250] fill-[#d7f250]" />
              </div>

              {/* Card Power Core */}
              <div className="bg-[#131313] rounded-xl p-6 flex flex-col justify-end min-h-[180px] relative cursor-pointer">
                 <h4 className="text-xl font-bold mb-1">Power Core</h4>
                 <p className="text-[#a1a1aa] text-xs mb-4">Estabilidad a otro nivel.</p>
                 <Play className="w-6 h-6 text-[#d7f250] fill-[#d7f250]" />
              </div>

            </div>

            {/* Card Nutrición & Recovery */}
            <div className="bg-[#131313] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-bold mb-1">Nutrición & Recovery</h4>
                <p className="text-[#a1a1aa] text-xs">El 50% de tu progreso está aquí.</p>
              </div>
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-sm font-semibold rounded transition-colors whitespace-nowrap border border-white/10">
                Explorar Guías
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default VideosPage;