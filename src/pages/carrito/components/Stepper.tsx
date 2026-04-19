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

  const porcentajeProgreso = ((pasoActual - 1) / (pasos.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 mt-4 relative">
      <div className="absolute top-1/2 left-[5%] right-[5%] h-[1px] bg-neutral-300 -translate-y-1/2 z-0"></div>
      
      <motion.div 
        className="absolute top-5 left-0 h-[2px] bg-[#d7f250] z-0"
        initial={{ width: '0%' }}
        animate={{ width: `${porcentajeProgreso}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      ></motion.div>

      <div className="flex justify-between items-start text-xs md:text-sm font-medium px-2">
        {pasos.map((step) => {
          const isCompleted = pasoActual > step.num;
          const isActive = pasoActual === step.num;
 

          return (
            <div key={step.num} className="flex flex-col items-center gap-3 relative px-4">
              
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? '#d7f250' : '#c9c5c5',
                  borderColor: isCompleted || isActive ? '#d7f250' : '#c9c5c5',
                  scale: isActive ? 1.15 : 1,
                  color: isCompleted || isActive ? '#ffffff' : '#c9c7c7'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-lg`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <Check size={20} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span className={isActive ? 'text-[#1a1a1a]' : 'text-neutral-500'}>
                    {step.num}
                  </span>
                )}
              </motion.div>

              <motion.span 
                animate={{
                  color: isActive ? '#131313' : isCompleted ? '#d7f250' : '#52525b',
                  y: isActive ? 2 : 0
                }}
                className="absolute top-11 sm:top-12 left-1/2 -translate-x-1/2 w-20 sm:w-max text-center text-[10px] sm:text-xs font-medium tracking-wide leading-tight"
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