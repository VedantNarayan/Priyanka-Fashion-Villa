import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { products } from "@/lib/data";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroAnimationProps {
    onCardsLanded: () => void;   // Fires when cards reach the bottom strip — show real carousel
    onComplete: () => void;       // Fires after fade-out — unmount this component
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
            setTimeout(() => setPhase(1), 500),   // Cards rise from bottom
            setTimeout(() => setPhase(2), 1500),  // Fan out horizontally
            setTimeout(() => setPhase(3), 2500),  // Background fades black → cream
            setTimeout(() => {
                setPhase(4);                       // Cards slide down to bottom strip & hold
                onCardsLanded();                   // Signal parent to show real content underneath
            }, 3500),
            setTimeout(() => setPhase(5), 5000),   // Fade out intro cards (real carousel is visible behind)
            setTimeout(() => onComplete(), 5800),  // Unmount after fade-out completes
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
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                    // Phase 4+: slide the entire card group down to the bottom strip
                    y: phase >= 4 ? "30vh" : 0,
                    // Phase 5: fade out so the real carousel is visible underneath
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
                                "absolute w-[200px] md:w-[240px] h-[28vh] rounded-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] origin-bottom bg-stone-900 border border-[#C5A880]/30",
                            )}
                        >
                            <Image
                                src={product.cardImage}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 200px, 240px"
                                className="object-cover transition-transform duration-[2000ms] hover:scale-105"
                            />
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
