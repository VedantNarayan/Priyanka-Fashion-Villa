import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Star, RotateCcw, Tag, ShieldCheck, Menu } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, two_factor_enabled')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect("/");
    }

    const navItems = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/products", icon: Package, label: "Products" },
        { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
        { href: "/admin/customers", icon: Users, label: "Customers" },
        { href: "/admin/returns", icon: RotateCcw, label: "Returns" },
        { href: "/admin/coupons", icon: Tag, label: "Coupons" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <div className="min-h-screen bg-stone-100 flex text-stone-900">
            {/* Sidebar */}
            <aside className="w-64 bg-black text-white fixed h-full z-10 hidden md:flex flex-col">
                <div className="h-20 flex items-center px-6 border-b border-white/10 gap-2">
                    <Star fill="white" size={24} />
                    <span className="font-serif text-lg tracking-wide uppercase">Admin</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-stone-300 hover:bg-white/10 hover:text-white rounded-md transition-colors"
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    {!profile.two_factor_enabled && (
                        <Link href="/admin/setup-2fa" className="flex items-center gap-3 px-4 py-2 text-sm text-amber-400 hover:bg-white/5 rounded-md transition-colors mb-2">
                            <ShieldCheck size={18} />
                            Setup 2FA
                        </Link>
                    )}
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
                            {(user.email?.[0] || "A").toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.email}</p>
                            <p className="text-xs text-stone-400">Store Admin</p>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-md transition-colors">
                            <LogOut size={18} /> Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-black text-white h-16 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Star fill="white" size={20} />
                    <span className="font-serif text-sm tracking-wide uppercase">Admin</span>
                </div>
                <div className="flex items-center gap-2">
                    {navItems.slice(0, 4).map((item) => (
                        <Link key={item.href} href={item.href} className="p-2 text-stone-300 hover:text-white">
                            <item.icon size={18} />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8">
                {children}
            </main>
        </div>
    );
}
