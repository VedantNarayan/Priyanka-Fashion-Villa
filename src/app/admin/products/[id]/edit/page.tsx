"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProduct, uploadProductImageWithBgRemoval, removeBgForImageUrl } from "@/app/actions/products";
import { getBgRemovalStats } from "@/app/actions/bg-removal-stats";
import { ArrowLeft, Loader2, Upload, X, Sparkles, Ruler, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const DEFAULT_MEASUREMENTS = [
    { size: "XS", bust: 32, waist: 24, sleeve: 22, length: 54 },
    { size: "S", bust: 34, waist: 26, sleeve: 22.5, length: 55 },
    { size: "M", bust: 36, waist: 28, sleeve: 23, length: 56 },
    { size: "L", bust: 38, waist: 30, sleeve: 23.5, length: 57 },
    { size: "XL", bust: 40, waist: 32, sleeve: 24, length: 58 },
    { size: "XXL", bust: 42, waist: 34, sleeve: 24.5, length: 59 },
];

type Measurement = { size: string; bust: number; waist: number; sleeve: number; length: number };

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(-1);
    const [images, setImages] = useState<string[]>([]);
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
        fetchProduct();
        fetchCategories();
        getBgRemovalStats().then(setBgStats).catch(() => {});
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
            setBgRemovedFlags(data.images.map(() => false));
        } else if (data?.image_url) {
            setImages([data.image_url]);
            setBgRemovedFlags([false]);
        }

        // Load size chart data
        if (data?.size_chart) {
            const sc = typeof data.size_chart === 'string' ? JSON.parse(data.size_chart) : data.size_chart;
            if (sc.fitType) setFitType(sc.fitType);
            if (sc.stretchability) setStretchability(sc.stretchability);
            if (sc.measurements?.length > 0) {
                setMeasurements(sc.measurements);
                setShowSizeChart(true);
            }
        }
        setLoading(false);
    };

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
                // If the bg-removal variant failed (e.g. auth issue), try simple upload
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        formData.set("images", JSON.stringify(images));
        if (images.length > 0) {
            formData.set("image_url", images[0]);
        }
        formData.set("size_chart", JSON.stringify({
            fitType,
            stretchability,
            measurements,
        }));
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
                            {product.category && !categories.some((c: any) => c.name === product.category) && (
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

                {/* Image Upload with BG Removal */}
                <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Product Images</label>
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

                    <div className="flex flex-wrap items-start gap-4">
                        {images.map((url, i) => (
                            <div key={i} className="relative w-24 h-32 border border-stone-200 rounded-sm overflow-hidden group">
                                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hidden group-hover:block hover:bg-white">
                                    <X size={14} />
                                </button>
                                {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">Card</span>}
                                {i === 1 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">Model</span>}
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
                        
                        <label className="w-24 h-32 border border-dashed border-stone-300 p-3 rounded-sm cursor-pointer hover:bg-stone-50 transition-colors flex flex-col items-center justify-center">
                            {uploading ? (
                                <div className="text-center">
                                    <Loader2 className="animate-spin text-stone-400 mx-auto" size={20} />
                                    <span className="text-[8px] text-stone-400 mt-1 block">Uploading...</span>
                                </div>
                            ) : (
                                <>
                                    <Upload size={20} className="text-stone-400 mb-1" />
                                    <span className="text-[10px] text-stone-500 uppercase">Upload</span>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                        </label>
                    </div>
                    <input type="hidden" name="images" value={JSON.stringify(images)} />
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
