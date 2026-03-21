import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { products } from "@/lib/data";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroAnimationProps {
    onComplete: () => void;
}

export default function HeroAnimation({ onComplete }: HeroAnimationProps) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Sequence timer aligned with Priyanka Fashionvilla specifications
        const timers = [
            setTimeout(() => setPhase(1), 500),   // Single card appears
            setTimeout(() => setPhase(2), 1500),  // Expand/Multiply
            setTimeout(() => setPhase(3), 2500),  // Background change (Black -> Cream)
            setTimeout(() => {
                setPhase(4); // Models emerge (Handled by parent/ModelDisplay turning on)
                onComplete();
            }, 3500),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    // Center product for the single card phase
    const centerProduct = products[2];

    return (
        <div className={cn(
            "fixed inset-0 z-40 flex flex-col items-center justify-center transition-colors duration-1000 pointer-events-none",
            phase >= 3 ? "bg-transparent" : "bg-black" // Becomes transparent to reveal main bg
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
                        "At Priyanka Fashionvilla, we craft dresses that move with grace and speak with style."
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
            {/* We only render this layer during phases 0-3. In phase 4, the real carousel takes over visually OR we keep this as a rigid underlay? 
                Actually, getting the cards to line up perfectly with a scrolling carousel is hard.
                Strategy: This component animates the entrance. When it finishes (Phase 4), it hides, and the real layout is revealed underneath.
            */}
            <motion.div
                className="relative w-full max-w-6xl h-[60vh] flex items-end justify-center"
                animate={{ opacity: phase >= 4 ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            >
                {products.map((product, index) => {
                    const isCenter = index === 2;
                    const offset = index - 2;

                    // Initial state: Only center card visible (or all stacked)
                    // Phase 1: Center card moves up
                    // Phase 2: Fan out

                    return (
                        <motion.div
                            layoutId={`product-card-${product.id}`}
                            key={product.id}
                            initial={{ y: 500, opacity: 0, scale: 0.8 }}
                            animate={{
                                y: phase >= 1 ? 0 : 500,
                                opacity: phase >= 1 || isCenter ? 1 : 0, // Show others only after phase 1? Or all stack up?
                                x: phase >= 2 ? offset * 140 : 0, // Fan out
                                scale: phase >= 2 && isCenter ? 1.1 : 1,
                                zIndex: isCenter ? 50 : 40 - Math.abs(offset),
                            }}
                            transition={{ duration: 1, ease: [0.4, 0.0, 0.2, 1] }}
                            className={cn(
                                "absolute bottom-0 w-[240px] h-[360px] rounded-xl overflow-hidden shadow-2xl origin-bottom bg-gray-200 border-4 border-white",
                            )}
                        >
                            <Image
                                src={product.cardImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
