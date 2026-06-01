"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Mail, User } from "lucide-react";
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
                ? "bg-[#121210]/35 backdrop-blur-md border-[#C5A880]/15 shadow-[0_4px_30px_rgba(0,0,0,0.2)]" 
                : "bg-[#FAF8F5]/75 backdrop-blur-xl border-[#C5A880]/15 shadow-[0_4px_30px_rgba(197,168,128,0.05)]"
        )}>
            <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 md:gap-4 group">
                    <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-[#121210]/5 p-0.5 border border-[#C5A880]/20 group-hover:border-[#D4AF37] transition-all duration-300 overflow-hidden">
                        <Image
                            src="/images/brand-icon.png"
                            alt="Priyanka Fashionvilla Logo"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
                        />
                    </div>
                    <span className={cn(
                        "font-serif text-lg md:text-xl tracking-[0.15em] uppercase transition-colors duration-1000",
                        isDark ? "text-[#FAF8F5]" : "text-[#121210]"
                    )}>
                        Priyanka <span className="text-[#C5A880] group-hover:text-[#D4AF37] transition-colors duration-300">Fashionvilla</span>
                    </span>
                </Link>

                {/* Navigation Icons */}
                <nav className="flex items-center gap-2.5 md:gap-4">
                    {/* User Icon / Profile Dropdown */}
                    <ProfileDropdown isDark={isDark} />

                    {/* Search Icon */}
                    <button className={cn(
                        "w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-500 group",
                        isDark 
                            ? "border-[#C5A880]/25 text-[#FAF8F5]/90 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5" 
                            : "border-[#C5A880]/35 text-[#121210]/90 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#C5A880]/5"
                    )}>
                        <Search size={16} strokeWidth={1.5} className="group-hover:scale-105 transition-transform duration-300" />
                    </button>

                    {/* Shopping Bag Icon */}
                    <button
                        onClick={toggleCart}
                        className={cn(
                            "w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-500 group relative",
                            isDark 
                                ? "border-[#C5A880]/25 text-[#FAF8F5]/90 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5" 
                                : "border-[#C5A880]/35 text-[#121210]/90 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#C5A880]/5"
                        )}>
                        <ShoppingBag size={16} strokeWidth={1.5} className="group-hover:scale-105 transition-transform duration-300" />
                        <CartCount isDark={isDark} />
                    </button>

                    {/* Contact Button */}
                    <Link
                        href="/contact"
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 md:px-5 rounded-full border text-xs md:text-sm uppercase tracking-widest transition-all duration-500 group",
                            isDark 
                                ? "border-[#C5A880]/30 text-[#FAF8F5]/90 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5" 
                                : "border-[#C5A880]/40 text-[#121210]/90 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#C5A880]/5"
                        )}
                    >
                        <Mail size={14} strokeWidth={1.5} className="group-hover:scale-105 transition-transform duration-300" />
                        <span className="hidden md:inline font-semibold text-xs tracking-[0.12em]">Contact</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
