"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Search, SlidersHorizontal, Grid, List } from "lucide-react";
import { products as mockProducts } from "@/lib/data";

const CATEGORIES = ["All", "Evening Wear", "Cocktail", "Gala", "Prom", "Party", "Casual"];
const SORT_OPTIONS = [
    { label: "Newest", value: "created_at-desc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Popular", value: "rating-desc" },
];

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("created_at-desc");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [shopCms, setShopCms] = useState<any>({
        banner_image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop",
        banner_badge: "The Collections",
        banner_title: "Shop Boutique",
        banner_desc: "Explore our handcrafted bridal, evening, and luxury fusion collections designed to leave a lasting trace.",
        categories: ["All", "Evening Wear", "Cocktail", "Gala", "Prom", "Party", "Casual"]
    });
    const supabase = createClient();

    useEffect(() => { fetchProducts(); }, [category, sort]);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('admin_settings')
                .select('*')
                .eq('key', 'shop_cms')
                .single();
            if (data && data.value) {
                try {
                    const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
                    setShopCms((prev: any) => ({ ...prev, ...val }));
                } catch (e) {
                    console.error("Failed to parse shop settings", e);
                }
            }
        };
        fetchSettings();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('products')
                .select('*')
                .eq('is_active', true);

            if (category !== 'All') {
                query = query.eq('category', category);
            }

            const [sortField, sortDir] = sort.split('-');
            query = query.order(sortField, { ascending: sortDir === 'asc' });

            const { data, error } = await query;
            
            if (error || !data || data.length === 0) {
                console.log("Using mock products in Shop due to DB empty/error");
                let mocks = [...mockProducts];
                if (category !== 'All') {
                     mocks = mocks.filter(m => m.category === category);
                }
                
                if (sortField === 'price') {
                    mocks.sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price);
                } else if (sortField === 'rating') {
                    mocks.sort((a, b) => b.rating - a.rating);
                }
                
                setProducts(mocks);
            } else {
                setProducts(data);
            }
        } catch (e) {
            console.error(e);
            setProducts(mockProducts);
        } finally {
            setLoading(false);
        }
    };

    const filtered = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
        const matchesSize = selectedSize ? p.sizes?.includes(selectedSize) : true;
        const matchesColor = selectedColor ? p.colors?.includes(selectedColor) : true;
        const matchesRating = (p.rating || 0) >= minRating;
        return matchesSearch && matchesSize && matchesColor && matchesRating;
    });

    const allSizes = Array.from(new Set(products.flatMap(p => p.sizes || []))).filter(Boolean);
    const allColors = Array.from(new Set(products.flatMap(p => p.colors || []))).filter(Boolean);

    return (
        <div className="min-h-screen bg-alabaster text-obsidian pt-20">
            {/* Editorial Page Header */}
            <div className="bg-obsidian text-alabaster py-24 text-center border-b border-gold-zari/15 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15">
                     <img
                         src={shopCms.banner_image}
                         alt="Luxury Background"
                         className="w-full h-full object-cover"
                     />
                </div>
                <div className="relative z-10 max-w-2xl mx-auto px-4">
                    <span className="text-gold-zari text-xs uppercase tracking-[0.25em] block mb-3 font-semibold">{shopCms.banner_badge}</span>
                    <h1 className="font-serif text-4xl md:text-5xl mb-4 uppercase tracking-widest text-alabaster">{shopCms.banner_title}</h1>
                    <div className="w-12 h-[1px] bg-gold-zari mx-auto mb-4"></div>
                    <p className="text-stone-400 font-serif italic text-sm md:text-base leading-relaxed">
                        {shopCms.banner_desc}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl py-12">
                {/* Categories & Layout Switches */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    {/* Category pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide flex-1 w-full">
                        {(shopCms.categories || CATEGORIES).map((cat: string) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 text-[10px] uppercase tracking-widest whitespace-nowrap rounded-sm transition-all duration-300 font-semibold border ${
                                    category === cat 
                                        ? 'bg-burgundy text-white border-burgundy shadow-sm' 
                                        : 'bg-silk-ivory text-rose-ash/80 border-gold-zari/20 hover:border-gold-zari/45 hover:bg-neutral-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Filter and View Toggles */}
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-sm text-[10px] uppercase tracking-widest transition-all duration-300 font-semibold ${
                                showFilterPanel
                                    ? "bg-burgundy text-white border-burgundy"
                                    : "bg-silk-ivory text-obsidian border-gold-zari/30 hover:border-gold-antique"
                            }`}
                        >
                            <SlidersHorizontal size={12} className={showFilterPanel ? "text-white" : "text-gold-zari"} />
                            Filter & Sort
                        </button>

                        <div className="flex items-center gap-1 border border-gold-zari/20 p-1 rounded-sm bg-silk-ivory">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded-sm transition-colors flex items-center justify-center ${viewMode === "grid" ? "bg-burgundy text-white shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
                                title="Grid View"
                            >
                                <Grid size={14} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 rounded-sm transition-colors flex items-center justify-center ${viewMode === "list" ? "bg-burgundy text-white shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
                                title="List View"
                            >
                                <List size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Collapsible Filter Panel */}
                {showFilterPanel && (
                    <div className="bg-silk-ivory border border-gold-zari/20 p-6 md:p-8 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-fadeIn text-left rounded-sm shadow-sm">
                        {/* Search Input */}
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-widest text-gold-zari font-semibold">Search Collection</label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-zari" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Enter keywords..."
                                    className="w-full pl-9 pr-4 py-2.5 border border-gold-zari/25 bg-alabaster rounded-sm text-xs focus:outline-none focus:border-burgundy text-obsidian placeholder:text-rose-ash/30"
                                />
                            </div>
                        </div>

                        {/* Sizing buttons */}
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-widest text-gold-zari font-semibold">Sizes</label>
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    onClick={() => setSelectedSize("")}
                                    className={`px-2.5 py-1.5 text-[9px] uppercase tracking-widest border rounded-sm transition-all font-semibold ${
                                        selectedSize === ""
                                            ? "border-burgundy bg-burgundy text-white"
                                            : "border-gold-zari/20 bg-alabaster hover:border-gold-zari text-rose-ash"
                                    }`}
                                >
                                    All
                                </button>
                                {allSizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-2.5 py-1.5 text-[9px] uppercase tracking-widest border rounded-sm transition-all font-semibold ${
                                            selectedSize === size
                                                ? "border-burgundy bg-burgundy text-white"
                                                : "border-gold-zari/20 bg-alabaster hover:border-gold-zari text-rose-ash"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors dropdown */}
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-widest text-gold-zari font-semibold">Colorway</label>
                            <select
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-full border border-gold-zari/25 p-2.5 bg-alabaster rounded-sm text-xs focus:outline-none focus:border-burgundy text-obsidian capitalize font-medium"
                            >
                                <option value="">All Colors</option>
                                {allColors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sorting Options */}
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-widest text-gold-zari font-semibold">Sort By</label>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full border border-gold-zari/25 p-2.5 bg-alabaster rounded-sm text-xs focus:outline-none focus:border-burgundy text-obsidian font-medium"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Product Listings Container */}
                {loading ? (
                    <div className="text-center py-32 text-stone-400 font-serif italic">Loading boutique products...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32 bg-silk-ivory border border-gold-zari/15 p-8 rounded-sm">
                        <p className="text-rose-ash font-serif text-lg mb-2">No boutique creations found</p>
                        <p className="text-stone-400 text-sm italic">Adjust your search terms or filter configurations.</p>
                    </div>
                ) : (
                    <div className={viewMode === "grid" 
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                        : "flex flex-col gap-6 max-w-4xl mx-auto"
                    }>
                        {filtered.map(product => (
                            <Link key={product.id} href={`/product/${product.id}`} className={viewMode === "grid" 
                                ? "group block"
                                : "group flex flex-col sm:flex-row gap-6 p-4 border border-gold-zari/15 hover:border-gold-antique/30 hover:shadow-lg transition-all duration-500 rounded-sm bg-silk-ivory text-left"
                            }>
                                {/* Image Container (Double-Image Hover Swap) */}
                                <div className={viewMode === "grid"
                                    ? "aspect-[3/4] bg-neutral-100 relative overflow-hidden rounded-sm mb-3 double-image-container"
                                    : "w-full sm:w-48 aspect-[3/4] sm:h-64 bg-neutral-100 relative overflow-hidden rounded-sm shrink-0 double-image-container"
                                }>
                                    {(product.image_url || product.cardImage || product.images?.[0]) ? (
                                        <>
                                            <img
                                                src={product.image_url || product.cardImage || product.images?.[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover primary-image absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-700 ease-out-expo"
                                            />
                                            <img
                                                src={product.modelImage || product.image_url || product.cardImage || product.images?.[0]}
                                                alt={`${product.name} look`}
                                                className="w-full h-full object-cover secondary-image absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out-expo scale-100 group-hover:scale-105"
                                            />
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">No Image</div>
                                    )}
                                    
                                    {(product.stock || 0) <= 0 && (
                                        <div className="absolute top-2 left-2 bg-burgundy text-white text-[9px] font-semibold px-2 py-1 uppercase tracking-wider">
                                            Sold Out
                                        </div>
                                    )}
                                </div>

                                {/* Text Details */}
                                <div className={viewMode === "grid" ? "px-1" : "flex-1 flex flex-col justify-between py-2"}>
                                    <div>
                                        <div className={viewMode === "grid" ? "" : "flex justify-between items-start gap-4 mb-2"}>
                                            <h3 className="font-serif text-base text-obsidian group-hover:text-burgundy transition-colors duration-300 line-clamp-1">{product.name}</h3>
                                            {viewMode === "list" && (
                                                <p className="text-gold-zari text-xs tracking-wider uppercase font-semibold">{product.category}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="font-serif text-sm font-semibold text-rose-ash">₹{product.price}</p>
                                            {product.rating > 0 && (
                                                <p className="text-xs text-gold-antique">★ {product.rating}</p>
                                            )}
                                        </div>
                                        {viewMode === "list" && (
                                            <p className="text-xs text-stone-500 mt-4 line-clamp-2 md:line-clamp-3 leading-relaxed font-serif italic">
                                                {product.description || "A luxury piece crafted from our select seasonal fabrics. Designed specifically to create a stunning silhouette."}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {viewMode === "list" && (
                                        <div className="mt-6 flex items-center gap-4">
                                            <span className="text-[10px] uppercase tracking-widest text-obsidian font-bold border-b border-obsidian pb-0.5 group-hover:border-gold-zari group-hover:text-gold-zari transition-colors">
                                                View Silhouette
                                            </span>
                                            {product.sizes && product.sizes.length > 0 && (
                                                <div className="flex gap-1.5 text-[8px] text-stone-400 font-semibold">
                                                    {product.sizes.map((s: string) => (
                                                        <span key={s} className="border border-gold-zari/20 px-1.5 py-0.5 rounded-sm bg-silk-ivory">{s}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {viewMode === "grid" && (
                                        <p className="text-[10px] text-gold-zari uppercase tracking-widest mt-1.5 font-semibold">{product.category}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
