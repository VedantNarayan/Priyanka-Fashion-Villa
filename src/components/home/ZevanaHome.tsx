"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import HeroAnimation from "@/components/home/HeroAnimation";
import ModelDisplay from "@/components/home/ModelDisplay";
import ProductCarousel from "@/components/home/ProductCarousel";
import { AnimatePresence } from "framer-motion";
import { Product } from "@/types";

export default function ZevanaHome({ products }: { products: Product[] }) {
    const [introComplete, setIntroComplete] = useState(false);
    // Start at center product
    const [activeIndex, setActiveIndex] = useState(Math.floor(products.length / 2));

    // Derived theme state: Dark during intro, Light after (when intro completes or phase 3 passes)
    // For simplicity, we flip theme when intro is complete, but we might want to do it sooner.
    // HeroAnimation handles the bg color transition. 
    // Header needs to sync. We can pass a callback from HeroAnimation for 'phase3Reached'.

    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const handleIntroComplete = () => {
        setIntroComplete(true);
        setTheme('light');
    };

    return (
        <main className="relative w-full h-screen overflow-hidden bg-[#F5F5F0]">
            <Header theme={theme} />

            {/* Intro Animation Layer */}
            <AnimatePresence>
                {!introComplete && (
                    <HeroAnimation onComplete={handleIntroComplete} />
                )}
            </AnimatePresence>

            {/* Main Interactive Layer */}
            {introComplete && (
                <div className="absolute inset-0 z-30">
                    <ModelDisplay
                        products={products}
                        activeIndex={activeIndex}
                        show={true}
                    />

                    <ProductCarousel
                        products={products}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                </div>
            )}

        </main>
    );
}
