import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIConfig } from '../stores/uiConfigStore';

const BannerCarousel: React.FC = () => {
  const { config } = useUIConfig();
  const BANNERS = config.banners;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Reset index if banners change
  useEffect(() => {
    setCurrentIndex(0);
  }, [BANNERS.length]);

  useEffect(() => {
    if (BANNERS.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, BANNERS.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  if (BANNERS.length === 0) return null;

  const currentBanner = BANNERS[currentIndex];

  return (
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-96 md:h-96 lg:h-96 bg-gray-200 overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute w-full h-full"
        >
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-4">
              {currentBanner.badge && (
                <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                  {currentBanner.badge}
                  {currentBanner.discount && ` • ${currentBanner.discount}`}
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{currentBanner.title}</h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100">{currentBanner.subtitle}</p>
              <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {currentBanner.cta}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
      >
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
      >
        <ChevronRight className="w-6 h-6 text-gray-900" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
