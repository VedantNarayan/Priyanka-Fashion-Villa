"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { addAddress, updateAddress, deleteAddress } from "@/app/actions/profile";
import { Plus, Edit, Trash2, MapPin, Star } from "lucide-react";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => { fetchAddresses(); }, []);

    const fetchAddresses = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user.id)
            .order('is_default', { ascending: false });
        setAddresses(data || []);
        setLoading(false);
    };

    const handleSubmit = async (formData: FormData) => {
        if (editing) {
            await updateAddress(editing.id, formData);
        } else {
            await addAddress(formData);
        }
        setShowForm(false);
        setEditing(null);
        fetchAddresses();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this address?")) {
            await deleteAddress(id);
            fetchAddresses();
        }
    };

    const handleEdit = (addr: any) => {
        setEditing(addr);
        setShowForm(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-3xl">My Addresses</h1>
                <button
                    onClick={() => { setShowForm(true); setEditing(null); }}
                    className="bg-black text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> Add Address
                </button>
            </div>

            {showForm && (
                <form action={handleSubmit} className="bg-white p-6 rounded-sm shadow-sm mb-6 space-y-4">
                    <h2 className="font-medium text-lg">{editing ? 'Edit Address' : 'New Address'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Label</label>
                            <select name="label" defaultValue={editing?.label || 'Home'} className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black">
                                <option>Home</option>
                                <option>Work</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Full Name</label>
                            <input name="full_name" defaultValue={editing?.full_name || ''} required className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Phone</label>
                        <input name="phone" type="tel" defaultValue={editing?.phone || ''} className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Address Line 1</label>
                        <input name="line1" defaultValue={editing?.line1 || ''} required className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Address Line 2</label>
                        <input name="line2" defaultValue={editing?.line2 || ''} className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">City</label>
                            <input name="city" defaultValue={editing?.city || ''} required className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">State</label>
                            <input name="state" defaultValue={editing?.state || ''} required className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">PIN Code</label>
                            <input name="postal_code" defaultValue={editing?.postal_code || ''} required className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_default" value="true" defaultChecked={editing?.is_default || false} className="w-4 h-4" />
                        <span className="text-sm text-stone-600">Set as default address</span>
                    </label>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-black text-white px-6 py-2 uppercase tracking-widest text-xs hover:bg-stone-800">
                            {editing ? 'Update Address' : 'Save Address'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 text-xs uppercase tracking-wider text-stone-500 hover:text-black">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="text-stone-400 text-center py-12">Loading addresses...</div>
            ) : addresses.length === 0 ? (
                <div className="bg-white p-12 rounded-sm shadow-sm text-center">
                    <MapPin size={48} className="mx-auto text-stone-300 mb-4" />
                    <p className="text-stone-500">No saved addresses yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className="bg-white p-6 rounded-sm shadow-sm relative">
                            {addr.is_default && (
                                <span className="absolute top-4 right-4 px-2 py-1 text-xs bg-black text-white rounded-full flex items-center gap-1">
                                    <Star size={10} fill="white" /> Default
                                </span>
                            )}
                            <p className="text-xs uppercase tracking-wider text-stone-400 mb-2">{addr.label}</p>
                            <p className="font-medium text-sm">{addr.full_name}</p>
                            <p className="text-sm text-stone-600 mt-1">{addr.line1}</p>
                            {addr.line2 && <p className="text-sm text-stone-600">{addr.line2}</p>}
                            <p className="text-sm text-stone-600">{addr.city}, {addr.state} {addr.postal_code}</p>
                            {addr.phone && <p className="text-sm text-stone-500 mt-1">{addr.phone}</p>}
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => handleEdit(addr)} className="text-xs uppercase tracking-wider text-black hover:underline flex items-center gap-1">
                                    <Edit size={12} /> Edit
                                </button>
                                <button onClick={() => handleDelete(addr.id)} className="text-xs uppercase tracking-wider text-red-500 hover:underline flex items-center gap-1">
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
