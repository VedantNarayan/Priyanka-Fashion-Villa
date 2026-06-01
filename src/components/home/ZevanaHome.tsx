"use client";

import { useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import HeroAnimation from "@/components/home/HeroAnimation";
import ModelDisplay from "@/components/home/ModelDisplay";
import ProductCarousel from "@/components/home/ProductCarousel";
import { Product } from "@/types";
import Image from "next/image";

export default function ZevanaHome({ products }: { products: Product[] }) {
    const [showMainContent, setShowMainContent] = useState(false); // Show carousel underneath intro
    const [introComplete, setIntroComplete] = useState(false);     // Remove HeroAnimation entirely
    const [activeIndex, setActiveIndex] = useState(Math.floor(products.length / 2));
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    // Phase 4: Cards have landed at the bottom — show the real carousel behind them
    const handleCardsLanded = useCallback(() => {
        setShowMainContent(true);
        setTheme('light');
    }, []);

    // Phase 5.8s: Intro cards have faded out — unmount HeroAnimation
    const handleIntroComplete = useCallback(() => {
        setIntroComplete(true);
    }, []);

    return (
        <main className="relative w-full min-h-screen overflow-x-hidden bg-[#F5F5F0]">
            <Header theme={theme} />

            {/* Intro Animation Layer — stays mounted until fully faded out */}
            {!introComplete && (
                <HeroAnimation
                    onCardsLanded={handleCardsLanded}
                    onComplete={handleIntroComplete}
                />
            )}

            {/* Main Interactive Layer — fades in while HeroAnimation cards are still at the bottom */}
            {showMainContent && (
                <>
                    {/* Hero Section */}
                    <section className="relative w-full h-[100dvh] overflow-hidden shrink-0">
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
                    </section>

                    {/* Featured Collections Section */}
                    <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
                        <h2 className="text-4xl font-serif text-center mb-16 uppercase tracking-widest text-black">New Arrivals</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.slice(0, 4).map(product => (
                                <div key={`new-${product.id}`} className="group relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                                        <Image src={product.cardImage} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 25vw" />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-serif text-lg text-black">{product.name}</h3>
                                        <p className="text-stone-500 text-sm mt-1">₹{product.price}</p>
                                    </div>
                                    <a href={`/product/${product.id}`} className="absolute inset-0 z-10">
                                        <span className="sr-only">View {product.name}</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Brand Story Banner */}
                    <section className="relative w-full py-32 bg-stone-900 text-stone-50 overflow-hidden">
                        <div className="absolute inset-0 opacity-40">
                             <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop" alt="Fashion Background" fill className="object-cover" />
                        </div>
                        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                            <h2 className="text-4xl md:text-6xl font-serif mb-6 uppercase tracking-widest">Elegance Redefined</h2>
                            <p className="text-lg md:text-xl text-stone-200 mb-10 font-light leading-relaxed">
                                Discover the unparalleled craftsmanship and timeless elegance that defines every piece in our exclusive collection. Designed for those who make an entrance.
                            </p>
                            <a href="/shop" className="inline-block border border-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors duration-300">Explore Collection</a>
                        </div>
                    </section>

                    {/* Newsletter */}
                    <section className="py-24 px-6 text-center bg-[#F5F5F0]">
                         <h2 className="text-3xl font-serif mb-4 text-black">Join The Villa</h2>
                         <p className="text-stone-500 mb-8 max-w-md mx-auto">Subscribe for exclusive access to new collections, private sales, and behind-the-scenes content.</p>
                         <form className="max-w-md mx-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
                             <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 border border-stone-300 bg-transparent focus:outline-none focus:border-black text-black" required />
                             <button type="submit" className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors">Subscribe</button>
                         </form>
                    </section>
                </>
            )}

        </main>
    );
}
