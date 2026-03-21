"use client";

import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function CartCount({ isDark }: { isDark: boolean }) {
    const { items } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || items.length === 0) return null;

    return (
        <span className={cn(
            "absolute top-0 right-0 w-2.5 h-2.5 rounded-full translate-x-1 -translate-y-1 block",
            isDark ? "bg-white" : "bg-black"
        )} />
    );
}
