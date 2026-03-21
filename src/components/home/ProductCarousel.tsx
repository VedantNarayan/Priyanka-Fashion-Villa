import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCarouselProps {
    products: Product[];
    activeIndex: number;
    setActiveIndex: (index: number) => void;
}

export default function ProductCarousel({ products, activeIndex, setActiveIndex }: ProductCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Initial scroll to center the active item (index 2) on mount
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Force initial scroll position without smooth behavior for instant alignment
        // We want index 2 to be centered.
        // Container padding is 50vw.
        // Item width is active: 350px + margin? No, initial state might be different.
        // Let's assume standard item width.

        const centerIndex = 2; // The index we want to center initially
        const cardWidth = window.innerWidth < 768 ? 280 : 350; // Approximated from CSS
        const gap = window.innerWidth < 768 ? 32 : 64; // mx-4 (16*2) or mx-8 (32*2)

        // Calculate the scroll position to center the item
        // content width before the item: 
        // (cardWidth + gap) * index
        // plus half the item width to get its center relative to start of content
        // minus viewport center (but padding handles that?)

        // Actually, with px-[50vw], scrollLeft=0 puts the START of the content at 50vw (center).
        // So the first item (index 0) is centered at scrollLeft = 0 + cardWidth/2?
        // Wait, snap-center handles alignment. We just need to scroll near it.

        // Better approach: Find the element and scroll to it.
        const targetCard = cardRefs.current[centerIndex];
        if (targetCard) {
            // We need to wait a tick for layout?
            setTimeout(() => {
                targetCard.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
            }, 0);
        }

    }, []);

    // Handle scroll and update active index
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const center = container.scrollLeft + container.clientWidth / 2;
            let closestIndex = 0;
            let minDistance = Infinity;

            cardRefs.current.forEach((card, index) => {
                if (!card) return;
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const distance = Math.abs(center - cardCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            if (closestIndex !== activeIndex) {
                setActiveIndex(closestIndex);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [activeIndex, setActiveIndex]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }} // Fade in the container background/ui
            className="fixed bottom-0 left-0 w-full h-[40vh] z-20 flex items-center bg-white/50 backdrop-blur-md border-t border-white/20"
        >
            <div
                ref={containerRef}
                className="w-full h-full flex items-center overflow-x-auto snap-x snap-mandatory px-[50vw] scrollbar-hide"
                style={{ paddingLeft: '50vw', paddingRight: '50vw' }} // Center the first and last items
            >
                {products.map((product, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <div
                            key={product.id}
                            ref={(el) => { cardRefs.current[index] = el; }}
                            className={cn(
                                "snap-center shrink-0 mx-4 md:mx-8 transition-all duration-500",
                                "w-[280px] md:w-[350px]",
                                isActive ? "opacity-100" : "opacity-60 hover:opacity-80"
                            )}
                        >
                            <Link href={`/product/${product.id}`} className="block">
                                <motion.div
                                    layoutId={`product-card-${product.id}`}
                                    className={cn(
                                        "relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl bg-gray-100",
                                        isActive ? "scale-100" : "scale-90"
                                    )}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <Image
                                        src={product.cardImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Handle wishlist logic here later
                                        }}
                                        className="absolute top-3 left-3 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-red-500 transition-colors"
                                    >
                                        <Heart size={18} />
                                    </button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="mt-4 text-center"
                                >
                                    <h3 className="font-serif text-lg text-black">{product.name}</h3>
                                    <div className="flex items-center justify-center gap-1 text-yellow-500 my-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600">€{product.price}</p>
                                </motion.div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Arrows (Optional, can replace with custom buttons) */}
            <div className="absolute bottom-10 right-10 flex gap-4">
                {/* Implemented in parent or keeping simple scroll for now */}
            </div>
        </motion.div>
    );
}
