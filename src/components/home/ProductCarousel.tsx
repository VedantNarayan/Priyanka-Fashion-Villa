import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "sonner";

interface ProductCarouselProps {
    products: Product[];
    activeIndex: number;
    setActiveIndex: (index: number) => void;
}

export default function ProductCarousel({ products, activeIndex, setActiveIndex }: ProductCarouselProps) {
    const { addItem: addToWishlist, removeItem, isInWishlist } = useWishlistStore();
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
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-0 left-0 w-full h-[32vh] md:h-[40vh] z-20 flex bg-[#FAF8F5]/65 backdrop-blur-xl border-t border-[#C5A880]/25 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]"
        >
            <div
                ref={containerRef}
                className="w-full h-full flex items-start overflow-x-auto snap-x snap-mandatory px-[50vw] scrollbar-hide pt-8 md:pt-3.5 pb-4"
                style={{ paddingLeft: '50vw', paddingRight: '50vw' }}
            >
                {products.map((product, index) => {
                    const isActive = index === activeIndex;
                    const inWishlist = isInWishlist(product.id);
                    const handleWishlistClick = async (e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (inWishlist) {
                            await removeItem(product.id);
                            toast.success("Removed from wishlist");
                        } else {
                            const added = await addToWishlist({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.cardImage
                            });
                            if (added) {
                                toast.success("Added to wishlist");
                            }
                        }
                    };

                    return (
                        <div
                            key={product.id}
                            ref={(el) => { cardRefs.current[index] = el; }}
                            className={cn(
                                "snap-center shrink-0 mx-3 md:mx-6 transition-all duration-500",
                                "w-[170px] md:w-[240px]",
                                isActive ? "opacity-100" : "opacity-60 hover:opacity-80"
                            )}
                        >
                            <Link href={`/product/${product.id}`} className="block">
                                <motion.div
                                    layoutId={`product-card-${product.id}`}
                                    animate={{ scale: isActive ? 1.0 : 0.9 }}
                                    className={cn(
                                        "relative rounded-none overflow-hidden shadow-2xl bg-stone-900 border border-[#C5A880]/20",
                                        "h-[22vh] md:h-[28vh]",
                                        isActive ? "border-[#D4AF37]/50" : ""
                                    )}
                                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                >
                                    <Image
                                        src={product.cardImage}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 200px, 240px"
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                    <button
                                        onClick={handleWishlistClick}
                                        className={cn(
                                            "absolute top-3 left-3 p-1.5 rounded-full backdrop-blur-sm border transition-all duration-300",
                                            inWishlist
                                                ? "bg-[#FAF8F5] text-gold-antique border-gold-antique"
                                                : "bg-[#121210]/40 text-stone-200 border-white/10 hover:bg-[#FAF8F5] hover:text-[#D4AF37]"
                                        )}
                                    >
                                        <Heart 
                                            size={14} 
                                            fill={inWishlist ? "currentColor" : "none"} 
                                            className="transition-transform duration-300 hover:scale-110" 
                                        />
                                    </button>
                                    {/* Product info overlay at bottom of card */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#121210]/90 via-[#121210]/55 to-transparent p-4 pt-10">
                                        <h3 className="font-serif text-sm text-stone-100 tracking-wide truncate">{product.name}</h3>
                                        <div className="flex items-center justify-between gap-1 mt-1">
                                            <div className="flex items-center gap-0.5 text-[#D4AF37]">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} fill={i < Math.floor(product.rating) ? "#D4AF37" : "none"} className="stroke-[#D4AF37]" />
                                                ))}
                                            </div>
                                            <span className="text-[#C5A880] font-serif text-xs font-semibold">₹{product.price}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
