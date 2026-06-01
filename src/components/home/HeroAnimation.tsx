import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { products } from "@/lib/data";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroAnimationProps {
    onCardsLanded: () => void;   // Fires when cards are ready and frames fade out
    onComplete: () => void;       // Fires after fade-out completes to unmount
}

export default function HeroAnimation({ onCardsLanded, onComplete }: HeroAnimationProps) {
    const [phase, setPhase] = useState(0);
    const [carouselSpacing, setCarouselSpacing] = useState(288);

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
            setTimeout(() => setPhase(1), 500),   // Center card rises
            setTimeout(() => setPhase(2), 1500),  // Cards fan out
            setTimeout(() => setPhase(3), 2500),  // Background fades black → ivory
            setTimeout(() => {
                setPhase(4);                       // Cards slide down to bottom strip
                onCardsLanded();                   // Signal parent to mount real carousel and model display
            }, 3500),
            setTimeout(() => setPhase(5), 5000),   // Fade out intro cards overlay
            setTimeout(() => onComplete(), 5800),  // Unmount overlay
        ];
        return () => timers.forEach(clearTimeout);
    }, [onCardsLanded, onComplete]);

    return (
        <div className={cn(
            "fixed inset-0 z-40 flex flex-col items-center justify-center transition-colors duration-[1200ms] ease-out-expo",
            phase >= 4 ? "pointer-events-none" : "pointer-events-auto",
            phase >= 3 ? "bg-[#FAF8F5]" : "bg-[#121210]"
        )}>
            {/* Intro Text - Fades out in Phase 3 */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: phase >= 3 ? 0 : 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div className="absolute top-1/4 w-full px-12 flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-6 md:gap-12">
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-md font-serif italic text-lg md:text-xl text-[#C5A880] tracking-wide"
                    >
                        &ldquo;At Priyanka Fashionvilla, we craft dresses that move with grace and speak with style.&rdquo;
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl font-serif uppercase tracking-[0.15em] text-left md:text-right leading-tight md:leading-none text-[#FAF8F5]"
                    >
                        Designed<br className="hidden md:block" /> To Make<br /> An <span className="text-[#C5A880]">Entrance</span>
                    </motion.h1>
                </div>
            </motion.div>

            {/* Animated Cards */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{
                    // Phase 4: Slide all fanned cards down to the bottom carousel center
                    y: phase >= 4 ? "30vh" : 0,
                    // Phase 5: Fade out cards smoothly
                    opacity: phase >= 5 ? 0 : 1,
                }}
                transition={{ 
                    y: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.8, ease: "easeInOut" }
                }}
            >
                {products.map((product, index) => {
                    const isCenter = index === 2;
                    const offset = index - 2;

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
                                stiffness: 55,
                                damping: 15,
                                mass: 0.8,
                            }}
                            className={cn(
                                "absolute rounded-none overflow-hidden border flex justify-center items-end origin-bottom transition-all duration-500 bg-stone-900 border-[#C5A880]/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
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
                                />
                                {/* Bottom vignette overlay matching ProductCarousel cards */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#121210]/90 via-[#121210]/55 to-transparent p-4 pt-10">
                                    <h3 className="font-serif text-sm text-stone-100 tracking-wide truncate">{product.name}</h3>
                                    <div className="flex items-center justify-between gap-1 mt-1">
                                        <div className="flex items-center gap-0.5 text-[#D4AF37]">
                                            <span className="text-[10px] text-[#D4AF37] font-serif uppercase tracking-widest">Luxury Wear</span>
                                        </div>
                                        <span className="text-[#C5A880] font-serif text-xs font-semibold">₹{product.price}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
