import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AvoraLogo from './AvoraLogo';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600&q=80',
    title: 'Executive Collection',
    subtitle: 'Precision tailoring for the modern leader',
    cta: '/shop?collection=executive',
  },
  {
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1600&q=80',
    title: 'Sports Collection',
    subtitle: 'Performance luxury engineered for movement',
    cta: '/shop?collection=sports',
  },
  {
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1600&q=80',
    title: 'Heritage Collection',
    subtitle: 'Crafted in Rwanda with African pride',
    cta: '/shop?collection=heritage',
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-primary">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 flex justify-center w-full"
        >
          <AvoraLogo to={null} size="hero" variant="stacked" dark className="mx-auto" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4">{slide.title}</p>
            <h1 className="font-heading font-bold text-3xl md:text-5xl mb-6 leading-tight">{slide.subtitle}</h1>
            <Link to={slide.cta} className="inline-block btn-gold">
              Shop Collection
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-300 ${i === index ? 'w-10 bg-gold' : 'w-4 bg-white/40'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
