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
        <main className="relative w-full min-h-screen overflow-x-hidden bg-[#FAF8F5]">
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
                    <section className="py-28 px-8 md:px-16 max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-[#C5A880] text-xs md:text-sm uppercase tracking-[0.25em] block mb-2 font-semibold">The Curated Edit</span>
                            <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-widest text-[#121210]">New Arrivals</h2>
                            <div className="w-16 h-[1px] bg-[#C5A880] mx-auto mt-4"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.slice(0, 4).map(product => (
                                <div key={`new-${product.id}`} className="group relative rounded-none overflow-hidden bg-white border border-[#C5A880]/15 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-2xl transition-all duration-700">
                                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                                        <Image 
                                            src={product.cardImage} 
                                            alt={product.name} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out-expo" 
                                            sizes="(max-width: 768px) 100vw, 25vw" 
                                        />
                                    </div>
                                    <div className="p-5 text-center bg-[#FAF8F5]/30">
                                        <h3 className="font-serif text-base text-[#121210] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-1">{product.name}</h3>
                                        <p className="text-[#C5A880] font-serif text-sm mt-1.5 font-semibold">₹{product.price}</p>
                                    </div>
                                    <a href={`/product/${product.id}`} className="absolute inset-0 z-10">
                                        <span className="sr-only">View {product.name}</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Brand Story Banner */}
                    <section className="relative w-full py-32 bg-[#121210] text-[#FAF8F5] overflow-hidden border-y border-[#C5A880]/15">
                        <div className="absolute inset-0 opacity-25">
                             <Image 
                                 src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop" 
                                 alt="Fashion Background" 
                                 fill 
                                 className="object-cover scale-105" 
                             />
                        </div>
                        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                            <span className="text-[#C5A880] text-xs md:text-sm uppercase tracking-[0.25em] block mb-4 font-semibold">The Priyanka Fashionvilla Legacy</span>
                            <h2 className="text-3xl md:text-5xl font-serif mb-6 uppercase tracking-widest text-[#FAF8F5]">Elegance Redefined</h2>
                            <div className="w-12 h-[1px] bg-[#C5A880] mx-auto mb-6"></div>
                            <p className="text-base md:text-lg text-stone-300 mb-10 font-serif italic max-w-2xl mx-auto leading-relaxed">
                                &ldquo;Discover the unparalleled craftsmanship, exquisite detailing, and timeless elegance that defines every hand-woven thread in our exclusive bridal and luxury wear collections. Crafted specifically for monumental entrances.&rdquo;
                            </p>
                            <a 
                                href="/shop" 
                                className="inline-block border border-[#C5A880] px-10 py-4 uppercase tracking-[0.2em] text-xs font-semibold text-[#FAF8F5] hover:bg-[#C5A880] hover:text-[#121210] transition-all duration-500"
                            >
                                Explore Collection
                            </a>
                        </div>
                    </section>

                    {/* Newsletter */}
                    <section className="py-28 px-6 text-center bg-[#FAF8F5] relative overflow-hidden border-t border-[#C5A880]/15">
                        <div className="max-w-2xl mx-auto p-8 md:p-16 border border-[#C5A880]/30 bg-white relative">
                            <div className="absolute inset-1 border border-[#C5A880]/10 pointer-events-none"></div>
                            <span className="text-[#C5A880] text-xs uppercase tracking-[0.3em] block mb-3 font-semibold">Exclusive Invitation</span>
                            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-[#121210] tracking-wide uppercase">Join The Villa</h2>
                            <div className="w-12 h-[1px] bg-[#C5A880] mx-auto mb-6"></div>
                            <p className="text-stone-600 mb-10 max-w-md mx-auto font-serif italic text-sm md:text-base leading-relaxed">
                                Subscribe to receive private invitations to our seasonal debuts, early access to new collections, and stories from our master artisans.
                            </p>
                            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email address" 
                                    className="flex-1 px-4 py-3 border border-[#C5A880]/30 bg-[#FAF8F5]/80 focus:outline-none focus:border-[#D4AF37] text-stone-800 font-serif text-sm placeholder:text-stone-400" 
                                    required 
                                />
                                <button 
                                    type="submit" 
                                    className="bg-[#121210] hover:bg-[#D4AF37] text-[#FAF8F5] hover:text-[#121210] px-8 py-3.5 uppercase tracking-widest text-xs font-semibold transition-all duration-500 shadow-sm border border-[#121210] hover:border-[#D4AF37]"
                                >
                                    Request Invite
                                </button>
                            </form>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}
