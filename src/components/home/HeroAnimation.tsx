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
            "fixed inset-0 z-40 flex flex-col items-center justify-center transition-colors duration-1000",
            phase >= 5 ? "pointer-events-none" : "pointer-events-none",
            phase >= 3 ? "bg-transparent" : "bg-black"
        )}>
            {/* Intro Text - Fades out in Phase 3 */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: phase >= 3 ? 0 : 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div className="absolute top-1/4 w-full px-12 flex justify-between text-white">
                    <motion.p
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-md font-light text-lg"
                    >
                        &ldquo;At Priyanka Fashionvilla, we craft dresses that move with grace and speak with style.&rdquo;
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-6xl font-serif uppercase tracking-widest text-right leading-none"
                    >
                        Designed<br />To Make<br />An Entrance
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
                transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
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
                                x: phase >= 2 ? offset * 140 : 0,
                                scale: phase >= 2 && isCenter ? 1.1 : 1,
                                zIndex: isCenter ? 50 : 40 - Math.abs(offset),
                            }}
                            transition={{ duration: 1, ease: [0.4, 0.0, 0.2, 1] }}
                            className={cn(
                                "absolute w-[200px] h-[28vh] rounded-lg overflow-hidden shadow-2xl origin-bottom bg-gray-200 border-2 border-white/50",
                            )}
                        >
                            <Image
                                src={product.cardImage}
                                alt={product.name}
                                fill
                                sizes="200px"
                                className="object-cover"
                            />
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
