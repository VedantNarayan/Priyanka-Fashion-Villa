"use client";

import { addProduct } from "@/app/actions/products";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";

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

export default function NewProductPage() {
    const [state, formAction] = useFormState(addProduct, initialState);

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
                        <select name="category" id="category" className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors">
                            <option value="Evening Wear">Evening Wear</option>
                            <option value="Cocktail">Cocktail</option>
                            <option value="Gala">Gala</option>
                            <option value="Prom">Prom</option>
                            <option value="Party">Party</option>
                            <option value="Casual">Casual</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-stone-700">Description</label>
                    <textarea name="description" id="description" rows={4} className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="Product description..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="price" className="block text-sm font-medium text-stone-700">Price ($)</label>
                        <input type="number" name="price" id="price" required step="0.01" className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="0.00" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="stock" className="block text-sm font-medium text-stone-700">Stock</label>
                        <input type="number" name="stock" id="stock" required className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="0" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="image_url" className="block text-sm font-medium text-stone-700">Image URL</label>
                        <input type="url" name="image_url" id="image_url" className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors text-black" placeholder="https://..." />
                    </div>
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
