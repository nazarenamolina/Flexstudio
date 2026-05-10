import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  className?: string;
}

export const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className = '' 
}: ScrollRevealProps) => {
  const direcciones = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...direcciones[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ 
        once: true,
        margin: "-50px" 
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};