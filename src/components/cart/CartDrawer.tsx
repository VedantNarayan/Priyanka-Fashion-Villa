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
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col text-black"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-stone-100">
                            <h2 className="font-serif text-xl flex items-center gap-2">
                                Shopping Bag <span className="text-sm font-sans text-stone-500">({items.length})</span>
                            </h2>
                            <button
                                onClick={closeCart}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
                                        <ShoppingBag size={32} />
                                    </div>
                                    <p className="text-stone-500">Your bag is empty.</p>
                                    <button
                                        onClick={closeCart}
                                        className="text-black underline text-sm uppercase tracking-wide hover:text-stone-600"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-28 flex-shrink-0 bg-stone-50 rounded-md overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-stone-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-stone-500 mt-1">
                                                    {item.color} / {item.size}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-stone-200 rounded-full">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-l-full transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-r-full transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <p className="font-medium">${item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-stone-100 bg-stone-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="uppercase tracking-wide text-sm text-stone-500">Subtotal</span>
                                    <span className="font-medium text-lg">${subtotal}</span>
                                </div>
                                <p className="text-xs text-stone-400 mb-6 text-center">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="block w-full bg-black text-white text-center py-4 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors"
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
