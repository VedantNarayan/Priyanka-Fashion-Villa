"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProductReviews from "./ProductReviews";

export default function ProductDetail({ product }: { product: Product }) {
    const router = useRouter();
    const { addItem, openCart } = useCartStore();
    const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

    // Default to first option if available, otherwise empty string or "M"/"Default"
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default");

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.cardImage,
            quantity: 1,
            size: selectedSize,
            color: selectedColor,
        });
        openCart();
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">

                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-stone-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] relative bg-stone-100 rounded-sm overflow-hidden group">
                            <Image
                                src={product.modelImage}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            {/* Hover Toggle (Optional: Show Card Image on Hover) */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-stone-50">
                                <Image
                                    src={product.cardImage}
                                    alt="Product Detail"
                                    fill
                                    className="object-contain p-8"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-[3/4] relative bg-stone-50 rounded-sm overflow-hidden">
                                <Image src={product.cardImage} alt="Detail 1" fill className="object-cover opacity-90 hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="aspect-[3/4] relative bg-stone-900 rounded-sm overflow-hidden flex items-center justify-center text-white/50 text-xs uppercase tracking-widest">
                                More Views Coming Soon
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col h-full pt-4">
                        <div className="mb-2 uppercase tracking-wider text-xs font-medium text-stone-500">{product.category}</div>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-2xl md:text-3xl font-light">${product.price}</span>
                            <div className="flex items-center gap-1 text-amber-400 text-sm">
                                <Star fill="currentColor" size={14} />
                                <span className="text-black font-medium ml-1">{product.rating || 0}</span>
                                <span className="text-stone-400 font-normal ml-1">({product.review_count || 0} Reviews)</span>
                            </div>
                        </div>

                        <p className="text-stone-600 leading-relaxed mb-10 max-w-md">
                            {product.description} Crafted with premium materials designed to make you feel as exceptional as you look.
                        </p>

                        <div className="space-y-8 mb-10 flex-1">
                            {/* Color Selector */}
                            <div>
                                <span className="block text-xs uppercase tracking-wider font-medium mb-3">Color: <span className="text-stone-500">{selectedColor}</span></span>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                                                selectedColor === color
                                                    ? "border-black ring-1 ring-black ring-offset-2"
                                                    : "border-stone-200 hover:border-stone-400"
                                            )}
                                            title={color}
                                        >
                                            <div className={cn("w-8 h-8 rounded-full",
                                                color === "Black" ? "bg-black" :
                                                    color === "Midnight Blue" ? "bg-blue-950" :
                                                        color === "Cream" ? "bg-[#FFFDD0] border border-stone-100" :
                                                            "bg-gray-300" // Default/Silver
                                            )} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="block text-xs uppercase tracking-wider font-medium">Size: <span className="text-stone-500">{selectedSize}</span></span>
                                    <button className="text-xs uppercase tracking-wider underline text-stone-400 hover:text-black">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "h-12 border flex items-center justify-center text-sm transition-all hover:bg-stone-50",
                                                selectedSize === size
                                                    ? "border-black bg-black text-white hover:bg-black"
                                                    : "border-stone-200 text-stone-600"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white h-14 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-3"
                            >
                                <ShoppingBag size={18} />
                                Add to Shopping Bag
                            </button>
                            <button
                                onClick={() => {
                                    addToWishlist({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.cardImage
                                    });
                                    toast.success("Added to Wishlist");
                                }}
                                className={cn(
                                    "w-full border h-14 uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-2 group",
                                    isInWishlist(product.id)
                                        ? "border-black bg-black text-white hover:bg-stone-800"
                                        : "border-stone-200 hover:border-black"
                                )}
                            >
                                <Heart
                                    size={18}
                                    className={cn(
                                        "transition-colors",
                                        isInWishlist(product.id) ? "fill-white" : "group-hover:fill-black"
                                    )}
                                />
                                {isInWishlist(product.id) ? "Saved to Wishlist" : "Add to Wishlist"}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-stone-100">
                            <div className="flex items-center gap-3 text-sm text-stone-500">
                                <Truck size={18} strokeWidth={1.5} />
                                <span className="text-xs lg:text-sm">Free Shipping & Returns</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-stone-500">
                                <ShieldCheck size={18} strokeWidth={1.5} />
                                <span className="text-xs lg:text-sm">Secure Checkout</span>
                            </div>
                        </div>

                    </div>
                </div>

                <ProductReviews productId={product.id} />
            </div>
        </div>
    );
}
