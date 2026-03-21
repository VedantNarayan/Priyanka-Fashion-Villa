"use client";

import { products } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function ProductStrip() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 320; // card width + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto py-12">
            <div className="flex items-center justify-between mb-8 px-6">
                <h2 className="text-3xl font-serif text-black uppercase tracking-wide">Featured Collection</h2>

                {/* Navigation Arrows */}
                <div className="flex gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto px-6 pb-8 snap-x snap-mandatory no-scrollbar"
            >
                {products.map((product) => (
                    <div key={product.id} className="snap-start shrink-0">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
