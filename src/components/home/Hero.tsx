"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// High-end fashion placeholder images matching the layout aesthetics
const sampleImages = [
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop", // Center Hero
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop"
];

const carouselProducts = [
  { id: 1, name: "Starlight Sequin Mini", price: "₹140", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "Velvet Obsidian", price: "₹250", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "Ethereal Pleat Maxi", price: "₹160", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Noir Enchanté Gown", price: "₹120", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop" }
];

export default function Hero() {
  const [phase, setPhase] = useState(0); // 0: Intro, 1: Fan Out, 2: Flatten & Carousel

  useEffect(() => {
    // Step 1: Trigger the 3D Fan Out array after 1.2 seconds
    const timer1 = setTimeout(() => setPhase(1), 1200);
    // Step 2: Flatten layout and invert theme color map at 3.5 seconds
    const timer2 = setTimeout(() => setPhase(2), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Theme transitions based on current phase
  const isDark = phase < 2;
  const bgColor = isDark ? "#000000" : "#FDFBF7";
  const textColor = isDark ? "#FFFFFF" : "#1A1A1A";
  const accentColor = "#D4AF37"; // Signature Premium Gold

  // Dynamic variants for the 3D Card cluster
  const cardVariants = {
    "0": (index: number) => ({
      scaleX: index === 2 ? 0.4 : 0,
      scaleY: index === 2 ? 0.2 : 0,
      y: index === 2 ? 300 : 0,
      opacity: index === 2 ? 1 : 0,
      rotateY: 0,
      borderRadius: "40px",
    }),
    "1": (index: number) => ({
      scaleX: 1,
      scaleY: 1,
      scale: index === 2 ? 1.05 : 0.9,
      y: 0,
      x: (index - 2) * 170, 
      rotateY: (index - 2) * -22, // Generates matching mirror 3D angles
      opacity: 1,
      borderRadius: "24px",
      zIndex: index === 2 ? 30 : 10 + index,
      transition: { type: "spring" as const, stiffness: 50, damping: 14 }
    }),
    "2": (index: number) => ({
      scale: 0.65,
      x: (index - 2) * 115,
      y: -100, 
      rotateY: 0,
      opacity: 1,
      borderRadius: "16px",
      zIndex: 10,
      transition: { type: "spring" as const, stiffness: 75, damping: 18 }
    })
  };

  return (
    <motion.div 
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between transition-colors duration-1000 ease-out"
      style={{ backgroundColor: bgColor }}
    >
      {/* HEADER SECTION */}
      <header className="w-full flex justify-between items-center px-12 py-6 z-50">
        {/* Brand identity block */}
        <div className="flex flex-col items-center gap-0">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-pink-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm3.2 5.3c-.4-.7-1.1-1.3-2-1.3h-2.4c-.9 0-1.6.6-2 1.3L5.3 13.5c-.3.5-.1 1.2.4 1.5.5.3 1.2.1 1.5-.4L9 11.2v8.8c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-8.8l1.8 3.4c.3.5 1 .7 1.5.4.5-.3.7-1 .4-1.5l-3.5-6.2z"/>
            </svg>
            <span className="font-serif text-2xl font-bold tracking-wide transition-colors duration-700" style={{ color: isDark ? "#FFFFFF" : "#C48B9F" }}>
              Priyanka
            </span>
          </div>
          <span className="text-[9px] tracking-[0.3em] uppercase opacity-80 -mt-1 pl-6 transition-colors duration-700" style={{ color: isDark ? "#FFFFFF" : "#B3924B" }}>
            Fashionvilla
          </span>
        </div>

        {/* Action controls layout */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border flex items-center justify-center text-xs font-semibold transition-all" style={{ borderColor: isDark ? "#333" : "#E5E1DA", color: textColor }}>V</div>
          <button className="w-9 h-9 rounded-full border flex items-center justify-center text-xs transition-all" style={{ borderColor: isDark ? "#333" : "#E5E1DA", color: textColor }}>🔍</button>
          <button className="w-9 h-9 rounded-full border flex items-center justify-center text-xs transition-all" style={{ borderColor: isDark ? "#333" : "#E5E1DA", color: textColor }}>👜</button>
          <button className="px-5 py-2 text-[11px] uppercase tracking-[0.15em] rounded-full border font-medium transition-all" style={{ borderColor: isDark ? "#333" : "#E5E1DA", color: textColor }}>
            Contact
          </button>
        </div>
      </header>

      {/* TYPOGRAPHY INTERACTION LAYER */}
      <div className="absolute inset-x-0 top-1/3 -translate-y-1/2 flex justify-between items-start px-12 pointer-events-none z-20">
        {/* Left Column Narrative */}
        <p className="max-w-[280px] text-[13px] font-serif italic leading-relaxed transition-colors duration-1000 select-none text-left" style={{ color: isDark ? "#AAAAAA" : "#B3924B" }}>
          "At Priyanka Fashionvilla, we craft dresses that move with grace and speak with style."
        </p>

        {/* Right Main Stacked Headline */}
        <h1 className="text-right text-5xl md:text-6xl font-light tracking-[0.02em] leading-[1.1] transition-colors duration-1000 select-none" style={{ color: textColor }}>
          DESIGNED TO MAKE <br />
          <span className="font-normal tracking-[0.05em]" style={{ color: accentColor }}>AN ENTRANCE</span>
        </h1>
      </div>

      {/* CENTRAL 3D INTERACTIVE GALLERY ENGINE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ perspective: "1400px", transformStyle: "preserve-3d" }}>
        <div className="relative w-full max-w-4xl h-[480px] flex items-center justify-center">
          {sampleImages.map((src, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              animate={String(phase)}
              className="absolute w-[180px] h-[320px] overflow-hidden shadow-2xl origin-bottom bg-neutral-900 border border-white/10"
            >
              <img 
                src={src} 
                alt="Editorial Look" 
                className="w-full h-full object-cover pointer-events-none object-top"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* PHASE 3 BOTTOM PRODUCT CAROUSEL */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div 
            initial={{ y: 180, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 180, opacity: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }}
            className="w-full bg-transparent px-12 pb-8 pt-4 z-40"
          >
            <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
              {carouselProducts.map((product) => (
                <div key={product.id} className="relative group overflow-hidden rounded-lg bg-white shadow-md border border-neutral-200/60 p-2 flex flex-col justify-between h-[210px] transition-transform hover:scale-[1.02]">
                  <div className="w-full h-[140px] overflow-hidden rounded-md bg-neutral-100">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex justify-between items-center mt-2 px-1">
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-medium text-neutral-800">{product.name}</span>
                      <span className="text-[10px] text-yellow-600 mt-0.5">★★★★☆</span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
