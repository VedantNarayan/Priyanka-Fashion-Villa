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
    
    // Fit Finder Interactive State
    const [finderBust, setFinderBust] = useState('36');
    const [finderWaist, setFinderWaist] = useState('28');
    const [finderHeight, setFinderHeight] = useState(165);
    const [finderWeight, setFinderWeight] = useState(55);
    const [activeField, setActiveField] = useState<'hw' | 'bust' | 'waist'>('hw');
    const [bustCustomized, setBustCustomized] = useState(false);
    const [waistCustomized, setWaistCustomized] = useState(false);
    const [finderStep, setFinderStep] = useState<'main' | 'edit'>('main');
    const [agreedToTerms, setAgreedToTerms] = useState(true);
    const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
    const [hasEnteredInfo, setHasEnteredInfo] = useState(false);

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
                <Link href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-zari hover:text-burgundy mb-10 transition-colors font-semibold">
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
                                            <div 
                                                className="w-8 h-8 rounded-full shadow-inner"
                                                style={(() => {
                                                    const c = color.trim().toLowerCase();
                                                    switch (c) {
                                                        case "black": return { backgroundColor: "#111" };
                                                        case "midnight blue": return { backgroundColor: "#0b132b" };
                                                        case "cream": return { backgroundColor: "#FFFDD0", border: "1px solid #e5e5e5" };
                                                        case "white": return { backgroundColor: "#ffffff", border: "1px solid #e5e5e5" };
                                                        case "red":
                                                        case "ruby red":
                                                            return { backgroundColor: "#9b2226" };
                                                        case "silver": return { backgroundColor: "#e2e8f0" };
                                                        case "gold": return { backgroundColor: "#d4af37" };
                                                        case "pink":
                                                        case "rose":
                                                            return { backgroundColor: "#fda4af" };
                                                        case "grey":
                                                        case "gray":
                                                            return { backgroundColor: "#78716c" };
                                                        case "green":
                                                        case "emerald":
                                                            return { backgroundColor: "#065f46" };
                                                        default:
                                                            return { backgroundColor: color };
                                                    }
                                                })()}
                                            />
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

                // Dynamic calculations for real-time recommendations
                const bustVal = parseFloat(finderBust) || 36;
                const waistVal = parseFloat(finderWaist) || 28;
                let calculatedSize = "M";
                if (measurements && measurements.length > 0) {
                    let best = measurements[0];
                    let bestDist = Infinity;
                    for (const m of measurements) {
                        const dist = Math.abs(m.bust - bustVal) + Math.abs(m.waist - waistVal);
                        if (dist < bestDist) {
                            bestDist = dist;
                            best = m;
                        }
                    }
                    calculatedSize = best.size;
                }

                // Ruler Slider Renderer Helper
                const renderRulerSlider = (label: string, value: number, min: number, max: number, onChange: (val: number) => void, unitStr: string, subtitle?: string) => {
                    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
                    const midPoint = Math.round(min + (max - min) / 2);
                    return (
                        <div className="flex flex-col gap-1.5 w-full">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[9px] uppercase tracking-widest font-semibold text-stone-500">{label}</span>
                                <span className="text-xs font-bold text-obsidian font-serif">{value} {unitStr} {subtitle ? `(${subtitle})` : ''}</span>
                            </div>
                            
                            <div className="relative h-12 bg-white border border-gold-zari/20 rounded-none flex items-center px-4 overflow-hidden">
                                <div 
                                    className="absolute inset-x-4 h-6 border-t border-b border-stone-200/60" 
                                    style={{
                                        background: 'repeating-linear-gradient(90deg, #c9a563, #c9a563 1px, transparent 1px, transparent 12px)',
                                        opacity: 0.4
                                    }}
                                />
                                
                                <div 
                                    className="absolute h-8 w-[1.5px] bg-obsidian flex flex-col items-center pointer-events-none transition-all duration-75"
                                    style={{ left: `calc(16px + ${percentage}% * (100% - 32px) / 100)` }}
                                >
                                    <div className="w-0 h-0 border-l-[3.5px] border-r-[3.5px] border-b-[5px] border-l-transparent border-r-transparent border-b-obsidian absolute bottom-0 transform translate-y-1"></div>
                                </div>
                                
                                <input 
                                    type="range" 
                                    min={min} 
                                    max={max} 
                                    value={value} 
                                    onChange={(e) => onChange(parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            
                            <div className="flex justify-between px-4 text-[9px] text-stone-400 font-medium font-serif mt-0.5">
                                <span>{min}</span>
                                <span>{midPoint}</span>
                                <span>{max}</span>
                            </div>
                        </div>
                    );
                };

                return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/60 backdrop-blur-sm p-4 text-left">
                    <div className="bg-silk-ivory border border-gold-zari/30 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl rounded-none">
                        <button
                            onClick={() => { setIsSizeGuideOpen(false); setRecommendedSize(null); setFinderStep('main'); }}
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

                                <div className="mt-8 border-t border-gold-zari/15 pt-6">
                                    <h3 className="text-[10px] font-semibold text-obsidian uppercase tracking-widest mb-4 font-serif">Product Measurements</h3>
                                    
                                    <div className="flex flex-col items-center gap-6">
                                        {/* Shirt SVG: Centered and properly sized */}
                                        <div className="w-40 h-40 md:w-44 md:h-44 flex items-center justify-center bg-stone-50/50 border border-gold-zari/10 p-3 relative">
                                            <svg viewBox="0 0 120 120" className="w-full h-full text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                {/* Long sleeve shirt outline */}
                                                <path d="M 30,30 L 40,25 L 48,27 C 55,25 65,25 72,27 L 80,25 L 90,30 L 105,65 L 95,68 L 85,45 L 85,100 L 35,100 L 35,45 L 25,68 L 15,65 Z" fill="#FAF8F5" stroke="#475569" strokeWidth="1.2" />
                                                
                                                {/* Collar */}
                                                <path d="M 48,27 C 52,32 68,32 72,27" stroke="#475569" strokeWidth="1" />
                                                
                                                {/* 1. Shoulder Line */}
                                                <line x1="38" y1="26" x2="82" y2="26" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2" />
                                                <circle cx="38" cy="26" r="1.5" fill="#b91c1c" />
                                                <circle cx="82" cy="26" r="1.5" fill="#b91c1c" />
                                                <circle cx="60" cy="26" r="5" fill="white" stroke="#b91c1c" strokeWidth="1" />
                                                <text x="60" y="28.5" fontSize="7" textAnchor="middle" fill="#b91c1c" fontWeight="bold">1</text>

                                                {/* 2. Bust Line */}
                                                <line x1="35" y1="45" x2="85" y2="45" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2" />
                                                <circle cx="35" cy="45" r="1.5" fill="#b91c1c" />
                                                <circle cx="85" cy="45" r="1.5" fill="#b91c1c" />
                                                <circle cx="60" cy="45" r="5" fill="white" stroke="#b91c1c" strokeWidth="1" />
                                                <text x="60" y="47.5" fontSize="7" textAnchor="middle" fill="#b91c1c" fontWeight="bold">2</text>

                                                {/* 3. Waist Line */}
                                                <line x1="35" y1="70" x2="85" y2="70" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2" />
                                                <circle cx="35" cy="70" r="1.5" fill="#b91c1c" />
                                                <circle cx="85" cy="70" r="1.5" fill="#b91c1c" />
                                                <circle cx="60" cy="70" r="5" fill="white" stroke="#b91c1c" strokeWidth="1" />
                                                <text x="60" y="72.5" fontSize="7" textAnchor="middle" fill="#b91c1c" fontWeight="bold">3</text>

                                                {/* 4. Hips / Hem Line */}
                                                <line x1="35" y1="100" x2="85" y2="100" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2" />
                                                <circle cx="35" cy="100" r="1.5" fill="#b91c1c" />
                                                <circle cx="85" cy="100" r="1.5" fill="#b91c1c" />
                                                <circle cx="60" cy="100" r="5" fill="white" stroke="#b91c1c" strokeWidth="1" />
                                                <text x="60" y="102.5" fontSize="7" textAnchor="middle" fill="#b91c1c" fontWeight="bold">4</text>

                                                {/* 5. Length Line */}
                                                <line x1="50" y1="27" x2="50" y2="100" stroke="#065f46" strokeWidth="1" strokeDasharray="2,2" />
                                                <circle cx="50" cy="27" r="1.5" fill="#065f46" />
                                                <circle cx="50" cy="100" r="1.5" fill="#065f46" />
                                                <circle cx="50" cy="60" r="5" fill="white" stroke="#065f46" strokeWidth="1" />
                                                <text x="50" y="62.5" fontSize="7" textAnchor="middle" fill="#065f46" fontWeight="bold">5</text>

                                                {/* 6. Sleeve Line */}
                                                <line x1="80" y1="25" x2="102" y2="60" stroke="#d97706" strokeWidth="1" strokeDasharray="2,2" />
                                                <circle cx="80" cy="25" r="1.5" fill="#d97706" />
                                                <circle cx="102" cy="60" r="1.5" fill="#d97706" />
                                                <circle cx="91" cy="42.5" r="5" fill="white" stroke="#d97706" strokeWidth="1" />
                                                <text x="91" y="45" fontSize="7" textAnchor="middle" fill="#d97706" fontWeight="bold">6</text>
                                            </svg>
                                        </div>

                                        {/* Below: Sizing Descriptions in a 2-Column Grid */}
                                        <div className="w-full">
                                            <p className="font-bold text-obsidian uppercase tracking-wider text-[9px] mb-4 text-center">How to measure the product's size?</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-[10px] text-stone-500 font-serif leading-relaxed">
                                                <div>
                                                    <span className="font-semibold text-burgundy tracking-wider">1. SHOULDER</span>
                                                    <p className="text-stone-400 mt-0.5">Measure from where the shoulder seam meets the sleeve from one side to the other side.</p>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-burgundy tracking-wider">2. BUST</span>
                                                    <p className="text-stone-400 mt-0.5">Measure from the stitches below the armpits from one side to the other.</p>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-burgundy tracking-wider">3. WAIST</span>
                                                    <p className="text-stone-400 mt-0.5">Measure straight across the narrowest waistline from edge to edge.</p>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-burgundy tracking-wider">4. HIPS</span>
                                                    <p className="text-stone-400 mt-0.5">Measure straight across the widest hip line from edge to edge.</p>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-burgundy tracking-wider">5. LENGTH</span>
                                                    <p className="text-stone-400 mt-0.5">Measure from where the shoulder seam meets the collar to the hem.</p>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-burgundy tracking-wider">6. SLEEVES</span>
                                                    <p className="text-stone-400 mt-0.5">Measure from where the shoulder seam meets the sleeve to the cuff.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[9px] text-stone-400 mt-6 italic leading-normal border-t border-stone-100 pt-3 font-serif">
                                    * Custom tailors are available for bridal orders. Please contact customer concierge via WhatsApp for exact custom adjustments.
                                </p>
                            </div>
                        )}

                        {/* Tab 2: Find My Size */}
                        {sizeGuideTab === 'finder' && (
                            <div>
                                {finderStep === 'main' ? (
                                    <div className="flex flex-col animate-fadeIn">
                                        {/* Savana-style top button banner */}
                                        <button
                                            type="button"
                                            onClick={() => setFinderStep('edit')}
                                            className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-obsidian text-[10px] font-semibold uppercase tracking-widest transition-colors mb-5 text-center border border-stone-200/50 rounded-none"
                                        >
                                            Add more information
                                        </button>

                                        <div className="flex items-center justify-center gap-6 md:gap-10 py-2 border-b border-gold-zari/10">
                                            {/* Left Side: Premium SVG Torso Silhouette */}
                                            <div className="relative w-32 flex-shrink-0 flex justify-center">
                                                {/* CSS Animations style tag */}
                                                <style>{`
                                                    @keyframes marchLine {
                                                        0% { stroke-dashoffset: 24; }
                                                        100% { stroke-dashoffset: 0; }
                                                    }
                                                    @keyframes pulseArea {
                                                        0% { opacity: 0.3; }
                                                        50% { opacity: 0.7; }
                                                        100% { opacity: 0.3; }
                                                    }
                                                    @keyframes pulseBustArea {
                                                        0% { fill: rgba(185, 28, 28, 0.05); }
                                                        50% { fill: rgba(185, 28, 28, 0.25); }
                                                        100% { fill: rgba(185, 28, 28, 0.05); }
                                                    }
                                                    @keyframes pulseWaistArea {
                                                        0% { fill: rgba(217, 119, 6, 0.05); }
                                                        50% { fill: rgba(217, 119, 6, 0.25); }
                                                        100% { fill: rgba(217, 119, 6, 0.05); }
                                                    }
                                                    .march-active {
                                                        animation: marchLine 1.5s linear infinite;
                                                    }
                                                    .pulse-height {
                                                        animation: pulseArea 2s ease-in-out infinite;
                                                    }
                                                    .pulse-bust {
                                                        animation: pulseBustArea 1.5s ease-in-out infinite;
                                                    }
                                                    .pulse-waist {
                                                        animation: pulseWaistArea 1.5s ease-in-out infinite;
                                                    }
                                                `}</style>
                                                <svg viewBox="0 0 120 250" className="w-24 h-auto text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                  {/* Hair */}
                                                  <path d="M60,10 C65,10 70,14 70,20 C70,28 65,30 60,30 C55,30 50,28 50,20 C50,14 55,10 60,10 Z" fill="#1c1917" />
                                                  {/* Head */}
                                                  <circle cx="60" cy="22" r="8" fill="#f5f5f4" stroke="#1c1917" strokeWidth="1" />
                                                  {/* Neck */}
                                                  <path d="M57,30 L57,36 L63,36 L63,30" stroke="#1c1917" strokeWidth="1.2" />
                                                  {/* Body Outline */}
                                                  <path d="M42,40 C42,40 50,38 60,38 C70,38 78,40 78,40 C85,42 90,46 90,52 C90,60 86,75 84,95 C82,115 85,130 85,140 C85,150 82,165 80,185 C78,205 75,230 75,245 L62,245 L62,150 L58,150 L58,245 L45,245 C45,230 42,205 40,185 C38,165 35,150 35,140 C35,130 38,115 36,95 C34,75 30,60 30,52 C30,46 35,42 42,40 Z" fill="#f5f5f4" stroke="#1c1917" strokeWidth="1.2" />
                                                  
                                                  {/* Active pulses behind crop top/briefs */}
                                                  {activeField === 'bust' && (
                                                      <ellipse cx="60" cy="72" rx="25" ry="12" className="pulse-bust" stroke="none" />
                                                  )}
                                                  {activeField === 'waist' && (
                                                      <ellipse cx="60" cy="98" rx="20" ry="10" className="pulse-waist" stroke="none" />
                                                  )}
                                                  
                                                  {/* Crop Top (Slate blue/grey) */}
                                                  <path d="M34,60 C34,60 48,55 60,55 C72,55 86,60 86,60 C86,65 85,75 83,85 C83,85 60,90 37,85 C35,75 34,65 34,60 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                                                  <path d="M42,40 L45,55" stroke="#475569" strokeWidth="1.2" />
                                                  <path d="M78,40 L75,55" stroke="#475569" strokeWidth="1.2" />

                                                  {/* Briefs (Slate blue/grey) */}
                                                  <path d="M35,115 C35,115 48,110 60,110 C72,110 85,115 85,115 C85,125 78,145 60,145 C42,145 35,125 35,115 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                                                  
                                                  {/* Height Vertical helper line */}
                                                  {activeField === 'hw' && (
                                                      <g className="pulse-height" stroke="#c9a563">
                                                          <line x1="108" y1="12" x2="108" y2="245" strokeWidth="1.2" strokeDasharray="3,3" />
                                                          <path d="M105,17 L108,12 L111,17" strokeWidth="1.2" fill="none" />
                                                          <path d="M105,240 L108,245 L111,240" strokeWidth="1.2" fill="none" />
                                                      </g>
                                                  )}

                                                  {/* Bust Line wrap (active highlight) */}
                                                  <path d="M22,72 Q60,78 98,72" stroke="#b91c1c" strokeWidth={activeField === 'bust' ? "2" : "1.2"} strokeDasharray="5,3" className={activeField === 'bust' ? "march-active" : ""} />
                                                  <path d="M98,72 Q60,66 22,72" stroke="#b91c1c" strokeWidth="1" opacity="0.3" />
                                                  <circle cx="22" cy="72" r={activeField === 'bust' ? "4" : "2.5"} fill="#b91c1c" />
                                                  
                                                  {/* Waist Line wrap (active highlight) */}
                                                  <path d="M31,98 Q60,103 89,98" stroke="#d97706" strokeWidth={activeField === 'waist' ? "2" : "1.2"} strokeDasharray="5,3" className={activeField === 'waist' ? "march-active" : ""} />
                                                  <path d="M89,98 Q60,93 31,98" stroke="#d97706" strokeWidth="1" opacity="0.3" />
                                                  <circle cx="31" cy="98" r={activeField === 'waist' ? "4" : "2.5"} fill="#d97706" />

                                                  {/* Line Badges */}
                                                  <circle cx="15" cy="72" r="6" fill="white" stroke="#b91c1c" strokeWidth="1" />
                                                  <text x="15" y="74.5" fontSize="7" textAnchor="middle" fill="#b91c1c" fontWeight="bold">1</text>

                                                  <circle cx="15" cy="98" r="6" fill="white" stroke="#d97706" strokeWidth="1" />
                                                  <text x="15" y="100.5" fontSize="7" textAnchor="middle" fill="#d97706" fontWeight="bold">2</text>
                                                </svg>
                                            </div>

                                            {/* Right Side: Stacked Input Cards */}
                                            <div className="flex flex-col gap-2.5 w-full max-w-[200px]">
                                                <button 
                                                    type="button"
                                                    onClick={() => { setActiveField('hw'); setFinderStep('edit'); }}
                                                    className={cn(
                                                        "p-2.5 border text-center flex flex-col items-center justify-center transition-all duration-300 rounded-none",
                                                        activeField === 'hw' 
                                                            ? "border-gold-zari bg-gold-zari/5 shadow-[0_2px_8px_rgba(201,165,99,0.12)]" 
                                                            : "border-gold-zari/15 bg-white/50 hover:border-gold-zari/45"
                                                    )}
                                                >
                                                    <span className="text-xs font-bold text-obsidian uppercase tracking-wider font-serif">
                                                        {hasEnteredInfo ? `${finderHeight} cm / ${finderWeight} kg` : "-- / --"}
                                                    </span>
                                                    <span className="text-[9px] uppercase tracking-widest text-stone-500 mt-1">Height/Weight</span>
                                                </button>

                                                <button 
                                                    type="button"
                                                    onClick={() => { setActiveField('bust'); setFinderStep('edit'); }}
                                                    className={cn(
                                                        "p-2.5 border text-center flex items-center justify-between transition-all duration-300 rounded-none",
                                                        activeField === 'bust' 
                                                            ? "border-burgundy bg-burgundy/5 shadow-[0_2px_8px_rgba(114,35,46,0.12)]" 
                                                            : "border-gold-zari/15 bg-white/50 hover:border-gold-zari/45"
                                                    )}
                                                >
                                                    <span className="w-4 h-4 rounded-full bg-burgundy/10 flex items-center justify-center text-[9px] font-bold text-burgundy border border-burgundy/20">1</span>
                                                    <div className="flex flex-col items-center flex-1">
                                                        <span className="text-xs font-bold text-obsidian font-serif">{hasEnteredInfo ? `${finderBust} in` : "-"}</span>
                                                        <span className="text-[9px] uppercase tracking-widest text-stone-500 mt-1">Bust</span>
                                                    </div>
                                                    <span className="w-4"></span>
                                                </button>

                                                <button 
                                                    type="button"
                                                    onClick={() => { setActiveField('waist'); setFinderStep('edit'); }}
                                                    className={cn(
                                                        "p-2.5 border text-center flex items-center justify-between transition-all duration-300 rounded-none",
                                                        activeField === 'waist' 
                                                            ? "border-gold-zari bg-gold-zari/5 shadow-[0_2px_8px_rgba(201,165,99,0.12)]" 
                                                            : "border-gold-zari/15 bg-white/50 hover:border-gold-zari/45"
                                                    )}
                                                >
                                                    <span className="w-4 h-4 rounded-full bg-gold-zari/10 flex items-center justify-center text-[9px] font-bold text-gold-zari border border-gold-zari/20">2</span>
                                                    <div className="flex flex-col items-center flex-1">
                                                        <span className="text-xs font-bold text-obsidian font-serif">{hasEnteredInfo ? `${finderWaist} in` : "-"}</span>
                                                        <span className="text-[9px] uppercase tracking-widest text-stone-500 mt-1">Waist</span>
                                                    </div>
                                                    <span className="w-4"></span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Results & Action */}
                                        <div className="mt-6 text-center flex flex-col items-center gap-3">
                                            {hasEnteredInfo ? (
                                                <>
                                                    <p className="text-xs uppercase tracking-widest text-stone-500">
                                                        Recommended Size: <span className="font-bold text-burgundy text-sm font-serif">{calculatedSize}</span>
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedSize(calculatedSize);
                                                            setIsSizeGuideOpen(false);
                                                        }}
                                                        className="w-full h-11 bg-burgundy text-white uppercase tracking-widest text-[10px] font-semibold hover:bg-stone-900 transition-colors shadow-md flex items-center justify-center gap-2"
                                                    >
                                                        Apply Size {calculatedSize} to Product
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-xs uppercase tracking-widest text-stone-400 italic">
                                                        Please enter measurements to calculate recommended size.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveField('hw');
                                                            setFinderStep('edit');
                                                        }}
                                                        className="w-full h-11 bg-stone-100 hover:bg-stone-200 text-obsidian uppercase tracking-widest text-[10px] font-semibold transition-colors shadow-sm flex items-center justify-center border border-stone-200"
                                                    >
                                                        Enter Sizing Measurements
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-5 animate-fadeIn">
                                        <div className="flex justify-between items-center border-b border-gold-zari/10 pb-3">
                                            <h3 className="font-serif text-sm font-bold text-obsidian uppercase tracking-wider">For Clothing Size Recommendation</h3>
                                            
                                            {/* CM/IN Toggle */}
                                            <div className="border border-gold-zari/30 rounded-none overflow-hidden flex text-[8px] font-bold tracking-widest">
                                                <button 
                                                    type="button"
                                                    onClick={() => setUnit('cm')}
                                                    className={cn("px-2.5 py-1.5 transition-colors", unit === 'cm' ? "bg-black text-white" : "bg-white text-black")}
                                                >
                                                    CM
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setUnit('in')}
                                                    className={cn("px-2.5 py-1.5 transition-colors", unit === 'in' ? "bg-black text-white" : "bg-white text-black")}
                                                >
                                                    IN
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <p className="text-[10px] text-stone-500 leading-relaxed font-serif italic">
                                            Your details help us find your perfect fit. Move the slider to enter your body measurements and get personalized size suggestions.
                                        </p>

                                        {/* Height Slider */}
                                        {unit === 'in' ? (
                                            renderRulerSlider(
                                                "Height",
                                                Math.round(finderHeight / 2.54),
                                                55,
                                                79,
                                                (val) => setFinderHeight(Math.round(val * 2.54)),
                                                "inch",
                                                `${Math.floor(Math.round(finderHeight / 2.54) / 12)} ft ${Math.round(finderHeight / 2.54) % 12} inch`
                                            )
                                        ) : (
                                            renderRulerSlider(
                                                "Height",
                                                finderHeight,
                                                140,
                                                200,
                                                (val) => setFinderHeight(val),
                                                "cm"
                                            )
                                        )}

                                        {/* Weight Slider */}
                                        {renderRulerSlider(
                                            "Weight",
                                            finderWeight,
                                            40,
                                            110,
                                            (val) => {
                                                setFinderWeight(val);
                                                if (!bustCustomized) {
                                                    const estBust = Math.round((val * 0.4) + 12);
                                                    setFinderBust(String(estBust));
                                                }
                                                if (!waistCustomized) {
                                                    const estWaist = Math.round((val * 0.4) + 4);
                                                    setFinderWaist(String(estWaist));
                                                }
                                            },
                                            "kg"
                                        )}

                                        {/* Bust Slider */}
                                        {unit === 'in' ? (
                                            renderRulerSlider(
                                                "Bust",
                                                parseInt(finderBust) || 36,
                                                30,
                                                48,
                                                (val) => { setFinderBust(String(val)); setBustCustomized(true); },
                                                "inch"
                                            )
                                        ) : (
                                            renderRulerSlider(
                                                "Bust",
                                                Math.round((parseInt(finderBust) || 36) * 2.54),
                                                76,
                                                122,
                                                (val) => { setFinderBust(String(Math.round(val / 2.54))); setBustCustomized(true); },
                                                "cm"
                                            )
                                        )}

                                        {/* Waist Slider */}
                                        {unit === 'in' ? (
                                            renderRulerSlider(
                                                "Waistline",
                                                parseInt(finderWaist) || 28,
                                                22,
                                                44,
                                                (val) => { setFinderWaist(String(val)); setWaistCustomized(true); },
                                                "inch"
                                            )
                                        ) : (
                                            renderRulerSlider(
                                                "Waistline",
                                                Math.round((parseInt(finderWaist) || 28) * 2.54),
                                                56,
                                                112,
                                                (val) => { setFinderWaist(String(Math.round(val / 2.54))); setWaistCustomized(true); },
                                                "cm"
                                            )
                                        )}

                                        {/* Terms Agreement Checkbox */}
                                        <label className="flex items-start gap-3 cursor-pointer mt-2">
                                            <input 
                                                type="checkbox" 
                                                checked={agreedToTerms}
                                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                className="mt-0.5 rounded-none accent-black cursor-pointer w-3.5 h-3.5 border-stone-300"
                                            />
                                            <span className="text-[9px] text-stone-500 leading-normal font-serif italic">
                                                I agree the above information will only be used for size recommendation and not allowed for any other commercial purpose
            </span>
                                        </label>

                                        {/* Update Button */}
                                        <button
                                            type="button"
                                            disabled={!agreedToTerms}
                                            onClick={() => {
                                                setFinderStep('main');
                                                setHasEnteredInfo(true);
                                            }}
                                            className="w-full h-11 bg-black text-white uppercase tracking-widest text-[10px] font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50 mt-2 rounded-none"
                                        >
                                            Update
                                        </button>
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
