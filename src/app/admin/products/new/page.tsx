"use client";

import { addProduct, uploadProductImage } from "@/app/actions/products";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Loader2 } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";
import { useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
            <Save size={16} /> {pending ? "Saving..." : "Save Product"}
        </button>
    );
}

const initialState = {
    message: "",
    error: ""
}

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export default function NewProductPage() {
    const [state, formAction] = useFormState(addProduct, initialState);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from("categories")
                .select("*")
                .order("name", { ascending: true });
            setCategories(data || []);
        };
        fetchCategories();
    }, [supabase]);

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

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="font-serif text-3xl">Add New Product</h1>
            </div>

            {state?.error && state.error !== "" && (
                <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-sm border border-red-100">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="bg-white p-8 rounded-sm shadow-sm space-y-6">
                {/* ... fields ... */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700">Product Name</label>
                        <input type="text" name="name" id="name" required className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="e.g. Noir Enchanté Gown" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-stone-700">Category</label>
                        <select name="category" id="category" required className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors bg-white text-black">
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                            {categories.length === 0 && (
                                <>
                                    <option value="Evening Wear">Evening Wear</option>
                                    <option value="Cocktail">Cocktail</option>
                                    <option value="Gala">Gala</option>
                                    <option value="Prom">Prom</option>
                                    <option value="Party">Party</option>
                                    <option value="Casual">Casual</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-stone-700">Description</label>
                    <textarea name="description" id="description" rows={4} className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="Product description..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="price" className="block text-sm font-medium text-stone-700">Price (₹)</label>
                        <input type="number" name="price" id="price" required step="0.01" className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="0.00" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="stock" className="block text-sm font-medium text-stone-700">Stock</label>
                        <input type="number" name="stock" id="stock" required className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="0" />
                    </div>
                </div>

                {/* Multiple Image Upload */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-stone-700">Product Images</label>
                    <p className="text-xs text-stone-500 mb-2">First image is the Main Card Image. Second is the Model Hover Image. The rest appear in the gallery.</p>
                    
                    <div className="flex flex-wrap gap-4">
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

                        <label className="w-24 h-32 border-2 border-dashed border-stone-300 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors">
                            {uploading ? (
                                <Loader2 className="animate-spin text-stone-400" size={20} />
                            ) : (
                                <>
                                    <Upload className="text-stone-400 mb-1" size={20} />
                                    <span className="text-[10px] text-stone-500 uppercase">Upload</span>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                        </label>
                    </div>
                    
                    {/* Fallback URL input + hidden JSON payload */}
                    <input type="hidden" name="images" value={JSON.stringify(images)} />
                    <input type="url" name="image_url" id="image_url" className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black mt-2" placeholder="Or paste primary image URL here (fallback)" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="sizes" className="block text-sm font-medium text-stone-700">Sizes (comma separated)</label>
                        <input type="text" name="sizes" id="sizes" className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="XS, S, M, L" defaultValue="XS, S, M, L" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="colors" className="block text-sm font-medium text-stone-700">Colors (comma separated)</label>
                        <input type="text" name="colors" id="colors" className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="Black, Red, Blue" />
                    </div>
                </div>

                <div className="pt-6 border-t border-stone-100 flex justify-end">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
