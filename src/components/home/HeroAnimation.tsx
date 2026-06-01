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
    const [carouselSpacing, setCarouselSpacing] = useState(180);

    useEffect(() => {
        const handleResize = () => {
            setCarouselSpacing(window.innerWidth < 768 ? 100 : 180);
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
                setPhase(4);                       // White borders & shadows fade out
                onCardsLanded();                   // Mount real content underneath
            }, 3500),
            setTimeout(() => setPhase(5), 5000),   // Fade out intro layer completely
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
                    opacity: phase >= 5 ? 0 : 1,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
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
                                x: phase >= 2 ? offset * carouselSpacing : 0,
                                scale: phase >= 2 && isCenter ? 1.1 : 0.9,
                                // Animate the card borders/shadows/background to transparent in Phase 4
                                backgroundColor: phase >= 4 ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 1)",
                                borderColor: phase >= 4 ? "rgba(197, 168, 128, 0)" : "rgba(197, 168, 128, 0.15)",
                                boxShadow: phase >= 4 ? "none" : "0 20px 40px rgba(0, 0, 0, 0.12)",
                                zIndex: isCenter ? 50 : 40 - Math.abs(offset),
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 60,
                                damping: 16,
                                mass: 0.8,
                            }}
                            className={cn(
                                "absolute rounded-2xl overflow-hidden border flex justify-center items-end origin-bottom transition-all duration-500",
                                isCenter 
                                    ? "h-[50vh] md:h-[55vh] w-[200px] md:w-[280px]" 
                                    : "h-[40vh] md:h-[45vh] w-[180px] md:w-[240px]"
                            )}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={product.modelImage}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 200px, 280px"
                                    className="object-contain object-bottom transition-transform duration-[2000ms]"
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
