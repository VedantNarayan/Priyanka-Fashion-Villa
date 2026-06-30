import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroAnimationProps {
    products: Product[];
    settings?: Record<string, any>;
    onCardsLanded: () => void;   // Fires when cards are ready and frames fade out
    onComplete: () => void;       // Fires after fade-out completes to unmount
}

export default function HeroAnimation({ products, settings, onCardsLanded, onComplete }: HeroAnimationProps) {
    const [phase, setPhase] = useState(0);
    const [carouselSpacing, setCarouselSpacing] = useState(288);

    const cms = settings?.homepage_cms || {};
    const heroQuote = cms.hero?.quote || "At Priyanka Fashionvilla, we craft dresses that move with grace and speak with style.";
    const heroTitle1 = cms.hero?.title1 || "Designed";
    const heroTitle2 = cms.hero?.title2 || "To Make";
    const heroTitle3 = cms.hero?.title3 || "An Entrance";
    const heroTitleAccent = cms.hero?.titleAccent || "Entrance";

    useEffect(() => {
        const handleResize = () => {
            setCarouselSpacing(window.innerWidth < 768 ? 212 : 288);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),   // Center card rises
            setTimeout(() => setPhase(2), 900),   // Cards fan out
            setTimeout(() => setPhase(3), 1500),  // Background fades burgundy → ivory
            setTimeout(() => {
                setPhase(4);                       // Cards slide down to bottom strip
                onCardsLanded();                   // Signal parent to mount real carousel and model display
            }, 2100),
            // Unmount overlay exactly at 3000ms
            setTimeout(() => onComplete(), 3000),  
        ];
        return () => timers.forEach(clearTimeout);
    }, [onCardsLanded, onComplete]);

    const centerIndex = Math.floor(products.length / 2);

    return (
        <motion.div 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "fixed inset-0 z-40 flex flex-col items-center justify-center transition-colors duration-[800ms] ease-out-expo",
                phase >= 4 ? "pointer-events-none" : "pointer-events-auto",
                phase >= 3 ? "bg-alabaster" : "bg-burgundy"
            )}
        >
            {/* Intro Text - Fades out in Phase 3 */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: phase >= 3 ? 0 : 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div className="absolute top-1/4 w-full px-12 flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-6 md:gap-12">
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-md font-serif italic text-lg md:text-xl text-gold-zari tracking-wide"
                    >
                        &ldquo;{heroQuote}&rdquo;
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl font-serif uppercase tracking-[0.15em] text-left md:text-right leading-tight md:leading-none text-alabaster"
                    >
                        {heroTitle1}<br className="hidden md:block" /> {heroTitle2}<br /> {heroTitle3.includes(heroTitleAccent) ? heroTitle3.replace(heroTitleAccent, "") : heroTitle3} <span className="text-gold-antique">{heroTitleAccent}</span>
                    </motion.h1>
                </div>
            </motion.div>

            {/* Animated Cards */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{
                    // Phase 4: Slide all fanned cards down to the bottom carousel center
                    y: phase >= 4 ? "30vh" : 0,
                }}
                transition={{ 
                    duration: 0.9, 
                    ease: [0.16, 1, 0.3, 1] 
                }}
            >
                {products.map((product, index) => {
                    const isCenter = index === centerIndex;
                    const offset = index - centerIndex;

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ y: 500, opacity: 0, scale: 0.8 }}
                            animate={{
                                y: phase >= 1 ? 0 : 500,
                                opacity: phase >= 1 || isCenter ? 1 : 0,
                                x: phase >= 4 
                                    ? offset * carouselSpacing
                                    : (phase >= 2 ? offset * 150 : 0),
                                scale: phase >= 4
                                    ? (isCenter ? 1.0 : 0.9)
                                    : (phase >= 2 && isCenter ? 1.15 : 0.95),
                                zIndex: isCenter ? 50 : 40 - Math.abs(offset),
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 85,
                                damping: 16,
                                mass: 0.7,
                            }}
                            className={cn(
                                "absolute rounded-none overflow-hidden border flex justify-center items-end origin-bottom transition-all duration-500 bg-obsidian border-gold-zari/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
                                isCenter 
                                    ? "h-[28vh] w-[200px] md:w-[240px]" 
                                    : "h-[28vh] w-[200px] md:w-[240px]"
                            )}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={product.cardImage}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 200px, 240px"
                                    className="object-cover"
                                    priority={isCenter}
                                />
                                {/* Bottom vignette overlay matching ProductCarousel cards */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-obsidian/90 via-obsidian/55 to-transparent p-4 pt-10">
                                    <h3 className="font-serif text-sm text-alabaster tracking-wide truncate">{product.name}</h3>
                                    <div className="flex items-center justify-between gap-1 mt-1">
                                        <div className="flex items-center gap-0.5 text-gold-antique">
                                            <span className="text-[10px] text-gold-antique font-serif uppercase tracking-widest">Luxury Wear</span>
                                        </div>
                                        <span className="text-gold-zari font-serif text-xs font-semibold">₹{product.price}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
