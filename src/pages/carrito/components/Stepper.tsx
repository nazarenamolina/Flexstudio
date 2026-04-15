import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Props {
  pasoActual: number;
}

const Stepper = ({ pasoActual }: Props) => {
  const pasos = [
    { num: 1, label: 'Revisa tu orden' },
    { num: 2, label: 'Ingresa tus datos' },
    { num: 3, label: 'Confirma tu compra' }
  ];

  // Calculamos qué tan llena debe estar la línea de fondo (0%, 50% o 100%)
  const porcentajeProgreso = ((pasoActual - 1) / (pasos.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 mt-4 relative">
      {/* 1. La línea gris de fondo (Ruta vacía) */}
      <div className="absolute top-5 -left-0  w-full h-[2px] bg-neutral-800 z-0"></div>
      
      {/* 2. La línea morada animada (Progreso) */}
      <motion.div 
        className="absolute top-5 left-0 h-[2px] bg-[#8b5cf6] z-0"
        initial={{ width: '0%' }}
        animate={{ width: `${porcentajeProgreso}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      ></motion.div>

      <div className="flex justify-between items-start text-xs md:text-sm font-medium px-2">
        {pasos.map((step) => {
          const isCompleted = pasoActual > step.num;
          const isActive = pasoActual === step.num;
 

          return (
            <div key={step.num} className="flex flex-col items-center gap-3 relative bg-[#0a0a0a] px-4">
              
              {/* El Círculo Animado */}
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? '#8b5cf6' : '#1a1a1a',
                  borderColor: isCompleted || isActive ? '#8b5cf6' : '#262626',
                  scale: isActive ? 1.15 : 1,
                  color: isCompleted || isActive ? '#ffffff' : '#737373'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-lg ${isActive ? 'shadow-[#8b5cf6]/20' : ''}`}
              >
                {/* Transición suave entre el número y el ícono de Check */}
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <Check size={20} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span className={isActive ? 'text-white' : 'text-neutral-500'}>
                    {step.num}
                  </span>
                )}
              </motion.div>

              {/* El Texto de la Etiqueta */}
              <motion.span 
                animate={{
                  color: isActive ? '#ffffff' : isCompleted ? '#d4d4d8' : '#52525b',
                  y: isActive ? 2 : 0
                }}
                className="absolute top-14 text-center w-32 font-semibold"
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;