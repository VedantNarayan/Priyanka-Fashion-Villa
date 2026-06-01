"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Tag, Loader2 } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });
        setCategories(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append("name", name.trim());

        let result;
        if (editing) {
            result = await updateCategory(editing.id, formData);
        } else {
            result = await createCategory(formData);
        }

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success(editing ? "Category updated!" : "Category created!");
            setName("");
            setEditing(null);
            setShowForm(false);
            fetchCategories();
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string, catName: string) => {
        if (confirm(`Delete category "${catName}"? This cannot be undone.`)) {
            const result = await deleteCategory(id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Category deleted!");
                fetchCategories();
            }
        }
    };

    const handleEdit = (cat: any) => {
        setEditing(cat);
        setName(cat.name);
        setShowForm(true);
    };

    const filtered = categories.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-3xl">Categories</h1>
                <button
                    onClick={() => { setShowForm(!showForm); setEditing(null); setName(""); }}
                    className="bg-black text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> {showForm ? "Close Form" : "Add Category"}
                </button>
            </div>

            {/* Category Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-sm shadow-sm mb-6 space-y-4 max-w-md">
                    <h2 className="font-serif text-lg text-black">{editing ? "Edit Category" : "New Category"}</h2>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Category Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Wedding Wear"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black bg-stone-50"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-black text-white px-6 py-2 uppercase tracking-widest text-xs hover:bg-stone-800 flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting && <Loader2 className="animate-spin" size={12} />}
                            {editing ? "Update" : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowForm(false); setEditing(null); setName(""); }}
                            className="px-6 py-2 text-xs uppercase tracking-wider text-stone-500 hover:text-black"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="mb-6 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full md:w-96 pl-10 pr-4 py-3 border border-stone-200 rounded-sm text-sm text-black focus:outline-none focus:border-black bg-white"
                />
            </div>

            <div className="bg-white rounded-sm shadow-sm overflow-hidden max-w-2xl">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Name</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {loading ? (
                            <tr><td colSpan={2} className="px-6 py-12 text-center text-stone-400">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={2} className="px-6 py-12 text-center text-stone-400">
                                {search ? "No categories match your search." : "No categories found."}
                            </td></tr>
                        ) : (
                            filtered.map((cat: any) => (
                                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <Tag size={14} className="text-stone-400" />
                                        <span className="font-medium text-sm text-black">{cat.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(cat)} className="p-2 text-stone-400 hover:text-black transition-colors" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-stone-400 hover:text-red-500 transition-colors" title="Delete">
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
