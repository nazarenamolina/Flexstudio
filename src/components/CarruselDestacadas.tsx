import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {ChevronLeft, ChevronRight } from 'lucide-react';
import { TarjetaClase } from './TarjetaClase';
import { type Categoria } from '../api/categoria';

interface Props {
  categorias: Categoria[];
  flippedCard: string | number | null;
  setFlippedCard: (id: string | null) => void;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

export const CarruselDestacadas = ({ categorias, flippedCard, setFlippedCard }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const categoriasOrdenadas = useMemo(() => {
    return [...categorias].sort((a, b) => (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0));
  }, [categorias]);

  if (categoriasOrdenadas.length === 0) return null;

  const next = () => {setFlippedCard(null); setCurrentIndex((prev) => (prev + 1) % categoriasOrdenadas.length);};
  const prev = () => {
    setFlippedCard(null); 
    setCurrentIndex((prev) => (prev - 1 + categoriasOrdenadas.length) % categoriasOrdenadas.length);
  };

  const getPosition = (index: number) => {
    const diff = (index - currentIndex + categoriasOrdenadas.length) % categoriasOrdenadas.length;
    if (categoriasOrdenadas.length === 1) return 'center';
    if (categoriasOrdenadas.length === 2) return diff === 0 ? 'center' : 'right';

    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === categoriasOrdenadas.length - 1) return 'left';
    return 'hidden';
  };

  const variants = {
    center: { x: '0%', scale: 1, zIndex: 10, opacity: 1, filter: 'brightness(100%)' },
    left: { x: '-100%', scale: 0.8, zIndex: 5, opacity: 0.8, filter: 'brightness(60%)' },
    right: { x: '100%', scale: 0.8, zIndex: 5, opacity: 0.8, filter: 'brightness(60%)' },
    hidden: { x: '0%', scale: 0.5, zIndex: 1, opacity: 0, filter: 'brightness(0%)' }
  };

  return (
    <section className="container mx-auto px-4 pb-10 overflow-hidden">
      <div className="relative w-full max-w-6xl mx-auto h-[450px] md:h-[550px] flex justify-center items-center perspective-1000">
        {categoriasOrdenadas.map((categoria, index) => {
          const position = getPosition(index);
          const isCenter = position === 'center';

          return (
            <motion.div
              key={categoria.id}
              initial={false}
              animate={position}
              variants={variants}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) next();
                else if (swipe > swipeConfidenceThreshold) prev();
              }}
              className="absolute w-[280px] sm:w-[350px] md:w-[416px] h-[400px] md:h-[512px]">
              {/* Capa invisible para las tarjetas laterales: Evita el Flip y mueve el carrusel */}
              {!isCenter && (
                <div 
                  className="absolute inset-0 z-50 cursor-pointer rounded-[30px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (position === 'left') prev();
                    if (position === 'right') next();
                  }}
                />
              )}
              {/* Tu hermosa tarjeta nativa */}
              <TarjetaClase 
                servicio={categoria} 
                flippedCard={flippedCard} 
                setFlippedCard={setFlippedCard} 
              />
            </motion.div>
          );
        })}
        {categoriasOrdenadas.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 md:-left-30 z-20 p-4 rounded-full bg-[#131313]/80 border border-white/10 text-white hover:text-[#d7f250] hover:border-[#d7f250] hover:scale-110  transition-all hidden sm:block">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="absolute right-2 md:-right-30 z-20 p-4 rounded-full bg-[#131313]/80 border border-white/10 text-white hover:text-[#d7f250] hover:border-[#d7f250] hover:scale-110 transition-all hidden sm:block">
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </section>
  );
};