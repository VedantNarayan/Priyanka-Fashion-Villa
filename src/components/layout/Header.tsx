"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import CartCount from "../cart/CartCount";
import ProfileDropdown from "./ProfileDropdown";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
    theme?: 'light' | 'dark';
}

export default function Header({ theme = 'dark' }: HeaderProps) {
    const isDark = theme === 'dark';
    const { toggleCart } = useCartStore();
    const { syncFromDb, clearWishlist } = useWishlistStore();

    useEffect(() => {
        syncFromDb(); // initial sync wishlist
        useCartStore.getState().syncFromDb(); // initial sync cart

        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                syncFromDb();
                useCartStore.getState().syncFromDb();
            } else if (event === 'SIGNED_OUT') {
                clearWishlist();
                useCartStore.getState().clearCart();
            }
        });
        return () => subscription.unsubscribe();
    }, [syncFromDb, clearWishlist]);

    return (
        <header className={cn(
            "fixed top-0 left-0 w-full z-50 transition-all duration-[1200ms] ease-out-expo border-b",
            isDark 
                ? "bg-[#0D0C0B]/40 backdrop-blur-md border-gold-zari/15 shadow-[0_4px_30px_rgba(0,0,0,0.3)]" 
                : "bg-[#FCFAF7]/80 backdrop-blur-xl border-gold-zari/15 shadow-[0_4px_30px_rgba(197,168,128,0.06)]"
        )}>
            <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                {/* Big Size Icon at Left Top Corner */}
                <Link href="/" className="flex items-center z-10">
                    <Image 
                        src="/priyanka-icon.png" 
                        alt="Priyanka's Fashionvilla Icon" 
                        width={120} 
                        height={120} 
                        className="h-16 md:h-20 w-auto object-contain scale-[2.1] origin-left translate-x-2 md:translate-x-4 hover:scale-[2.2] transition-transform duration-300"
                        priority
                    />
                </Link>

                {/* Big Size Logo in Center of Header */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10">
                    <Link href="/" className="flex items-center">
                        <Image 
                            src="/priyanka-logo.png" 
                            alt="Priyanka's Fashionvilla Logo" 
                            width={320} 
                            height={120} 
                            className="h-16 md:h-20 w-auto object-contain scale-[2.4] hover:scale-[2.5] transition-transform duration-300"
                            priority
                        />
                    </Link>
                </div>

                {/* Navigation Icons */}
                <nav className="flex items-center gap-2.5 md:gap-4 z-10">
                    {/* User Icon / Profile Dropdown */}
                    <ProfileDropdown isDark={isDark} />

                    {/* Custom Search Icon */}
                    <button className={cn(
                        "w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-500 group",
                        isDark 
                            ? "border-gold-zari/25 text-alabaster/90 hover:border-gold-antique hover:text-gold-antique hover:bg-gold-antique/5" 
                            : "border-gold-zari/35 text-obsidian/90 hover:border-gold-antique hover:text-gold-antique hover:bg-burgundy/5"
                    )}>
                        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current group-hover:scale-105 transition-transform duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16" y2="16" />
                        </svg>
                    </button>

                    {/* Custom Ribbon Shopping Bag Icon */}
                    <button
                        onClick={toggleCart}
                        className={cn(
                            "w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-500 group relative",
                            isDark 
                                ? "border-gold-zari/25 text-alabaster/90 hover:border-gold-antique hover:text-gold-antique hover:bg-gold-antique/5" 
                                : "border-gold-zari/35 text-obsidian/90 hover:border-gold-antique hover:text-gold-antique hover:bg-burgundy/5"
                        )}>
                        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current group-hover:scale-105 transition-transform duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 8 V19 C6 20.1 6.9 21 8 21 H16 C17.1 21 18 20.1 18 19 V8" />
                            <path d="M9 8 C9 4.5 10 3 12 3 C14 3 15 4.5 15 8" />
                            <path d="M12 8 C11 8 10 7.5 10 6.5 C10 5.5 12 5 12 8 Z" fill="currentColor" opacity="0.25" />
                            <path d="M12 8 C13 8 14 7.5 14 6.5 C14 5.5 12 5 12 8 Z" fill="currentColor" opacity="0.25" />
                        </svg>
                        <CartCount isDark={isDark} />
                    </button>

                    {/* Custom Contact Envelope Button */}
                    <Link
                        href="/contact"
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 md:px-5 rounded-full border text-xs md:text-sm uppercase tracking-widest transition-all duration-500 group",
                            isDark 
                                ? "border-gold-zari/30 text-alabaster/90 hover:border-gold-antique hover:text-gold-antique hover:bg-gold-antique/5" 
                                : "border-gold-zari/40 text-obsidian/90 hover:border-gold-antique hover:text-gold-antique hover:bg-burgundy/5"
                        )}
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current group-hover:scale-105 transition-transform duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M3 6 L12 13 L21 6" />
                        </svg>
                        <span className="hidden md:inline font-semibold text-xs tracking-[0.15em]">Contact</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
