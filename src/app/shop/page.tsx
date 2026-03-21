"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown, Grid, List } from "lucide-react";

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
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => { fetchProducts(); }, [category, sort]);

    const fetchProducts = async () => {
        setLoading(true);
        let query = supabase
            .from('products')
            .select('*')
            .eq('is_active', true);

        if (category !== 'All') {
            query = query.eq('category', category);
        }

        const [sortField, sortDir] = sort.split('-');
        query = query.order(sortField, { ascending: sortDir === 'asc' });

        const { data } = await query;
        setProducts(data || []);
        setLoading(false);
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white text-stone-900">
            {/* Hero */}
            <div className="bg-black text-white py-20 text-center">
                <h1 className="font-serif text-5xl mb-3">Shop Collection</h1>
                <p className="text-stone-400 text-sm tracking-wide uppercase">Curated Fashion for Every Occasion</p>
            </div>

            <div className="container mx-auto px-4 max-w-7xl py-10">
                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-black"
                        />
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border border-stone-200 px-4 py-3 rounded-sm text-sm bg-white focus:outline-none"
                    >
                        {SORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 text-xs uppercase tracking-wider whitespace-nowrap rounded-sm transition-colors ${
                                category === cat ? 'bg-black text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="text-center py-20 text-stone-400">Loading products...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-stone-500 text-lg mb-2">No products found</p>
                        <p className="text-stone-400 text-sm">Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filtered.map(product => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group">
                                <div className="aspect-[3/4] bg-stone-100 relative overflow-hidden rounded-sm mb-3">
                                    {(product.image_url || product.cardImage || product.images?.[0]) ? (
                                        <img
                                            src={product.image_url || product.cardImage || product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">No Image</div>
                                    )}
                                    {(product.stock || 0) <= 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 uppercase tracking-wider">
                                            Sold Out
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-medium text-sm group-hover:underline">{product.name}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="font-medium">₹{product.price}</p>
                                    {product.rating > 0 && (
                                        <p className="text-xs text-stone-500">★ {product.rating}</p>
                                    )}
                                </div>
                                <p className="text-xs text-stone-400 mt-0.5">{product.category}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
