"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const supabase = createClient();

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('admin_settings').select('*');
        const map: Record<string, any> = {};
        data?.forEach(s => { map[s.key] = s.value; });
        setSettings(map);
        setLoading(false);
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        for (const [key, value] of Object.entries(settings)) {
            await supabase
                .from('admin_settings')
                .upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() });
        }
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) return <div className="text-stone-400 text-center py-12">Loading settings...</div>;

    return (
        <div className="max-w-3xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-3xl">Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-black text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saved ? "Saved ✓" : saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="space-y-6">
                {/* Store Info */}
                <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                    <h2 className="font-medium text-sm uppercase tracking-wide mb-4">Store Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Store Name</label>
                            <input
                                type="text"
                                value={settings.store_name || ''}
                                onChange={(e) => updateSetting('store_name', e.target.value)}
                                className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Contact Email</label>
                            <input
                                type="email"
                                value={settings.store_email || ''}
                                onChange={(e) => updateSetting('store_email', e.target.value)}
                                className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Store Phone</label>
                            <input
                                type="text"
                                value={settings.store_phone || ''}
                                onChange={(e) => updateSetting('store_phone', e.target.value)}
                                className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Currency</label>
                            <select
                                value={settings.currency || 'INR'}
                                onChange={(e) => updateSetting('currency', e.target.value)}
                                className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                            >
                                <option value="INR">₹ INR</option>
                                <option value="USD">$ USD</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                    <h2 className="font-medium text-sm uppercase tracking-wide mb-4">WhatsApp Integration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Admin WhatsApp Number</label>
                            <input
                                type="text"
                                value={settings.whatsapp_number || ''}
                                onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
                                placeholder="+919999999999"
                                className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.whatsapp_enabled || false}
                                    onChange={(e) => updateSetting('whatsapp_enabled', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-stone-600">Enable WhatsApp Notifications</span>
                            </label>
                        </div>
                    </div>
                    <p className="text-xs text-stone-400">
                        Configure the WHATSAPP_API_URL and WHATSAPP_API_TOKEN environment variables on Vercel for production.
                    </p>
                </div>

                {/* Policies */}
                <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                    <h2 className="font-medium text-sm uppercase tracking-wide mb-4">Store Policies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Free Shipping Threshold (₹)</label>
                            <input
                                type="number"
                                value={settings.free_shipping_threshold || 0}
                                onChange={(e) => updateSetting('free_shipping_threshold', parseInt(e.target.value))}
                                className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Return Window (Days)</label>
                            <input
                                type="number"
                                value={settings.return_window_days || 7}
                                onChange={(e) => updateSetting('return_window_days', parseInt(e.target.value))}
                                className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                            />
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white p-6 rounded-sm shadow-sm">
                    <h2 className="font-medium text-sm uppercase tracking-wide mb-4">Security</h2>
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-sm">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={24} className="text-green-500" />
                            <div>
                                <p className="font-medium text-sm">Two-Factor Authentication</p>
                                <p className="text-xs text-stone-500">Protect your admin account with 2FA</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/setup-2fa"
                            className="bg-black text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors"
                        >
                            Configure
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
