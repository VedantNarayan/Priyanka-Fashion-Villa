import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ModelDisplayProps {
    products: Product[];
    activeIndex: number;
    show: boolean; // Only show after intro phase
}

export default function ModelDisplay({ products, activeIndex, show }: ModelDisplayProps) {
    // We display 5 models. Center is index 2.
    // Calculate which products map to the 5 model positions.
    // positions: 0 (Left-2), 1 (Left-1), 2 (Center), 3 (Right-1), 4 (Right-2)
    const getProductForPosition = (posIndex: number) => {
        const offset = posIndex - 2; // -2, -1, 0, 1, 2
        const productIndex = activeIndex + offset;
        if (productIndex < 0 || productIndex >= products.length) return null;
        return products[productIndex];
    };

    if (!show) return null;

    return (
        <div className="absolute top-0 left-0 w-full h-[60vh] z-10 flex items-end justify-center pointer-events-none">
            <div className="relative w-full max-w-[1400px] h-full flex justify-center items-end px-0 md:px-12">
                {[0, 1, 2, 3, 4].map((posIndex) => {
                    const product = getProductForPosition(posIndex);
                    const isCenter = posIndex === 2;

                    // On mobile, only show center and immediate neighbors (1, 2, 3)
                    // and hide the outer ones (0, 4) or make them very small
                    const isVisibleOnMobile = posIndex >= 1 && posIndex <= 3;

                    return (
                        <div
                            key={posIndex}
                            className={cn(
                                "relative flex flex-col items-center justify-end h-full transition-all duration-500",
                                !isVisibleOnMobile ? "hidden md:flex" : "flex"
                            )}
                            style={{ width: isCenter ? (isVisibleOnMobile ? '40%' : '25%') : (isVisibleOnMobile ? '25%' : '18%') }}
                        >
                            <AnimatePresence mode="popLayout">
                                {product && (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="absolute bottom-0 w-full flex justify-center"
                                    >
                                        <div className={`relative ${isCenter ? 'h-[55vh]' : 'h-[45vh]'} w-full transition-all duration-500`}>
                                            <Image
                                                src={product.modelImage}
                                                alt={`Model for ${product.name}`}
                                                fill
                                                sizes={isCenter ? "(max-width: 768px) 40vw, 25vw" : "(max-width: 768px) 25vw, 18vw"}
                                                className="object-contain object-bottom"
                                                priority={true}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
