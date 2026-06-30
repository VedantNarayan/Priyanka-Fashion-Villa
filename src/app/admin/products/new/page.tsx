"use client";

import { addProduct, uploadProductImageWithBgRemoval, removeBgForImageUrl } from "@/app/actions/products";
import { getBgRemovalStats } from "@/app/actions/bg-removal-stats";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Loader2, Sparkles, Ruler, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";
import { useState, useEffect } from "react";

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

// Default size measurements template
const DEFAULT_MEASUREMENTS = [
    { size: "XS", bust: 32, waist: 24, sleeve: 22, length: 54 },
    { size: "S", bust: 34, waist: 26, sleeve: 22.5, length: 55 },
    { size: "M", bust: 36, waist: 28, sleeve: 23, length: 56 },
    { size: "L", bust: 38, waist: 30, sleeve: 23.5, length: 57 },
    { size: "XL", bust: 40, waist: 32, sleeve: 24, length: 58 },
    { size: "XXL", bust: 42, waist: 34, sleeve: 24.5, length: 59 },
];

type Measurement = { size: string; bust: number; waist: number; sleeve: number; length: number };

export default function NewProductPage() {
    const [state, formAction] = useFormState(addProduct, initialState);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(-1);
    const [bgRemovedFlags, setBgRemovedFlags] = useState<boolean[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const supabase = createClient();

    // Size Chart state
    const [fitType, setFitType] = useState("Regular");
    const [stretchability, setStretchability] = useState("Medium");
    const [measurements, setMeasurements] = useState<Measurement[]>([...DEFAULT_MEASUREMENTS]);
    const [showSizeChart, setShowSizeChart] = useState(false);

    // BG Removal usage stats
    const [bgStats, setBgStats] = useState<any>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from("categories")
                .select("*")
                .order("name", { ascending: true });
            setCategories(data || []);
        };
        fetchCategories();

        // Fetch BG removal stats
        getBgRemovalStats().then(setBgStats).catch(() => {});
    }, [supabase]);

    const [removingBgIndex, setRemovingBgIndex] = useState(-1);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadProductImageWithBgRemoval(formData);
            if (result.url) {
                setImages(prev => [...prev, result.url!]);
                setBgRemovedFlags(prev => [...prev, false]);
            } else {
                const formData2 = new FormData();
                formData2.append("file", file);
                const { uploadProductImage } = await import("@/app/actions/products");
                const url = await uploadProductImage(formData2);
                if (url) {
                    setImages(prev => [...prev, url]);
                    setBgRemovedFlags(prev => [...prev, false]);
                } else {
                    alert("Upload failed. Please check your permissions and try again.");
                }
            }
        } catch (err) {
            console.error("Image upload error:", err);
            alert("Upload failed. Please try again.");
        }
        setUploading(false);
    };

    const handleRemoveBg = async (index: number) => {
        setRemovingBgIndex(index);
        try {
            const result = await removeBgForImageUrl(images[index]);
            if (result.success && result.url) {
                setImages(prev => prev.map((u, i) => i === index ? result.url! : u));
                setBgRemovedFlags(prev => prev.map((f, i) => i === index ? true : f));
                getBgRemovalStats().then(setBgStats).catch(() => {});
            }
        } catch {
            // silently fail
        }
        setRemovingBgIndex(-1);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        setBgRemovedFlags(bgRemovedFlags.filter((_, i) => i !== index));
    };

    const moveImage = (index: number, direction: 'left' | 'right') => {
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= images.length) return;

        // Swap images
        const updatedImages = [...images];
        const tempImage = updatedImages[index];
        updatedImages[index] = updatedImages[targetIndex];
        updatedImages[targetIndex] = tempImage;
        setImages(updatedImages);

        // Swap bgRemovedFlags
        const updatedFlags = [...bgRemovedFlags];
        const tempFlag = updatedFlags[index];
        updatedFlags[index] = updatedFlags[targetIndex];
        updatedFlags[targetIndex] = tempFlag;
        setBgRemovedFlags(updatedFlags);
    };

    const updateMeasurement = (index: number, field: keyof Measurement, value: string) => {
        const updated = [...measurements];
        if (field === 'size') {
            updated[index] = { ...updated[index], size: value };
        } else {
            updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
        }
        setMeasurements(updated);
    };

    const addMeasurementRow = () => {
        setMeasurements([...measurements, { size: "", bust: 0, waist: 0, sleeve: 0, length: 0 }]);
    };

    const removeMeasurementRow = (index: number) => {
        setMeasurements(measurements.filter((_, i) => i !== index));
    };

    const sizeChartJson = JSON.stringify({
        fitType,
        stretchability,
        measurements,
    });

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
                {/* Hidden size chart field */}
                <input type="hidden" name="size_chart" value={sizeChartJson} />

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

                {/* Multiple Image Upload with BG Removal */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-stone-700">Product Images</label>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-amber-500" />
                        <p className="text-xs text-stone-500">Upload images as-is. Use the <strong className="text-amber-600">✨ button</strong> on each image to remove background on demand.</p>
                    </div>
                    
                    {/* BG Removal Usage Counter */}
                    {bgStats && (
                        <div className="bg-stone-50 border border-stone-200 rounded-sm p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-amber-500" />
                                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">BG Removal Usage</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <div className="text-lg font-bold text-stone-800">{bgStats.today}</div>
                                    <div className="text-[10px] text-stone-500 uppercase">Today</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-stone-800">{bgStats.thisMonth}</div>
                                    <div className="text-[10px] text-stone-500 uppercase">This Month</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-amber-600">₹{bgStats.estimatedCostINR}</div>
                                    <div className="text-[10px] text-stone-500 uppercase">Est. Cost</div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 rounded-full transition-all"
                                        style={{ width: `${Math.min((bgStats.today / bgStats.dailyLimit) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-[9px] text-stone-400">{bgStats.model}</span>
                                    <span className="text-[9px] text-stone-400">{bgStats.today}/{bgStats.dailyLimit} daily</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4">
                        {images.map((url, i) => (
                            <div key={i} className="relative w-24 h-32 border border-stone-200 rounded-sm overflow-hidden group">
                                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hidden group-hover:block hover:bg-white">
                                    <X size={14} />
                                </button>
                                {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 group-hover:hidden">Card</span>}
                                {i === 1 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 group-hover:hidden">Model</span>}
                                {i > 1 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 group-hover:hidden">#{i + 1}</span>}
                                
                                {/* Reordering controls shown on hover */}
                                <div className="absolute inset-x-0 bottom-0 bg-black/85 py-1 px-1.5 flex items-center justify-between text-white hidden group-hover:flex z-20">
                                    <button
                                        type="button"
                                        onClick={() => moveImage(i, 'left')}
                                        disabled={i === 0}
                                        className="hover:text-amber-400 disabled:opacity-30 disabled:hover:text-white cursor-pointer transition-colors"
                                        title="Move Left"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-[9px] font-semibold tracking-wider uppercase select-none">
                                        {i === 0 ? "Card" : i === 1 ? "Model" : `#${i + 1}`}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => moveImage(i, 'right')}
                                        disabled={i === images.length - 1}
                                        className="hover:text-amber-400 disabled:opacity-30 disabled:hover:text-white cursor-pointer transition-colors"
                                        title="Move Right"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                                {bgRemovedFlags[i] ? (
                                    <span className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] px-1 py-0.5 rounded-sm flex items-center gap-0.5">
                                        <Sparkles size={8} /> BG
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveBg(i)}
                                        disabled={removingBgIndex !== -1}
                                        className="absolute top-1 left-1 bg-amber-500/90 hover:bg-amber-600 text-white text-[8px] px-1.5 py-1 rounded-sm items-center gap-0.5 hidden group-hover:flex disabled:opacity-50 cursor-pointer transition-colors"
                                        title="Remove background"
                                    >
                                        {removingBgIndex === i ? <Loader2 size={8} className="animate-spin" /> : <Sparkles size={8} />}
                                        {removingBgIndex === i ? 'Removing...' : 'Remove BG'}
                                    </button>
                                )}
                            </div>
                        ))}

                        <label className="w-24 h-32 border-2 border-dashed border-stone-300 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors">
                            {uploading ? (
                                <div className="text-center">
                                    <Loader2 className="animate-spin text-stone-400 mx-auto" size={20} />
                                    <span className="text-[8px] text-stone-400 mt-1 block">Uploading...</span>
                                </div>
                            ) : (
                                <>
                                    <Upload className="text-stone-400 mb-1" size={20} />
                                    <span className="text-[10px] text-stone-500 uppercase">Upload</span>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                        </label>
                    </div>
                    
                    <input type="hidden" name="images" value={JSON.stringify(images)} />
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

                {/* Size Chart Editor */}
                <div className="space-y-4 border-t border-stone-100 pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Ruler size={16} className="text-stone-600" />
                            <label className="block text-sm font-medium text-stone-700">Size Chart</label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowSizeChart(!showSizeChart)}
                            className="text-xs text-stone-500 hover:text-black underline transition-colors"
                        >
                            {showSizeChart ? "Hide" : "Configure Size Chart"}
                        </button>
                    </div>

                    {showSizeChart && (
                        <div className="bg-stone-50 border border-stone-200 rounded-sm p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Fit Type</label>
                                    <select
                                        value={fitType}
                                        onChange={(e) => setFitType(e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black bg-white focus:outline-none focus:border-black"
                                    >
                                        <option value="Slim">Slim</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Relaxed">Relaxed</option>
                                        <option value="Oversized">Oversized</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Stretchability</label>
                                    <select
                                        value={stretchability}
                                        onChange={(e) => setStretchability(e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black bg-white focus:outline-none focus:border-black"
                                    >
                                        <option value="Rigid">Rigid</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs uppercase tracking-wider text-stone-500">Measurements (inches)</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setMeasurements([...DEFAULT_MEASUREMENTS])}
                                            className="text-[10px] text-amber-600 hover:text-amber-700 underline"
                                        >
                                            Load Default Template
                                        </button>
                                        <button
                                            type="button"
                                            onClick={addMeasurementRow}
                                            className="text-xs text-black hover:text-stone-600 flex items-center gap-1"
                                        >
                                            <Plus size={12} /> Add Row
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-stone-300 text-stone-500 uppercase tracking-wider">
                                                <th className="py-2 text-left font-medium">Size</th>
                                                <th className="py-2 text-left font-medium">Bust</th>
                                                <th className="py-2 text-left font-medium">Waist</th>
                                                <th className="py-2 text-left font-medium">Sleeve</th>
                                                <th className="py-2 text-left font-medium">Length</th>
                                                <th className="py-2 w-8"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {measurements.map((m, i) => (
                                                <tr key={i} className="border-b border-stone-100">
                                                    <td className="py-1.5 pr-2">
                                                        <input
                                                            type="text"
                                                            value={m.size}
                                                            onChange={(e) => updateMeasurement(i, 'size', e.target.value)}
                                                            className="w-full border border-stone-200 p-1.5 rounded-sm text-xs text-black bg-white focus:outline-none focus:border-black"
                                                            placeholder="M"
                                                        />
                                                    </td>
                                                    {(['bust', 'waist', 'sleeve', 'length'] as const).map((field) => (
                                                        <td key={field} className="py-1.5 pr-2">
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                value={m[field] || ''}
                                                                onChange={(e) => updateMeasurement(i, field, e.target.value)}
                                                                className="w-full border border-stone-200 p-1.5 rounded-sm text-xs text-black bg-white focus:outline-none focus:border-black"
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="py-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMeasurementRow(i)}
                                                            className="text-red-400 hover:text-red-600 p-1"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-stone-100 flex justify-end">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
