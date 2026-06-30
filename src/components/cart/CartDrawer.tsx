"use client";

import { useCartStore } from "@/store/cart";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-obsidian z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-silk-ivory z-[70] shadow-2xl flex flex-col text-obsidian border-l border-gold-zari/20 text-left"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-gold-zari/15">
                            <h2 className="font-serif text-xl flex items-center gap-2 uppercase tracking-wide">
                                Shopping Bag <span className="text-sm font-sans text-rose-ash/60">({items.length})</span>
                            </h2>
                            <button
                                onClick={closeCart}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100/50 transition-colors text-gold-zari hover:text-burgundy"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-alabaster rounded-full flex items-center justify-center text-gold-zari/40 border border-gold-zari/10">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <p className="text-rose-ash/60 font-serif italic text-sm">Your bag is empty.</p>
                                    <button
                                        onClick={closeCart}
                                        className="text-burgundy hover:text-gold-antique underline text-xs uppercase tracking-widest font-semibold transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 border border-gold-zari/10 bg-alabaster/30 rounded-sm">
                                        <div className="relative w-20 h-28 flex-shrink-0 bg-neutral-100 rounded-sm overflow-hidden border border-gold-zari/10">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-serif text-sm font-semibold text-obsidian line-clamp-1">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-stone-400 hover:text-burgundy transition-colors p-0.5"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] uppercase tracking-wider text-gold-zari font-medium mt-1">
                                                    {item.color} / {item.size}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-gold-zari/20 bg-alabaster rounded-full">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100/50 rounded-l-full transition-colors text-stone-500"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="text-xs w-4 text-center font-semibold text-rose-ash">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100/50 rounded-r-full transition-colors text-stone-500"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>
                                                <p className="font-serif text-sm font-semibold text-rose-ash">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gold-zari/25 bg-alabaster">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="uppercase tracking-widest text-xs text-gold-zari font-semibold">Subtotal</span>
                                    <span className="font-serif text-lg font-bold text-obsidian">₹{subtotal}</span>
                                </div>
                                <p className="text-[10px] text-stone-400 mb-6 text-center font-serif italic">
                                    Complimentary premium shipping & luxury packaging included.
                                </p>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="block w-full bg-burgundy text-white text-center py-4 uppercase tracking-widest text-xs font-semibold hover:bg-burgundy-soft transition-colors border border-burgundy shadow-sm"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
