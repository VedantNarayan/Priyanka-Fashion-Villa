"use client";

import Image from "next/image";
import { Product } from "@/types";
import { Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -10 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative w-[280px] shrink-0 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative h-[360px] w-full bg-gray-100 overflow-hidden">
                <Image
                    src={product.images?.[0] || product.image_url || product.cardImage}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-700 ease-out",
                        isHovered ? "scale-110" : "scale-100"
                    )}
                    sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                    }}
                    className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10"
                >
                    <Heart
                        size={16}
                        className={cn("transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-900")}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 bg-white relative z-20">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="font-serif text-lg text-gray-900 leading-tight">{product.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                    </div>
                </div>

                <p className="font-medium text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
        </motion.div>
    );
}
