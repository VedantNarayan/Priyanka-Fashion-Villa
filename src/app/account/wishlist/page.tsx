"use client";

import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();
    const { addItem, openCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleMoveToCart = async (item: any) => {
        // Query actual product for sizes and colors
        const { data: product } = await supabase
            .from('products')
            .select('sizes, colors')
            .eq('id', item.id)
            .single();

        const size = product?.sizes?.[0] || "M";
        const color = product?.colors?.[0] || "Default";

        addItem({
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            size,
            color
        });
        removeItem(item.id);
        openCart();
    };

    return (
        <div className="bg-white p-8 rounded-sm shadow-sm min-h-[500px]">
            <h2 className="font-serif text-2xl mb-6">My Wishlist</h2>

            {items.length === 0 ? (
                <div className="text-center py-20 text-stone-500">
                    <p>Your wishlist is empty.</p>
                    <Link href="/shop" className="inline-block mt-4 uppercase text-xs tracking-widest border-b border-black text-black">
                        Browse Collection
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="group relative border border-stone-100 rounded-sm overflow-hidden">
                            <div className="relative aspect-[3/4] bg-stone-50">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full text-stone-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-serif text-lg truncate">{item.name}</h3>
                                <p className="text-stone-500 mb-4">₹{item.price}</p>
                                <button
                                    onClick={() => handleMoveToCart(item)}
                                    className="w-full py-2 border border-black text-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={14} /> Move to Bag
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
