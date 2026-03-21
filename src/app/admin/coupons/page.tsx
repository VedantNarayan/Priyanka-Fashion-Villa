"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { createCoupon, toggleCoupon, deleteCoupon } from "@/app/actions/coupons";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState("");
    const supabase = createClient();

    useEffect(() => { fetchCoupons(); }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });
        setCoupons(data || []);
        setLoading(false);
    };

    const handleCreate = async (formData: FormData) => {
        setFormError("");
        const result = await createCoupon(formData);
        if (result?.error) {
            setFormError(result.error);
        } else {
            setShowForm(false);
            fetchCoupons();
        }
    };

    const handleToggle = async (id: string, current: boolean) => {
        await toggleCoupon(id, !current);
        fetchCoupons();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this coupon?")) {
            await deleteCoupon(id);
            fetchCoupons();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-3xl">Coupons</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-black text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> {showForm ? "Cancel" : "New Coupon"}
                </button>
            </div>

            {showForm && (
                <form action={handleCreate} className="bg-white p-6 rounded-sm shadow-sm mb-6 space-y-4">
                    {formError && (
                        <div className="bg-red-50 text-red-600 p-3 text-sm border border-red-100">{formError}</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Code</label>
                            <input name="code" type="text" required placeholder="SAVE20" className="w-full border border-stone-200 p-2 rounded-sm text-sm focus:outline-none focus:border-black uppercase text-black" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Type</label>
                            <select name="type" className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Value</label>
                            <input name="value" type="number" required placeholder="20" step="0.01" className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Min Order (₹)</label>
                            <input name="min_order_amount" type="number" placeholder="0" className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Max Uses</label>
                            <input name="max_uses" type="number" placeholder="Unlimited" className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Expires At</label>
                            <input name="expires_at" type="datetime-local" className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                        </div>
                    </div>
                    <button type="submit" className="bg-black text-white px-6 py-2 uppercase tracking-widest text-xs hover:bg-stone-800">
                        Create Coupon
                    </button>
                </form>
            )}

            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Code</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Discount</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Min Order</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Usage</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Status</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Expires</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {loading ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-400">Loading...</td></tr>
                        ) : coupons.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-400">No coupons created yet.</td></tr>
                        ) : (
                            coupons.map((coupon: any) => (
                                <tr key={coupon.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-sm">{coupon.code}</td>
                                    <td className="px-6 py-4 text-sm">{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                                    <td className="px-6 py-4 text-sm text-stone-600">₹{coupon.min_order_amount}</td>
                                    <td className="px-6 py-4 text-sm text-stone-600">{coupon.used_count}/{coupon.max_uses || '∞'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-500">
                                        {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleToggle(coupon.id, coupon.is_active)} className="p-1 text-stone-400 hover:text-black">
                                                {coupon.is_active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} />}
                                            </button>
                                            <button onClick={() => handleDelete(coupon.id)} className="p-1 text-stone-400 hover:text-red-500">
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
