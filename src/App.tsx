import React from 'react';

// --- DATOS SIMULADOS (Mock Data) ---
// En el futuro, esto vendrá de tu base de datos / backend
const CLASES_DATA = [
  { id: 1, titulo: 'Clases para Patinadoras', descripcion: 'Potencia tu rendimiento en la pista con rutinas específicas.', img: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop' },
  { id: 2, titulo: 'Clases Progresivas Generales', descripcion: 'Desarrolla fuerza y flexibilidad paso a paso desde cero.', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' },
  { id: 3, titulo: 'Clases para Deportistas', descripcion: 'Entrenamiento complementario para maximizar tu potencial.', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop' },
  { id: 4, titulo: 'Clases para Bailarinas', descripcion: 'Mejora tu amplitud de movimiento, líneas y control corporal.', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop' },
  { id: 5, titulo: 'Clases para Gimnastas', descripcion: 'Técnica, potencia y prevención de lesiones para gimnasia.', img: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=600&auto=format&fit=crop' },
  { id: 6, titulo: 'Clases para Acróbatas', descripcion: 'Fuerza de core, equilibrio y dinámicas aéreas.', img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop' },
];

const App: React.FC = () => {
  return (
    // Contenedor principal: Fondo claro con una sutil textura/ruido de fondo simulada
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans overflow-x-hidden relative">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="font-cursiva text-3xl font-bold tracking-tight">flex STUDIO</div>
        <div className="hidden md:flex gap-6 text-sm font-semibold items-center uppercase tracking-wide">
          <a href="#" className="hover:text-neon-pink transition-colors">Clases</a>
          <span className="text-gray-400">|</span>
          <span className="flex items-center gap-2">
             Hola, Nazarena
          </span>
          <button className="hover:text-neon-pink">Carrito</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between">
        <div className="relative w-full md:w-1/2 flex flex-col justify-center items-center md:items-start pl-0 md:pl-10">
          
          {/* Título superpuesto (El mismo truco que te enseñé, adaptado) */}
          <div className="relative flex flex-col items-center md:items-start">
            <h1 className="font-principal text-[8rem] md:text-[12rem] font-bold text-neon-pink leading-none tracking-tighter drop-shadow-sm">
              SOY
            </h1>
            <span className="font-cursiva text-6xl md:text-8xl text-gray-900 absolute top-[40%] md:top-[50%] left-0 md:left-10 transform -translate-y-1/2 -rotate-2 whitespace-nowrap z-10">
              Cande Imbaud
            </span>
          </div>

          <p className="mt-8 md:mt-12 text-sm md:text-base font-bold tracking-[0.3em] text-gray-600 uppercase">
            Profesora de Educación Física
          </p>
        </div>

        {/* Imagen Hero */}
        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end">
          {/* Reemplazá este placeholder por la imagen real de Cande sin fondo (PNG) */}
          <img 
            src="https://images.unsplash.com/photo-1552196563-55259259ae14?q=80&w=600&auto=format&fit=crop" 
            alt="Cande Imbaud Acrobacia" 
            className="w-full max-w-md object-contain drop-shadow-2xl rounded-3xl"
          />
        </div>
      </header>

      {/* --- SECCIÓN CLASES (EXPLORAR) --- */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Título de Sección */}
          <div className="relative flex justify-center items-center mb-20">
            <h2 className="font-principal text-6xl md:text-[10rem] font-bold text-neon-pink leading-none tracking-tighter drop-shadow-sm">
              EXPLORAR
            </h2>
            <span className="font-cursiva text-6xl md:text-8xl text-gray-900 absolute top-1/2 left-1/2 transform -translate-x-[20%] -translate-y-[40%] z-10">
              Clases
            </span>
          </div>

          {/* Grid de Tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {CLASES_DATA.map((clase) => (
              <div 
                key={clase.id} 
                className="group relative w-full max-w-87 h-112 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
              >
                {/* Imagen de fondo */}
                <img 
                  src={clase.img} 
                  alt={clase.titulo} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradiente oscuro para que se lea el texto */}
                <div className="absolute inset-0 bg-gradient-to-top from-black/90 via-black/40 to-transparent"></div>
                
                {/* Badge top-left */}
                <div className="absolute top-4 left-4 bg-neon-pink text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Plan Mensual
                </div>

                {/* Contenido inferior */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <h3 className="font-principal text-3xl font-bold leading-tight mb-2 group-hover:text-neon-pink transition-colors">
                    {clase.titulo}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {clase.descripcion}
                  </p>
                  <button className="bg-white/20 hover:bg-neon-pink hover:text-gray-900 border border-white/50 backdrop-blur-sm text-white text-xs font-bold py-2 px-6 rounded-full uppercase tracking-wider transition-all">
                    Ver Más
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FORMULARIO DE CONTACTO --- */}
      <section className="py-20 px-6 flex justify-center">
        <div className="bg-[#e5e7eb] p-10 rounded-4xl w-full max-w-md shadow-xl text-center">
          <h3 className="font-principal text-3xl text-gray-800 mb-2">¿Tenés una consulta?</h3>
          <p className="text-sm text-gray-600 mb-8">Escribinos y te responderemos a la brevedad.</p>
          
          <form className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Nombre</label>
              <input type="text" placeholder="Tu nombre" className="w-full mt-1 p-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-neon-pink outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Email</label>
              <input type="email" placeholder="tucorreo@mail.com" className="w-full mt-1 p-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-neon-pink outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Consulta</label>
              <textarea rows={3} placeholder="Escribe aquí..." className="w-full mt-1 p-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-neon-pink outline-none resize-none"></textarea>
            </div>
            <button type="button" className="mt-4 bg-gray-900 hover:bg-neon-pink hover:text-gray-900 text-white font-bold py-3 rounded-xl uppercase tracking-widest transition-colors">
              Enviar
            </button>
          </form>
        </div>
      </section>

      {/* --- BANNER INSTAGRAM --- */}
      <div className="bg-neon-pink py-4 text-center">
        <a href="#" className="font-bold text-gray-900 text-sm md:text-base uppercase tracking-[0.2em] hover:underline">
          Seguime en Instagram: @FLEX_STUDIOC
        </a>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-bg-card text-white py-16 px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Columna 1: Logo */}
          <div className="flex flex-col items-center md:items-start">
            <div className="font-cursiva text-4xl mb-2">flex STUDIO</div>
            <div className="text-xs tracking-[0.3em] text-gray-400 uppercase">Candelaria Imbaud</div>
          </div>

          {/* Columna 2: Redes */}
          <div>
            <h4 className="font-bold text-neon-pink border-b border-gray-700 pb-2 mb-4 text-sm uppercase">Redes Sociales</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-neon-pink transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-neon-pink transition-colors">TikTok</a></li>
            </ul>
          </div>

          {/* Columna 3: Info */}
          <div>
            <h4 className="font-bold text-neon-pink border-b border-gray-700 pb-2 mb-4 text-sm uppercase">Información</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-neon-pink transition-colors">Acerca de mí</a></li>
              <li><a href="#" className="hover:text-neon-pink transition-colors">Mis Cursos</a></li>
              <li><a href="#" className="hover:text-neon-pink transition-colors">Términos y Condiciones</a></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-bold text-neon-pink border-b border-gray-700 pb-2 mb-4 text-sm uppercase">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>cande.imbaud@gmail.com</li>
              <li>Yerba Buena, Tucumán, Argentina</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-600 mt-16 pt-8 border-t border-gray-800">
          © 2024 Flex Studio. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
};

export default App;