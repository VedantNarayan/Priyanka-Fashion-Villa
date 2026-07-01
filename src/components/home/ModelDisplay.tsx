import { motion } from "framer-motion";
import { Product } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ModelDisplayProps {
    products: Product[];
    activeIndex: number;
    show: boolean; // Only show after intro phase
}

export default function ModelDisplay({ products, activeIndex, show }: ModelDisplayProps) {
    const [carouselSpacing, setCarouselSpacing] = useState(180);

    useEffect(() => {
        const handleResize = () => {
            setCarouselSpacing(window.innerWidth < 768 ? 90 : 180);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!show) return null;

    return (
        <div className="absolute top-0 left-0 w-full h-[68vh] md:h-[60vh] z-10 flex items-end justify-center pointer-events-none overflow-hidden">
            <div className="relative w-full max-w-[1200px] h-full flex justify-center items-end">
                {products.map((product, idx) => {
                    const offset = idx - activeIndex;
                    const isCenter = idx === activeIndex;
                    const isVisible = Math.abs(offset) <= 2;

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: offset * carouselSpacing, scale: isCenter ? 1.0 : 0.8 }}
                            animate={{
                                opacity: isVisible ? 1 : 0,
                                x: offset * carouselSpacing,
                                scale: isCenter ? 1.0 : 0.8,
                                zIndex: 10 - Math.abs(offset),
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 160,
                                damping: 22,
                                mass: 0.6,
                            }}
                            className="absolute bottom-0 flex justify-center items-end origin-bottom h-[52vh] md:h-[55vh] w-[200px] md:w-[280px]"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={product.modelImage}
                                    alt={`Model for ${product.name}`}
                                    fill
                                    sizes="(max-width: 768px) 200px, 280px"
                                    className="object-contain object-bottom"
                                    priority={idx === activeIndex}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
