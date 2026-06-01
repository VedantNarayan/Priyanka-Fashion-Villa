"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";

export default function GlobalHeaderWrapper() {
    const pathname = usePathname();

    // Do not show the main store header on admin pages or callback pages
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth/callback")) {
        return null;
    }

    // Homepage already renders a dynamically themed header (ZevanaHome)
    if (pathname === "/") {
        return null;
    }

    // Render the beautiful light theme header on all other pages
    return <Header theme="light" />;
}
