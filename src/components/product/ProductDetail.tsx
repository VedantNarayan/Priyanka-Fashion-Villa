"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Heart, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Product } from "@/types";

export default function ProductDetail({ product }: { product: Product }) {
    const { addItem, openCart } = useCartStore();
    const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

    // Default to first option if available
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default");
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [sizeGuideTab, setSizeGuideTab] = useState<'guide' | 'finder'>('guide');
    const [unit, setUnit] = useState<'in' | 'cm'>('in');
    const [finderBust, setFinderBust] = useState('');
    const [finderWaist, setFinderWaist] = useState('');
    const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.cardImage,
            quantity: 1,
            size: selectedSize,
            color: selectedColor,
        });
        openCart();
    };

    return (
        <div className="min-h-screen bg-alabaster text-obsidian">
            <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">

                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-zari hover:text-burgundy mb-10 transition-colors font-semibold">
                    <ArrowLeft size={14} /> Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] relative bg-silk-ivory rounded-sm overflow-hidden group border border-gold-zari/15 shadow-sm">
                            <Image
                                src={product.modelImage}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover transition-transform duration-1000 group-hover:scale-103"
                                priority
                            />
                            {/* Hover Toggle */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-silk-ivory">
                                <Image
                                    src={product.cardImage}
                                    alt="Product Detail"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-contain p-8"
                                />
                            </div>
                        </div>
                        
                        {/* Dynamic Gallery */}
                        {(product.images && product.images.length > 0) ? (
                            <div className="grid grid-cols-2 gap-4">
                                {product.images.map((imgUrl, i) => (
                                    <div key={i} className="aspect-[3/4] relative bg-silk-ivory rounded-sm overflow-hidden group border border-gold-zari/10">
                                        <Image src={imgUrl} alt={`${product.name} detail ${i+1}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-[3/4] relative bg-silk-ivory rounded-sm overflow-hidden border border-gold-zari/10">
                                    <Image src={product.cardImage} alt="Detail 1" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover opacity-90 hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="aspect-[3/4] relative bg-obsidian rounded-sm overflow-hidden flex items-center justify-center text-alabaster/40 text-[10px] uppercase tracking-widest text-center px-4 border border-gold-zari/15">
                                    Atelier Showcase
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col h-full pt-2 text-left">
                        <div className="mb-3 uppercase tracking-[0.2em] text-xs font-semibold text-gold-zari">{product.category}</div>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight text-obsidian uppercase tracking-wide">{product.name}</h1>

                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-2xl md:text-3xl font-light text-rose-ash">₹{product.price}</span>
                            <div className="flex items-center gap-1 text-gold-antique text-sm">
                                <Star fill="currentColor" size={14} className="stroke-none" />
                                <span className="text-obsidian font-bold ml-1">{product.rating || 5.0}</span>
                                <span className="text-stone-400 font-normal ml-1">({product.review_count || 0} Reviews)</span>
                            </div>
                        </div>

                        <p className="text-stone-600 leading-relaxed mb-10 font-serif italic text-sm md:text-base border-l-2 border-gold-zari/30 pl-4">
                            {product.description || "A luxury piece crafted from our select seasonal fabrics. Designed specifically to create a stunning silhouette."}
                        </p>

                        <div className="space-y-8 mb-10 flex-1">
                            {/* Color Selector */}
                            <div>
                                <span className="block text-[10px] uppercase tracking-widest font-semibold text-gold-zari mb-3">Color: <span className="text-obsidian font-bold capitalize">{selectedColor}</span></span>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                                                selectedColor === color
                                                    ? "border-burgundy ring-1 ring-burgundy ring-offset-2"
                                                    : "border-gold-zari/20 hover:border-gold-zari/50"
                                            )}
                                            title={color}
                                        >
                                            <div className={cn("w-8 h-8 rounded-full shadow-inner",
                                                color === "Black" ? "bg-black" :
                                                    color === "Midnight Blue" ? "bg-blue-950" :
                                                        color === "Cream" ? "bg-[#FFFDD0] border border-stone-200" :
                                                            "bg-stone-300" // Silver / default
                                            )} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="block text-[10px] uppercase tracking-widest font-semibold text-gold-zari">Size: <span className="text-obsidian font-bold">{selectedSize}</span></span>
                                    <button onClick={() => setIsSizeGuideOpen(true)} className="text-[10px] uppercase tracking-widest underline text-stone-400 hover:text-obsidian font-semibold">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "h-12 border flex items-center justify-center text-xs tracking-widest uppercase font-semibold transition-all hover:bg-neutral-50",
                                                selectedSize === size
                                                    ? "border-burgundy bg-burgundy text-alabaster hover:bg-burgundy shadow-sm"
                                                    : "border-gold-zari/20 bg-silk-ivory text-rose-ash"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-burgundy text-white h-14 uppercase tracking-widest text-xs font-semibold hover:bg-burgundy-soft transition-all duration-300 flex items-center justify-center gap-3 shadow-sm border border-burgundy"
                            >
                                <ShoppingBag size={16} />
                                Add to Shopping Bag
                            </button>
                            <button
                                onClick={() => {
                                    addToWishlist({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.cardImage
                                    });
                                }}
                                className={cn(
                                    "w-full border h-14 uppercase tracking-widest text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 group",
                                    isInWishlist(product.id)
                                        ? "border-burgundy bg-burgundy text-alabaster hover:bg-burgundy-soft"
                                        : "border-gold-zari/30 hover:border-burgundy hover:text-burgundy"
                                )}
                            >
                                <Heart
                                    size={16}
                                    className={cn(
                                        "transition-colors",
                                        isInWishlist(product.id) ? "fill-white text-white" : "group-hover:fill-burgundy group-hover:text-burgundy"
                                    )}
                                />
                                {isInWishlist(product.id) ? "Saved to Wishlist" : "Add to Wishlist"}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gold-zari/20">
                            <div className="flex items-center gap-3 text-xs text-stone-500 font-semibold uppercase tracking-wider">
                                <Truck size={16} className="text-gold-zari" />
                                <span>Free Shipping & Returns</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-stone-500 font-semibold uppercase tracking-wider">
                                <ShieldCheck size={16} className="text-gold-zari" />
                                <span>Secure Checkout</span>
                            </div>
                        </div>

                        {/* Tabbed Atelier Specifications / Artisan Story Accordion */}
                        <div className="mt-12 border-t border-gold-zari/20 pt-8 space-y-4">
                            <div className="border-b border-gold-zari/15 pb-4">
                                <details className="group cursor-pointer">
                                    <summary className="flex justify-between items-center text-xs uppercase tracking-widest font-semibold text-obsidian list-none focus:outline-none">
                                        <span>Artisan Story & Craftsmanship</span>
                                        <span className="text-gold-zari group-open:rotate-180 transition-transform duration-300">▼</span>
                                    </summary>
                                    <p className="text-xs text-stone-600 mt-4 leading-relaxed font-serif italic">
                                        This piece is crafted by our master weavers using hand-spun zari threads and pure mulberry silk. Every seam represents weeks of meticulous embroidery, hand-finished in our private boutique atelier. Built specifically to catch the light and command presence.
                                    </p>
                                </details>
                            </div>

                            <div className="border-b border-gold-zari/15 pb-4">
                                <details className="group cursor-pointer">
                                    <summary className="flex justify-between items-center text-xs uppercase tracking-widest font-semibold text-obsidian list-none focus:outline-none">
                                        <span>Silhouette & Fabric Specifications</span>
                                        <span className="text-gold-zari group-open:rotate-180 transition-transform duration-300">▼</span>
                                    </summary>
                                    <ul className="text-xs text-stone-600 mt-4 leading-relaxed space-y-1.5 list-disc pl-4">
                                        <li>Premium bridal silk-satin blend canvas</li>
                                        <li>Dual-layered lining for weight, drape, and structural drape</li>
                                        <li>Intricate hand-stitched glass beading details</li>
                                        <li>Concealed rear couture-zip closure</li>
                                    </ul>
                                </details>
                            </div>

                            <div className="border-b border-gold-zari/15 pb-4">
                                <details className="group cursor-pointer">
                                    <summary className="flex justify-between items-center text-xs uppercase tracking-widest font-semibold text-obsidian list-none focus:outline-none">
                                        <span>Artisanal Shipping & Care</span>
                                        <span className="text-gold-zari group-open:rotate-180 transition-transform duration-300">▼</span>
                                    </summary>
                                    <p className="text-xs text-stone-600 mt-4 leading-relaxed font-serif italic">
                                        Due to the intricate hand-weaving process, dry clean only. Each order ships in our customized Priyanka Fashionvilla heritage garment box with an anti-dust cover and wood hangers. Ships within 2–5 business days across India.
                                    </p>
                                </details>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Size Guide Modal Overlay */}
            {isSizeGuideOpen && (() => {
                const sizeChart = (product as any).size_chart;
                const conv = (v: number) => unit === 'cm' ? (v * 2.54).toFixed(1) : String(v);
                const unitLabel = unit === 'cm' ? 'cm' : 'in';

                const fallbackMeasurements = [
                    { size: 'XS', bust: 32, waist: 24, sleeve: 22, length: 54 },
                    { size: 'S', bust: 34, waist: 26, sleeve: 22.5, length: 55 },
                    { size: 'M', bust: 36, waist: 28, sleeve: 23, length: 56 },
                    { size: 'L', bust: 38, waist: 30, sleeve: 23.5, length: 57 },
                    { size: 'XL', bust: 40, waist: 32, sleeve: 24, length: 58 },
                    { size: 'XXL', bust: 42, waist: 34, sleeve: 24.5, length: 59 },
                ];
                const measurements = sizeChart?.measurements || fallbackMeasurements;

                const handleFindSize = () => {
                    const b = parseFloat(finderBust);
                    const w = parseFloat(finderWaist);
                    if (isNaN(b) || isNaN(w)) return;
                    if (!sizeChart?.measurements) {
                        setRecommendedSize(null);
                        return;
                    }
                    let best = sizeChart.measurements[0];
                    let bestDist = Infinity;
                    for (const m of sizeChart.measurements) {
                        const dist = Math.abs(m.bust - b) + Math.abs(m.waist - w);
                        if (dist < bestDist) { bestDist = dist; best = m; }
                    }
                    setRecommendedSize(best.size);
                };

                return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/60 backdrop-blur-sm p-4 text-left">
                    <div className="bg-silk-ivory border border-gold-zari/30 max-w-lg w-full p-6 md:p-8 relative shadow-2xl rounded-none">
                        <button
                            onClick={() => { setIsSizeGuideOpen(false); setRecommendedSize(null); }}
                            className="absolute top-4 right-4 text-gold-zari hover:text-burgundy transition-colors p-1"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="font-serif text-2xl uppercase tracking-wider text-obsidian mb-2">Atelier Sizing Guide</h2>
                        <div className="w-12 h-[1px] bg-gold-zari mb-5"></div>

                        {/* Tab Bar */}
                        <div className="flex border-b border-gold-zari/20 mb-6">
                            {(['guide', 'finder'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSizeGuideTab(tab)}
                                    className={cn(
                                        'flex-1 pb-2.5 text-[10px] uppercase tracking-widest font-semibold transition-all',
                                        sizeGuideTab === tab
                                            ? 'text-obsidian border-b-2 border-gold-zari'
                                            : 'text-rose-ash/60 hover:text-obsidian'
                                    )}
                                >
                                    {tab === 'guide' ? 'Size Guide' : 'Find My Size'}
                                </button>
                            ))}
                        </div>

                        {/* Tab 1: Size Guide */}
                        {sizeGuideTab === 'guide' && (
                            <div>
                                {/* Badges & Unit Toggle */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex gap-2 flex-wrap">
                                        {sizeChart?.fit_type && (
                                            <span className="text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 border border-gold-zari/30 text-gold-zari">
                                                {sizeChart.fit_type}
                                            </span>
                                        )}
                                        {sizeChart?.stretchability && (
                                            <span className="text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 border border-burgundy/30 text-burgundy">
                                                {sizeChart.stretchability}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setUnit(unit === 'in' ? 'cm' : 'in')}
                                        className="text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 border border-gold-zari/30 text-gold-zari hover:bg-gold-zari/10 transition-colors"
                                    >
                                        {unit === 'in' ? 'Show CM' : 'Show IN'}
                                    </button>
                                </div>

                                {/* Measurement Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-gold-zari/25 text-gold-zari uppercase tracking-widest text-[9px]">
                                                <th className="py-2.5 font-semibold">Size</th>
                                                <th className="py-2.5 font-semibold">Bust ({unitLabel})</th>
                                                <th className="py-2.5 font-semibold">Waist ({unitLabel})</th>
                                                <th className="py-2.5 font-semibold">Sleeve ({unitLabel})</th>
                                                <th className="py-2.5 font-semibold">Length ({unitLabel})</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gold-zari/10 text-rose-ash font-medium">
                                            {measurements.map((m: any) => (
                                                <tr key={m.size}>
                                                    <td className="py-2.5 font-bold text-burgundy">{m.size}</td>
                                                    <td className="py-2.5">{conv(m.bust)}</td>
                                                    <td className="py-2.5">{conv(m.waist)}</td>
                                                    <td className="py-2.5">{conv(m.sleeve)}</td>
                                                    <td className="py-2.5">{conv(m.length)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-[10px] text-stone-400 mt-6 italic">
                                    * Custom tailors are available for bridal orders. Please contact customer concierge via WhatsApp for exact custom adjustments.
                                </p>
                            </div>
                        )}

                        {/* Tab 2: Find My Size */}
                        {sizeGuideTab === 'finder' && (
                            <div>
                                {sizeChart?.measurements ? (
                                    <div className="flex flex-col items-center">
                                        {/* SVG Body Silhouette */}
                                        <svg viewBox="0 0 120 220" className="w-28 h-auto mb-6 text-gold-zari/40" fill="none" stroke="currentColor" strokeWidth="1.2">
                                            {/* Head */}
                                            <ellipse cx="60" cy="22" rx="14" ry="16" />
                                            {/* Neck */}
                                            <line x1="54" y1="38" x2="54" y2="50" />
                                            <line x1="66" y1="38" x2="66" y2="50" />
                                            {/* Shoulders */}
                                            <line x1="54" y1="50" x2="25" y2="58" />
                                            <line x1="66" y1="50" x2="95" y2="58" />
                                            {/* Arms */}
                                            <line x1="25" y1="58" x2="18" y2="110" />
                                            <line x1="95" y1="58" x2="102" y2="110" />
                                            {/* Torso sides */}
                                            <path d="M25,58 Q28,80 35,90 Q30,105 38,130" />
                                            <path d="M95,58 Q92,80 85,90 Q90,105 82,130" />
                                            {/* Hips to legs */}
                                            <path d="M38,130 Q35,155 40,190 L45,210" />
                                            <path d="M82,130 Q85,155 80,190 L75,210" />
                                            {/* Inner legs */}
                                            <line x1="55" y1="130" x2="52" y2="210" />
                                            <line x1="65" y1="130" x2="68" y2="210" />
                                            {/* Bust measurement line */}
                                            <line x1="12" y1="72" x2="108" y2="72" strokeDasharray="3,3" className="text-burgundy" stroke="currentColor" />
                                            <text x="110" y="74" fontSize="7" fill="currentColor" className="text-burgundy" fontWeight="600">B</text>
                                            {/* Waist measurement line */}
                                            <line x1="20" y1="92" x2="100" y2="92" strokeDasharray="3,3" className="text-gold-zari" stroke="currentColor" />
                                            <text x="102" y="94" fontSize="7" fill="currentColor" className="text-gold-zari" fontWeight="600">W</text>
                                        </svg>

                                        {/* Input Fields */}
                                        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-5">
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-widest font-semibold text-gold-zari mb-1.5">Bust (in)</label>
                                                <input
                                                    type="number"
                                                    value={finderBust}
                                                    onChange={(e) => setFinderBust(e.target.value)}
                                                    placeholder="e.g. 36"
                                                    className="w-full h-10 border border-gold-zari/30 bg-white px-3 text-xs text-obsidian placeholder:text-stone-300 focus:outline-none focus:border-gold-zari transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-widest font-semibold text-gold-zari mb-1.5">Waist (in)</label>
                                                <input
                                                    type="number"
                                                    value={finderWaist}
                                                    onChange={(e) => setFinderWaist(e.target.value)}
                                                    placeholder="e.g. 28"
                                                    className="w-full h-10 border border-gold-zari/30 bg-white px-3 text-xs text-obsidian placeholder:text-stone-300 focus:outline-none focus:border-gold-zari transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleFindSize}
                                            className="w-full max-w-xs h-11 bg-burgundy text-white uppercase tracking-widest text-[10px] font-semibold hover:bg-burgundy-soft transition-colors"
                                        >
                                            Find My Size
                                        </button>

                                        {recommendedSize && (
                                            <div className="mt-5 text-center">
                                                <p className="text-sm text-obsidian">
                                                    We recommend size <span className="font-bold text-gold-zari text-base">{recommendedSize}</span> for you
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-xs text-rose-ash leading-relaxed">
                                            Size finder is not available for this product.<br />
                                            Please contact our <span className="text-gold-zari font-semibold">Customer Concierge</span> via WhatsApp for personalised sizing assistance.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                );
            })()}
        </div>
    );
}
