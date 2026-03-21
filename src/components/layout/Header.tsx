"use client";

import Link from "next/link";
import { Search, ShoppingBag, Mail, Star, User } from "lucide-react";
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
        syncFromDb(); // initial sync

        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                syncFromDb();
            } else if (event === 'SIGNED_OUT') {
                clearWishlist();
            }
        });
        return () => subscription.unsubscribe();
    }, [syncFromDb, clearWishlist]);

    return (
        <header className={cn(
            "fixed top-0 left-0 w-full z-50 transition-colors duration-1000 ease-in-out",
            isDark ? "bg-black/10 backdrop-blur-sm" : "bg-white/80 backdrop-blur-md border-b border-stone-100"
        )}>
            <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <Star
                        size={24}
                        fill={isDark ? "white" : "black"}
                        className={cn("transition-colors duration-1000", isDark ? "text-white group-hover:opacity-80" : "text-black group-hover:opacity-80")}
                    />
                    <span className={cn(
                        "font-serif text-xl tracking-wide uppercase transition-colors duration-1000",
                        isDark ? "text-white" : "text-black"
                    )}>
                        Priyanka Fashionvilla
                    </span>
                </Link>

                {/* Navigation Icons */}
                <nav className="flex items-center gap-2 md:gap-4">
                    {/* User Icon / Profile Dropdown */}
                    <ProfileDropdown isDark={isDark} />

                    {/* Search Icon */}
                    <button className={cn(
                        "w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-300 group",
                        isDark ? "border-white/30 text-white hover:bg-white hover:text-black" : "border-black/10 text-black hover:bg-black hover:text-white"
                    )}>
                        <Search size={18} strokeWidth={1.5} />
                    </button>

                    {/* Shopping Bag Icon */}
                    <button
                        onClick={toggleCart}
                        className={cn(
                            "w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-300 group relative",
                            isDark ? "border-white/30 text-white hover:bg-white hover:text-black" : "border-black/10 text-black hover:bg-black hover:text-white"
                        )}>
                        <ShoppingBag size={18} strokeWidth={1.5} />
                        <CartCount isDark={isDark} />
                    </button>

                    {/* Contact Button */}
                    <Link
                        href="/contact"
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 md:px-6 rounded-full border text-sm uppercase tracking-wider transition-all duration-300",
                            isDark ? "border-white/30 text-white hover:bg-white hover:text-black" : "border-black/10 text-black hover:bg-black hover:text-white"
                        )}
                    >
                        <Mail size={16} strokeWidth={1.5} />
                        <span className="hidden md:inline">Contact</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
