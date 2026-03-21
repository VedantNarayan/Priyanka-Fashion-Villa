"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProduct, uploadProductImage } from "@/app/actions/products";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const supabase = createClient();

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('id', params.id)
            .single();

        setProduct(data);
        setImageUrl(data?.image_url || data?.images?.[0] || "");
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const url = await uploadProductImage(formData);
        if (url) setImageUrl(url);
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        formData.set("image_url", imageUrl);
        await updateProduct(params.id as string, formData);
    };

    if (loading) return <div className="text-stone-400 text-center py-12">Loading product...</div>;
    if (!product) return <div className="text-stone-400 text-center py-12">Product not found.</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="font-serif text-3xl">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-sm shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Product Name</label>
                        <input name="name" defaultValue={product.name} required className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Category</label>
                        <input name="category" defaultValue={product.category} required className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Description</label>
                    <textarea name="description" defaultValue={product.description} rows={3} className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Price (₹)</label>
                        <input name="price" type="number" step="0.01" defaultValue={product.price} required className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Stock</label>
                        <input name="stock" type="number" defaultValue={product.stock || 0} required className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                    </div>
                </div>

                {/* Image */}
                <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Product Image</label>
                    <div className="flex items-start gap-4">
                        {imageUrl && (
                            <img src={imageUrl} alt="Product" className="w-24 h-24 object-cover rounded-sm border border-stone-200" />
                        )}
                        <div className="flex-1 space-y-2">
                            <label className="flex items-center gap-2 border border-dashed border-stone-300 p-3 rounded-sm cursor-pointer hover:bg-stone-50 transition-colors">
                                <Upload size={16} className="text-stone-400" />
                                <span className="text-sm text-stone-500">{uploading ? 'Uploading...' : 'Upload new image'}</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                            <input name="image_url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste image URL" className="w-full border border-stone-200 p-2 rounded-sm text-xs text-black focus:outline-none focus:border-black" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Sizes (comma-separated)</label>
                        <input name="sizes" defaultValue={product.sizes?.join(', ')} className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Colors (comma-separated)</label>
                        <input name="colors" defaultValue={product.colors?.join(', ')} className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {saving && <Loader2 className="animate-spin" size={16} />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
