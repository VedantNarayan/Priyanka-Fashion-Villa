import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User, ShoppingBag, Heart, MapPin, RotateCcw, LogOut } from "lucide-react";
import React from "react";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const navItems = [
        { href: "/account", icon: User, label: "Profile" },
        { href: "/account/orders", icon: ShoppingBag, label: "Orders" },
        { href: "/account/addresses", icon: MapPin, label: "Addresses" },
        { href: "/account/wishlist", icon: Heart, label: "Wishlist" },
        { href: "/account/returns", icon: RotateCcw, label: "Returns" },
    ];

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-sm shadow-sm p-6 sticky top-24">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                                    {(user.email?.[0] || "U").toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium text-sm truncate">{user.user_metadata?.full_name || user.email}</p>
                                    <p className="text-xs text-stone-400 truncate">{user.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-black rounded-md transition-colors"
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-4 pt-4 border-t border-stone-100">
                                <form action="/auth/signout" method="post">
                                    <button type="submit" className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors w-full">
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
