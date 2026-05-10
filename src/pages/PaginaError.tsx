import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const PaginaError = () => {
  return (
    // 👇 Eliminamos el fondo de color para que tu textura blanca se vea de fondo
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden relative">
      
      {/* =========================================
          EFECTOS DE FONDO (Adaptados a Modo Claro)
      ========================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Halos gigantes de fondo (Ahora más opacos para que se noten en blanco) */}
        <motion.div 
          animate={{ opacity: [0.1, 0.4, 0.1] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(215,242,80,0.3)_0%,transparent_60%)] rounded-full" 
        />
        <motion.div 
          animate={{ opacity: [0.05, 0.3, 0.05] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute -bottom-40 -right-20 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(215,242,80,0.2)_0%,transparent_60%)] rounded-full" 
        />

        {/* 👇 Partículas de energía: Más grandes, mayor opacidad y con una sombra más oscura para contrastar con el blanco */}
        <motion.div 
          animate={{ y: [0, -40, 0], opacity: [0.9, 1, 0.9] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-1/4 left-[20%] w-3 h-3 bg-[#d7f250] rounded-full shadow-[0_0_12px_2px_rgba(170,190,0,0.6)]" 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.6, 1, 0.6] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
          className="absolute top-1/3 right-[25%] w-2 h-2 bg-[#d7f250] rounded-full shadow-[0_0_10px_2px_rgba(170,190,0,0.5)]" 
        />
        <motion.div 
          animate={{ y: [0, -30, 0], opacity: [0.8, 1, 0.8] }} 
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
          className="absolute bottom-1/3 left-[30%] w-3.5 h-3.5 bg-[#d7f250] rounded-full shadow-[0_0_15px_3px_rgba(170,190,0,0.7)]" 
        />
        <motion.div 
          animate={{ y: [0, 40, 0], opacity: [0.7, 1, 0.7] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
          className="absolute bottom-1/4 right-[20%] w-2.5 h-2.5 bg-[#d7f250] rounded-full shadow-[0_0_10px_2px_rgba(170,190,0,0.5)]" 
        />
      </div>

      {/* =========================================
          CONTENIDO PRINCIPAL
      ========================================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-4xl w-full"
      >
        
        {/* IMAGEN FLOTANTE (Sin desenfoque, 100% nítida) */}
        <div className="relative flex items-center justify-center mb-8 lg:mb-12 w-full h-56 sm:h-72 md:h-80 lg:h-80 select-none pointer-events-none">
          <motion.img 
            src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1777746347/ChatGPT_Image_2_may_2026_02_58_29_p.m._dyv5lj.png"
            alt="Error 404 - No encontrado"
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            /* 👇 Solo las clases necesarias para que se vea nítida y mantenga proporción 👇 */
            className="w-auto h-full object-contain"
          />
        </div>

        {/* TEXTOS (Ajustados para fondo claro) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#131313] mb-6 tracking-tight leading-tight">
            ¡Uf! Te has estirado <br className="hidden md:block" /> demasiado.
          </h2>
          
          <p className="text-gray-500 font-medium text-base md:text-lg mb-10 leading-relaxed px-4">
            No pudimos encontrar la página que buscas. Puede que se haya movido, 
            eliminado o simplemente decidió irse a patinar a otro lado.
          </p>
        </motion.div>

        {/* BOTÓN DE REGRESO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link 
            to="/" 
            className="flex items-center justify-center gap-3 rounded-full bg-neon-pink px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default PaginaError;