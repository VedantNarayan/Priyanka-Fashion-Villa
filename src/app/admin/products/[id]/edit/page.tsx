"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProduct, uploadProductImage } from "@/app/actions/products";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });
        setCategories(data || []);
    };

    const fetchProduct = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('id', params.id)
            .single();

        setProduct(data);
        if (data?.images?.length > 0) {
            setImages(data.images);
        } else if (data?.image_url) {
            setImages([data.image_url]);
        }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const url = await uploadProductImage(formData);
        if (url) {
            setImages([...images, url]);
        }
        setUploading(false);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        formData.set("images", JSON.stringify(images));
        if (images.length > 0) {
            formData.set("image_url", images[0]);
        }
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
                        <select
                            name="category"
                            defaultValue={product.category}
                            required
                            className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black bg-white"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                            {product.category && !categories.some(c => c.name === product.category) && (
                                <option value={product.category}>{product.category}</option>
                            )}
                        </select>
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
                <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Product Images</label>
                    <p className="text-xs text-stone-500 mb-2">First image is the Main Card Image. Second is the Model Hover Image. The rest appear in the gallery.</p>
                    <div className="flex flex-wrap items-start gap-4">
                        {images.map((url, i) => (
                            <div key={i} className="relative w-24 h-32 border border-stone-200 rounded-sm overflow-hidden group">
                                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hidden group-hover:block hover:bg-white">
                                    <X size={14} />
                                </button>
                                {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">Card</span>}
                                {i === 1 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">Model</span>}
                            </div>
                        ))}
                        
                        <label className="w-24 h-32 border border-dashed border-stone-300 p-3 rounded-sm cursor-pointer hover:bg-stone-50 transition-colors flex flex-col items-center justify-center">
                            {uploading ? (
                                <Loader2 className="animate-spin text-stone-400" size={20} />
                            ) : (
                                <>
                                    <Upload size={20} className="text-stone-400 mb-1" />
                                    <span className="text-[10px] text-stone-500 uppercase">Upload</span>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                        </label>
                    </div>
                    {/* Fallback URL input + hidden JSON payload */}
                    <input type="hidden" name="images" value={JSON.stringify(images)} />
                    <input type="url" name="image_url" id="image_url" defaultValue={images[0] || ""} className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black mt-2" placeholder="Or paste primary image URL here (fallback)" />
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
