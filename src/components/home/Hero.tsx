"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Hero() {
    const [phase, setPhase] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Sequence timer
        const timers = [
            setTimeout(() => setPhase(1), 500),   // Start expansion
            setTimeout(() => setPhase(2), 2000),  // Fan out
            setTimeout(() => setPhase(3), 3500),  // Background change
            setTimeout(() => setPhase(4), 4500),  // Lift up & text reveal
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section
            className={cn(
                "relative h-screen w-full overflow-hidden flex flex-col items-center justify-center transition-colors duration-1000",
                phase >= 3 ? "bg-[#F5F5F0]" : "bg-black"
            )}
        >
            {/* Background Text Layer */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: phase >= 1 && phase < 3 ? 1 : 0,
                        scale: phase >= 2 ? 1.1 : 1
                    }}
                    transition={{ duration: 1 }}
                    className="text-[10vw] font-serif font-bold text-white/10 uppercase tracking-widest whitespace-nowrap"
                >
                    Priyanka Fashionvilla
                </motion.h1>
            </div>

            {/* Hero Content (Text) */}
            <div className="absolute top-1/4 w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-start z-10 gap-8 md:gap-0">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: phase < 3 ? 0.9 : 0, x: 0 }}
                    className="max-w-md text-white font-light text-center md:text-left text-base md:text-lg"
                >
                    <p>&ldquo;At Priyanka Fashionvilla, we craft dresses that move with grace and speak with style.&rdquo;</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: phase < 3 ? 1 : 0, x: 0 }}
                    className="text-center md:text-right"
                >
                    <h2 className="text-4xl md:text-6xl font-serif text-white uppercase leading-tight tracking-wider">
                        Designed<br />to Make<br />an Entrance.
                    </h2>
                </motion.div>
            </div>

            {/* Cards Container */}
            <div className="relative z-20 w-full h-full flex items-end justify-center pb-20">
                <div className="relative w-full max-w-6xl h-[60vh] flex items-end justify-center">
                    {products.map((product, index) => {
                        const isCenter = index === 2;
                        const offset = index - 2; // -2, -1, 0, 1, 2

                        // Mobile calculations
                        const mobileXSpread = 40;
                        const desktopXSpread = phase >= 2 ? 140 : 100;
                        const spread = isMobile ? mobileXSpread : desktopXSpread;

                        return (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{
                                    x: 0,
                                    y: 200,
                                    scale: 0.8,
                                    rotate: 0,
                                    zIndex: 10
                                }}
                                animate={{
                                    x: phase >= 1 ? offset * spread : 0,
                                    y: phase >= 4 ? (isMobile ? -150 : -250) : (phase >= 2 && !isCenter ? 40 : 0),
                                    scale: phase >= 2 && isCenter ? (isMobile ? 1.05 : 1.1) : (isMobile ? 0.9 : 1),
                                    rotate: phase >= 2 ? offset * (isMobile ? 3 : 5) : 0,
                                    zIndex: isCenter ? 50 : 40 - Math.abs(offset),
                                }}
                                transition={{
                                    duration: 1.2,
                                    ease: [0.4, 0.0, 0.2, 1]
                                }}
                                className={cn(
                                    "absolute bottom-0 w-[200px] h-[300px] md:w-[240px] md:h-[360px] rounded-xl overflow-hidden shadow-2xl origin-bottom",
                                    "border-4",
                                    phase >= 3 ? "border-white" : "border-white/20"
                                )}
                                style={{
                                    boxShadow: phase >= 3 ? "0 20px 40px rgba(0,0,0,0.1)" : "0 20px 40px rgba(0,0,0,0.5)"
                                }}
                            >
                                <div className="relative w-full h-full bg-gray-900">
                                    <Image
                                        src={product.cardImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                    {/* Minimal Label when in card mode */}
                                    <motion.div
                                        className="absolute bottom-4 left-4 text-white"
                                        animate={{ opacity: phase >= 4 ? 0 : 1 }}
                                    >
                                        <p className="text-xs font-medium uppercase tracking-wider">{product.category}</p>
                                        <p className="text-sm font-serif">{product.name}</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Final Product Info (Phase 4) */}
            <AnimatePresence>
                {phase >= 4 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="absolute bottom-20 w-full text-center z-30"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <h3 className="text-3xl font-serif text-black">New Collection 2026</h3>
                            <p className="text-gray-600 max-w-lg mx-auto">Discover the new standard of elegance. Handcrafted for moments that matter.</p>
                            <button className="px-8 py-3 bg-black text-white rounded-full uppercase tracking-wider text-sm hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95">
                                Explore Collection
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
