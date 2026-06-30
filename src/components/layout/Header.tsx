"use client";

import Link from "next/link";
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
            <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                {/* Logo Section with Custom SVG Crest */}
                <Link href="/" className="flex items-center gap-3 md:gap-4 group">
                    <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-burgundy/5 p-0.5 border border-gold-zari/35 group-hover:border-gold-antique transition-all duration-500 overflow-hidden">
                        <svg viewBox="0 0 100 100" className="w-8 h-8 fill-none stroke-burgundy group-hover:stroke-gold-antique transition-colors duration-500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="50" cy="50" r="38" strokeDasharray="3 3" opacity="0.4" className="stroke-gold-zari" />
                            <circle cx="50" cy="50" r="32" className="stroke-burgundy group-hover:stroke-gold-antique transition-colors" />
                            <text x="36" y="58" className="font-serif text-2xl font-light tracking-tighter fill-burgundy group-hover:fill-gold-antique transition-colors" strokeWidth="0.5">P</text>
                            <text x="52" y="66" className="font-serif text-xl font-light tracking-tighter fill-gold-zari group-hover:fill-gold-antique transition-colors" strokeWidth="0.5">F</text>
                            <path d="M46,28 L50,22 L54,28 Z" className="fill-gold-zari group-hover:fill-gold-antique transition-colors" />
                        </svg>
                    </div>
                    <span className={cn(
                        "font-serif text-lg md:text-xl tracking-[0.18em] uppercase transition-colors duration-1000",
                        isDark ? "text-alabaster" : "text-obsidian"
                    )}>
                        Priyanka <span className="text-burgundy group-hover:text-gold-antique transition-colors duration-300">Fashionvilla</span>
                    </span>
                </Link>

                {/* Navigation Icons */}
                <nav className="flex items-center gap-2.5 md:gap-4">
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
