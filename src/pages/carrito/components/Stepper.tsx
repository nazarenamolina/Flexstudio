import { Fragment } from 'react';
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

  return ( 
    <div className="w-full max-w-4xl mx-auto mb-15 mt-4 px-4 md:px-8">
       
      <div className="flex items-center justify-between w-full relative">
        {pasos.map((step, index) => {
          const isCompleted = pasoActual > step.num;
          const isActive = pasoActual === step.num;
          const isLast = index === pasos.length - 1;

          return (
            <Fragment key={step.num}>
              
              {/* --- 1. CÍRCULO Y TEXTO --- */}
              <div className="relative flex flex-col items-center z-10">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isActive ? '#d7f250' : '#d4d4d8',  
                    borderColor: isCompleted || isActive ? '#d7f250' : '#d4d4d8',
                    scale: isActive ? 1.15 : 1,
                    color: isCompleted || isActive ? '#1a1a1a' : '#ffffff' 
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-md"
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                    >
                      <Check size={20} strokeWidth={3} className="text-[#1a1a1a]" />
                    </motion.div>
                  ) : (
                    <span>{step.num}</span>
                  )}
                </motion.div>

                {/* Texto debajo del círculo */}
                <motion.span
                  animate={{
                    color: isActive ? '#131313' : isCompleted ? '#d7f250' : '#a1a1aa',
                    y: isActive ? 2 : 0
                  }}
                  className="absolute top-12 w-32 text-center text-[10px] sm:text-sm font-bold tracking-tight leading-tight"
                >
                  {step.label}
                </motion.span>
              </div>

              {/* --- 2. LÍNEA CONECTORA (Se estira automáticamente) --- */}
              {!isLast && (
                <div className="flex-1 h-[2px] bg-neutral-300 mx-[-2px] z-0 relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-[#d7f250]"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;