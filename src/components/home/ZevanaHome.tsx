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
        <main className="relative w-full min-h-screen overflow-x-hidden bg-alabaster">
            <Header theme={theme} />

            {/* Intro Animation Layer — stays mounted until fully faded out */}
            {!introComplete && (
                <HeroAnimation
                    products={products}
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
                    <section className="py-32 px-8 md:px-16 max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <span className="text-gold-zari text-xs md:text-sm uppercase tracking-[0.25em] block mb-2 font-semibold">The Curated Edit</span>
                            <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-widest text-obsidian">New Arrivals</h2>
                            <div className="w-16 h-[1px] bg-gold-zari mx-auto mt-4"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.slice(0, 4).map(product => (
                                <div key={`new-${product.id}`} className="group relative rounded-none overflow-hidden bg-silk-ivory border border-gold-zari/20 hover:border-gold-antique/50 shadow-sm hover:shadow-2xl transition-all duration-700">
                                    <div className="relative aspect-[3/4] w-full overflow-hidden double-image-container bg-neutral-100">
                                        <Image 
                                            src={product.cardImage} 
                                            alt={product.name} 
                                            fill 
                                            className="object-cover primary-image opacity-100 group-hover:opacity-0 transition-opacity duration-700 ease-out-expo" 
                                            sizes="(max-width: 768px) 100vw, 25vw" 
                                        />
                                        <Image 
                                            src={product.modelImage} 
                                            alt={`${product.name} look`} 
                                            fill 
                                            className="object-cover secondary-image absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out-expo scale-100 group-hover:scale-105" 
                                            sizes="(max-width: 768px) 100vw, 25vw" 
                                        />
                                    </div>
                                    <div className="p-5 text-center bg-silk-ivory/50">
                                        <h3 className="font-serif text-base text-obsidian group-hover:text-burgundy transition-colors duration-300 line-clamp-1">{product.name}</h3>
                                        <p className="text-gold-zari font-serif text-sm mt-1.5 font-semibold">₹{product.price}</p>
                                    </div>
                                    <a href={`/product/${product.id}`} className="absolute inset-0 z-10">
                                        <span className="sr-only">View {product.name}</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* The Lookbook Feed Section (Asymmetrical Editorial Grid) */}
                    <section className="py-32 px-4 md:px-8 bg-silk-ivory border-t border-gold-zari/15">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-24">
                                <span className="text-gold-zari text-xs md:text-sm uppercase tracking-[0.25em] block mb-2 font-semibold">Volume I / Lookbook</span>
                                <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-widest text-obsidian">The Atelier Journal</h2>
                                <div className="w-16 h-[1px] bg-gold-zari mx-auto mt-4"></div>
                                <p className="text-rose-ash/60 font-serif italic text-sm mt-6 max-w-md mx-auto">
                                    A sculptural exploration of drapes, motion, and heritage weaving. Designed for monumental entrances.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                                {/* Left Side: Large Column Block */}
                                <div className="lg:col-span-8 group relative overflow-hidden bg-obsidian border border-gold-zari/15 shadow-sm hover:shadow-2xl transition-all duration-700 h-[65vh] flex flex-col justify-end">
                                    <div className="absolute inset-0 overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop"
                                            alt="Silk Movement Lookbook"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out-expo"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B]/90 via-[#0D0C0B]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700"></div>
                                    </div>
                                    <div className="relative z-10 p-8 md:p-12 text-white max-w-xl">
                                        <span className="text-gold-zari text-xs uppercase tracking-[0.2em] font-semibold mb-2 block">Volume I</span>
                                        <h3 className="font-serif text-2xl md:text-3xl uppercase tracking-wider mb-4 text-alabaster">Fluid Geometrics</h3>
                                        <p className="text-stone-300 text-xs md:text-sm leading-relaxed mb-6 font-serif italic">
                                            Explorations of light and shadow on pure hand-spun mulberry silk. Curated specifically for monumental arrivals.
                                        </p>
                                        <a href="/shop" className="inline-block border-b border-gold-zari pb-1 text-xs uppercase tracking-widest text-gold-antique hover:text-white hover:border-white transition-colors font-semibold">
                                            Shop The Silhouette
                                        </a>
                                    </div>
                                </div>

                                {/* Right Side: Portrait Column Block (Staggered Height) */}
                                <div className="lg:col-span-4 group relative overflow-hidden bg-obsidian border border-gold-zari/15 shadow-sm hover:shadow-2xl transition-all duration-700 h-[65vh] flex flex-col justify-end lg:translate-y-8">
                                    <div className="absolute inset-0 overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2576&auto=format&fit=crop"
                                            alt="Embellishments Lookbook"
                                            fill
                                            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms] ease-out-expo"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B]/90 via-[#0D0C0B]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700"></div>
                                    </div>
                                    <div className="relative z-10 p-8 text-white">
                                        <span className="text-gold-zari text-xs uppercase tracking-[0.2em] font-semibold mb-2 block">Volume II</span>
                                        <h3 className="font-serif text-xl md:text-2xl uppercase tracking-wider mb-3 text-alabaster">Structured Atelier</h3>
                                        <p className="text-stone-300 text-xs leading-relaxed mb-6 font-serif italic">
                                            Handcrafted glass beads and zardozi embroidery stitched meticulously by master artisans.
                                        </p>
                                        <a href="/shop" className="inline-block border-b border-gold-zari pb-1 text-xs uppercase tracking-widest text-gold-antique hover:text-white hover:border-white transition-colors font-semibold">
                                            Discover Details
                                        </a>
                                    </div>
                                </div>

                                {/* Second Row Asymmetry */}
                                <div className="lg:col-span-5 group relative overflow-hidden bg-obsidian border border-gold-zari/15 shadow-sm hover:shadow-2xl transition-all duration-700 h-[50vh] flex flex-col justify-end lg:-translate-y-4">
                                    <div className="absolute inset-0 overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2574&auto=format&fit=crop"
                                            alt="Classic Glamour Lookbook"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out-expo"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B]/90 via-[#0D0C0B]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700"></div>
                                    </div>
                                    <div className="relative z-10 p-8 text-white">
                                        <span className="text-gold-zari text-xs uppercase tracking-[0.2em] font-semibold mb-2 block">Volume III</span>
                                        <h3 className="font-serif text-xl uppercase tracking-wider mb-3 text-alabaster">Gilded Noir</h3>
                                        <a href="/shop" className="inline-block border-b border-gold-zari pb-1 text-xs uppercase tracking-widest text-gold-antique hover:text-white hover:border-white transition-colors font-semibold">
                                            Browse Velvet & Satin
                                        </a>
                                    </div>
                                </div>

                                <div className="lg:col-span-7 group relative overflow-hidden bg-obsidian border border-gold-zari/15 shadow-sm hover:shadow-2xl transition-all duration-700 h-[50vh] flex flex-col justify-end">
                                    <div className="absolute inset-0 overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2673&auto=format&fit=crop"
                                            alt="Modern Ethos Lookbook"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out-expo"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B]/90 via-[#0D0C0B]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700"></div>
                                    </div>
                                    <div className="relative z-10 p-8 md:p-10 text-white">
                                        <span className="text-gold-zari text-xs uppercase tracking-[0.2em] font-semibold mb-2 block">Volume IV</span>
                                        <h3 className="font-serif text-xl md:text-2xl uppercase tracking-wider mb-3 text-alabaster">Modern Heritage</h3>
                                        <p className="text-stone-300 text-xs leading-relaxed mb-6 font-serif italic max-w-md">
                                            Contemporary cuts reimagining traditional silhouettes for modern occasions. Designed for effortless transitions.
                                        </p>
                                        <a href="/shop" className="inline-block border-b border-gold-zari pb-1 text-xs uppercase tracking-widest text-gold-antique hover:text-white hover:border-white transition-colors font-semibold">
                                            View Collection
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Brand Story Banner */}
                    <section className="relative w-full py-32 bg-obsidian text-alabaster overflow-hidden border-y border-gold-zari/15">
                        <div className="absolute inset-0 opacity-20">
                             <Image 
                                 src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop" 
                                 alt="Fashion Background" 
                                 fill 
                                 className="object-cover scale-105" 
                             />
                        </div>
                        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                            <span className="text-gold-zari text-xs md:text-sm uppercase tracking-[0.25em] block mb-4 font-semibold">The Priyanka Fashionvilla Legacy</span>
                            <h2 className="text-3xl md:text-5xl font-serif mb-6 uppercase tracking-widest text-alabaster">Elegance Redefined</h2>
                            <div className="w-12 h-[1px] bg-gold-zari mx-auto mb-6"></div>
                            <p className="text-base md:text-lg text-stone-300 mb-10 font-serif italic max-w-2xl mx-auto leading-relaxed">
                                &ldquo;Discover the unparalleled craftsmanship, exquisite detailing, and timeless elegance that defines every hand-woven thread in our exclusive bridal and luxury wear collections. Crafted specifically for monumental entrances.&rdquo;
                            </p>
                            <a 
                                href="/shop" 
                                className="inline-block border border-gold-zari px-10 py-4 uppercase tracking-[0.2em] text-xs font-semibold text-alabaster hover:bg-gold-zari hover:text-obsidian transition-all duration-500"
                            >
                                Explore Collection
                            </a>
                        </div>
                    </section>

                    {/* Newsletter */}
                    <section className="py-32 px-6 text-center bg-alabaster relative overflow-hidden border-t border-gold-zari/15">
                        <div className="max-w-2xl mx-auto p-8 md:p-16 border border-gold-zari/30 bg-silk-ivory relative">
                            <div className="absolute inset-1 border border-gold-zari/10 pointer-events-none"></div>
                            <span className="text-gold-zari text-xs uppercase tracking-[0.3em] block mb-3 font-semibold">Exclusive Invitation</span>
                            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-obsidian tracking-wide uppercase">Join The Villa</h2>
                            <div className="w-12 h-[1px] bg-gold-zari mx-auto mb-6"></div>
                            <p className="text-rose-ash/70 mb-10 max-w-md mx-auto font-serif italic text-sm md:text-base leading-relaxed">
                                Subscribe to receive private invitations to our seasonal debuts, early access to new collections, and stories from our master artisans.
                            </p>
                            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email address" 
                                    className="flex-1 px-4 py-3 border border-gold-zari/30 bg-alabaster focus:outline-none focus:border-burgundy text-obsidian font-serif text-sm placeholder:text-rose-ash/40" 
                                    required 
                                />
                                <button 
                                    type="submit" 
                                    className="bg-burgundy hover:bg-gold-antique text-alabaster hover:text-obsidian px-8 py-3.5 uppercase tracking-widest text-xs font-semibold transition-all duration-500 shadow-sm border border-burgundy hover:border-gold-antique"
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
