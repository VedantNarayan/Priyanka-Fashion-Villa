"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, LogOut, Settings, Package, LayoutDashboard, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
    isDark: boolean;
}

export default function ProfileDropdown({ isDark }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [points, setPoints] = useState<number>(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async (sessionUser?: any) => {
            const currentUser = sessionUser || (await supabase.auth.getSession()).data.session?.user;
            if (currentUser) {
                setUser(currentUser);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role, loyalty_points')
                    .eq('id', currentUser.id)
                    .single();
                
                if (profile) {
                    setRole(profile.role);
                    setPoints(profile.loyalty_points || 0);
                }
            } else {
                setUser(null);
                setRole(null);
                setPoints(0);
            }
        };

        fetchUser();

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
                fetchUser(session?.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setRole(null);
                setPoints(0);
            }
        });

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            subscription.unsubscribe();
        };
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        setIsOpen(false);
        router.refresh();
        router.push("/login");
    };

    if (!user) {
        return (
            <Link href="/login" className={cn(
                "w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-300 group",
                isDark ? "border-white/30 text-white hover:bg-white hover:text-black" : "border-black/10 text-black hover:bg-black hover:text-white"
            )}>
                <User size={18} strokeWidth={1.5} />
            </Link>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-300 relative overflow-hidden",
                    isDark ? "border-white/30 text-white hover:bg-white hover:text-black" : "border-black/10 text-black hover:bg-black hover:text-white",
                    isOpen && (isDark ? "bg-white text-black" : "bg-black text-white")
                )}
            >
                <span className="font-medium text-sm">
                    {(user.email?.[0] || 'U').toUpperCase()}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 shadow-lg p-2 z-50 rounded-sm text-black">
                    <div className="px-3 py-2 border-b border-stone-100 mb-2">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-stone-500 capitalize">{role || 'Customer'}</p>
                            <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                <Star size={10} className="fill-amber-600" />
                                {points} Points
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        {role === 'admin' && (
                            <Link 
                                href="/admin" 
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-black transition-colors rounded-sm"
                            >
                                <LayoutDashboard size={16} />
                                Admin Dashboard
                            </Link>
                        )}
                        <Link 
                            href="/account" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-black transition-colors rounded-sm"
                        >
                            <Settings size={16} />
                            My Profile
                        </Link>
                        <Link 
                            href="/account/orders" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-black transition-colors rounded-sm"
                        >
                            <Package size={16} />
                            My Orders
                        </Link>
                        
                        <div className="h-px bg-stone-100 my-1"></div>
                        
                        <button 
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left rounded-sm"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
