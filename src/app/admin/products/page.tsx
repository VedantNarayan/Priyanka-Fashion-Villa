"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        setProducts(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Delete "${name}"? This will hide it from the store.`)) {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-3xl">Products</h1>
                <Link href="/admin/products/new" className="bg-black text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex items-center gap-2">
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            <div className="mb-6 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full md:w-96 pl-10 pr-4 py-3 border border-stone-200 rounded-sm text-sm text-black focus:outline-none focus:border-black bg-white"
                />
            </div>

            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Product</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Category</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Price</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Stock</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-stone-400">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                                {search ? 'No products match your search.' : 'No products found. Add your first product!'}
                            </td></tr>
                        ) : (
                            filtered.map((product: any) => (
                                <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.image_url || product.images?.[0] ? (
                                                <img src={product.image_url || product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-sm" />
                                            ) : (
                                                <div className="w-12 h-12 bg-stone-100 rounded-sm flex items-center justify-center">
                                                    <Package size={20} className="text-stone-300" />
                                                </div>
                                            )}
                                            <span className="font-medium text-sm">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-600">{product.category}</td>
                                    <td className="px-6 py-4 text-sm font-medium">₹{product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                            (product.stock || 0) <= 0 ? 'bg-red-100 text-red-700' :
                                            (product.stock || 0) <= 10 ? 'bg-amber-100 text-amber-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {product.stock || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-stone-400 hover:text-black transition-colors" title="Edit">
                                                <Edit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(product.id, product.name)} className="p-2 text-stone-400 hover:text-red-500 transition-colors" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
