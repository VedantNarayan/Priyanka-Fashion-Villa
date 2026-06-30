"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Save, Loader2, Settings, Home, ShoppingBag, Info, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'homepage' | 'shop' | 'footer' | 'pages'>('general');
    const supabase = createClient();

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('admin_settings').select('*');
        const map: Record<string, any> = {};
        data?.forEach(s => {
            try {
                map[s.key] = typeof s.value === 'string' ? JSON.parse(s.value) : s.value;
            } catch (e) {
                map[s.key] = s.value;
            }
        });
        setSettings(map);
        setLoading(false);
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    // Helper for nested homepage settings
    const updateHomepageSubKey = (section: string, field: string, val: any) => {
        const homepage = settings.homepage_cms || {};
        updateSetting('homepage_cms', {
            ...homepage,
            [section]: {
                ...(homepage[section] || {}),
                [field]: val
            }
        });
    };

    // Helper for Lookbooks
    const updateLookbook = (index: number, field: string, val: string) => {
        const homepage = settings.homepage_cms || {};
        const lookbooks = [...(homepage.lookbooks || [
            { subtitle: "Volume I", title: "Fluid Geometrics", description: "", image: "", link: "/shop" },
            { subtitle: "Volume II", title: "Structured Atelier", description: "", image: "", link: "/shop" },
            { subtitle: "Volume III", title: "Gilded Noir", description: "", image: "", link: "/shop" },
            { subtitle: "Volume IV", title: "Modern Heritage", description: "", image: "", link: "/shop" }
        ])];
        lookbooks[index] = { ...lookbooks[index], [field]: val };
        updateSetting('homepage_cms', { ...homepage, lookbooks });
    };

    // Helper for other CMS sections (shop_cms, footer_cms, policies_cms)
    const updateCmsKey = (cmsKey: string, field: string, val: any) => {
        const section = settings[cmsKey] || {};
        updateSetting(cmsKey, {
            ...section,
            [field]: val
        });
    };

    const handleSave = async () => {
        setSaving(true);
        for (const [key, value] of Object.entries(settings)) {
            // Save raw value directly without JSON.stringify to avoid double escapes in Supabase JSONB
            await supabase
                .from('admin_settings')
                .upsert({ key, value: value, updated_at: new Date().toISOString() });
        }
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) return <div className="text-stone-400 text-center py-12">Loading settings...</div>;

    const homepage = settings.homepage_cms || {};
    const lookbooks = homepage.lookbooks || [{}, {}, {}, {}];
    const shopCms = settings.shop_cms || {};
    const footerCms = settings.footer_cms || {};
    const policiesCms = settings.policies_cms || {};

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-stone-200 pb-5">
                <div>
                    <h1 className="font-serif text-3xl text-stone-900">Atelier CMS & Settings</h1>
                    <p className="text-stone-500 text-sm mt-1">Manage global boutique options and dynamic page layouts</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-black text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex items-center gap-2 disabled:opacity-50 font-semibold"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saved ? "Saved ✓" : saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto border-b border-stone-200 mb-8 pb-px">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-5 py-3 border-b-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all ${
                        activeTab === 'general'
                            ? 'border-black text-black'
                            : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                >
                    <Settings size={14} /> General Settings
                </button>
                <button
                    onClick={() => setActiveTab('homepage')}
                    className={`px-5 py-3 border-b-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all ${
                        activeTab === 'homepage'
                            ? 'border-black text-black'
                            : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                >
                    <Home size={14} /> Homepage CMS
                </button>
                <button
                    onClick={() => setActiveTab('shop')}
                    className={`px-5 py-3 border-b-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all ${
                        activeTab === 'shop'
                            ? 'border-black text-black'
                            : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                >
                    <ShoppingBag size={14} /> Shop Page CMS
                </button>
                <button
                    onClick={() => setActiveTab('footer')}
                    className={`px-5 py-3 border-b-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all ${
                        activeTab === 'footer'
                            ? 'border-black text-black'
                            : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                >
                    <Info size={14} /> Footer CMS
                </button>
                <button
                    onClick={() => setActiveTab('pages')}
                    className={`px-5 py-3 border-b-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all ${
                        activeTab === 'pages'
                            ? 'border-black text-black'
                            : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                >
                    <ShieldAlert size={14} /> Legal & About Pages
                </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="space-y-8">
                {/* 1. GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Store Profile</h2>
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
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Currency (Consistently ₹)</label>
                                    <input
                                        type="text"
                                        value="INR (₹)"
                                        disabled
                                        className="w-full border border-stone-100 p-2 bg-stone-50 rounded-sm text-sm text-stone-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">WhatsApp Integrations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">WhatsApp Business Contact</label>
                                    <input
                                        type="text"
                                        value={settings.whatsapp_number || ''}
                                        onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
                                        placeholder="+919999999999"
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.whatsapp_enabled || false}
                                            onChange={(e) => updateSetting('whatsapp_enabled', e.target.checked)}
                                            className="w-4 h-4 accent-black"
                                        />
                                        <span className="text-sm text-stone-600 font-medium">Activate Live Concierge Link</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Checkout Constants</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Free Shipping Minimum threshold (₹)</label>
                                    <input
                                        type="number"
                                        value={settings.free_shipping_threshold || 0}
                                        onChange={(e) => updateSetting('free_shipping_threshold', parseInt(e.target.value))}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Default Returns Window (Days)</label>
                                    <input
                                        type="number"
                                        value={settings.return_window_days || 7}
                                        onChange={(e) => updateSetting('return_window_days', parseInt(e.target.value))}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm shadow-sm">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Security</h2>
                            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-sm">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={24} className="text-green-500" />
                                    <div>
                                        <p className="font-medium text-sm text-black">Two-Factor Authentication (2FA)</p>
                                        <p className="text-xs text-stone-500">Secure administrative logins with authenticator tokens</p>
                                    </div>
                                </div>
                                <Link
                                    href="/admin/setup-2fa"
                                    className="bg-black text-white px-5 py-2.5 text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors font-semibold"
                                >
                                    Reconfigure 2FA
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. HOMEPAGE CMS TAB */}
                {activeTab === 'homepage' && (
                    <div className="space-y-6">
                        {/* Hero Overlay */}
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Phase-1 Hero Landing Overlay</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Introductory Brand Quote</label>
                                    <input
                                        type="text"
                                        value={homepage.hero?.quote || ''}
                                        onChange={(e) => updateHomepageSubKey('hero', 'quote', e.target.value)}
                                        placeholder="At Priyanka Fashionvilla, we craft dresses..."
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Title Header Line 1</label>
                                        <input
                                            type="text"
                                            value={homepage.hero?.title1 || ''}
                                            onChange={(e) => updateHomepageSubKey('hero', 'title1', e.target.value)}
                                            placeholder="Designed"
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Title Header Line 2</label>
                                        <input
                                            type="text"
                                            value={homepage.hero?.title2 || ''}
                                            onChange={(e) => updateHomepageSubKey('hero', 'title2', e.target.value)}
                                            placeholder="To Make"
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Title Header Line 3</label>
                                        <input
                                            type="text"
                                            value={homepage.hero?.title3 || ''}
                                            onChange={(e) => updateHomepageSubKey('hero', 'title3', e.target.value)}
                                            placeholder="An Entrance"
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Accent Word (Styled Gold)</label>
                                        <input
                                            type="text"
                                            value={homepage.hero?.titleAccent || ''}
                                            onChange={(e) => updateHomepageSubKey('hero', 'titleAccent', e.target.value)}
                                            placeholder="Entrance"
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lookbooks (Volume I-IV) */}
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-6">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">The Atelier Journal Lookbooks (4 Volumes)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[0, 1, 2, 3].map((idx) => (
                                    <div key={idx} className="border border-stone-100 p-4 bg-stone-50/50 space-y-3">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span className="text-xs uppercase tracking-widest text-burgundy font-bold">Volume {idx + 1}</span>
                                            <input
                                                type="text"
                                                value={lookbooks[idx]?.subtitle || `Volume ${idx + 1}`}
                                                onChange={(e) => updateLookbook(idx, 'subtitle', e.target.value)}
                                                className="border-none bg-transparent text-right text-[10px] uppercase text-stone-400 focus:outline-none w-20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-0.5">Title</label>
                                            <input
                                                type="text"
                                                value={lookbooks[idx]?.title || ''}
                                                onChange={(e) => updateLookbook(idx, 'title', e.target.value)}
                                                className="w-full border border-stone-200 p-1.5 rounded-sm text-xs text-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-0.5">Description</label>
                                            <textarea
                                                value={lookbooks[idx]?.description || ''}
                                                onChange={(e) => updateLookbook(idx, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full border border-stone-200 p-1.5 rounded-sm text-xs text-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-0.5">Image URL</label>
                                            <input
                                                type="text"
                                                value={lookbooks[idx]?.image || ''}
                                                onChange={(e) => updateLookbook(idx, 'image', e.target.value)}
                                                className="w-full border border-stone-200 p-1.5 rounded-sm text-xs text-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-0.5">Redirect URL</label>
                                            <input
                                                type="text"
                                                value={lookbooks[idx]?.link || '/shop'}
                                                onChange={(e) => updateLookbook(idx, 'link', e.target.value)}
                                                className="w-full border border-stone-200 p-1.5 rounded-sm text-xs text-black"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Story Banner */}
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Brand Narrative Story Banner</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Small Badge Text</label>
                                    <input
                                        type="text"
                                        value={homepage.story?.badge || ''}
                                        onChange={(e) => updateHomepageSubKey('story', 'badge', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Main Heading</label>
                                    <input
                                        type="text"
                                        value={homepage.story?.title || ''}
                                        onChange={(e) => updateHomepageSubKey('story', 'title', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Narrative Description Block</label>
                                    <textarea
                                        value={homepage.story?.description || ''}
                                        onChange={(e) => updateHomepageSubKey('story', 'description', e.target.value)}
                                        rows={3}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Background Image URL</label>
                                    <input
                                        type="text"
                                        value={homepage.story?.image || ''}
                                        onChange={(e) => updateHomepageSubKey('story', 'image', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">CTA Text</label>
                                        <input
                                            type="text"
                                            value={homepage.story?.cta_text || ''}
                                            onChange={(e) => updateHomepageSubKey('story', 'cta_text', e.target.value)}
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">CTA URL</label>
                                        <input
                                            type="text"
                                            value={homepage.story?.cta_url || ''}
                                            onChange={(e) => updateHomepageSubKey('story', 'cta_url', e.target.value)}
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Newsletter Invitation Copy</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Small Invite Badge</label>
                                    <input
                                        type="text"
                                        value={homepage.newsletter?.badge || ''}
                                        onChange={(e) => updateHomepageSubKey('newsletter', 'badge', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Header Title</label>
                                    <input
                                        type="text"
                                        value={homepage.newsletter?.title || ''}
                                        onChange={(e) => updateHomepageSubKey('newsletter', 'title', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Subtitle Invitation</label>
                                    <input
                                        type="text"
                                        value={homepage.newsletter?.description || ''}
                                        onChange={(e) => updateHomepageSubKey('newsletter', 'description', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. SHOP CMS TAB */}
                {activeTab === 'shop' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Shop Page Header Banner</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Banner Backdrop Image URL</label>
                                    <input
                                        type="text"
                                        value={shopCms.banner_image || ''}
                                        onChange={(e) => updateCmsKey('shop_cms', 'banner_image', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Small Badge text</label>
                                        <input
                                            type="text"
                                            value={shopCms.banner_badge || ''}
                                            onChange={(e) => updateCmsKey('shop_cms', 'banner_badge', e.target.value)}
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Main Heading</label>
                                        <input
                                            type="text"
                                            value={shopCms.banner_title || ''}
                                            onChange={(e) => updateCmsKey('shop_cms', 'banner_title', e.target.value)}
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Description Paragraph</label>
                                        <input
                                            type="text"
                                            value={shopCms.banner_desc || ''}
                                            onChange={(e) => updateCmsKey('shop_cms', 'banner_desc', e.target.value)}
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Category Filters</h2>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Categories (Comma-separated, first must be &quot;All&quot;)</label>
                                <input
                                    type="text"
                                    value={shopCms.categories ? shopCms.categories.join(", ") : "All, Evening Wear, Cocktail, Gala, Prom, Party, Casual"}
                                    onChange={(e) => {
                                        const array = e.target.value.split(",").map(c => c.trim()).filter(Boolean);
                                        updateCmsKey('shop_cms', 'categories', array);
                                    }}
                                    className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                />
                                <p className="text-[10px] text-stone-400 mt-1">Example: All, Evening Wear, Cocktail, Lehenga, Kurti, Fusion Wear</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. FOOTER CMS TAB */}
                {activeTab === 'footer' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Footer Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Brand Name</label>
                                    <input
                                        type="text"
                                        value={footerCms.brand_name || ''}
                                        onChange={(e) => updateCmsKey('footer_cms', 'brand_name', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Brand Tagline Description</label>
                                    <input
                                        type="text"
                                        value={footerCms.brand_desc || ''}
                                        onChange={(e) => updateCmsKey('footer_cms', 'brand_desc', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Support Email</label>
                                    <input
                                        type="email"
                                        value={footerCms.email || ''}
                                        onChange={(e) => updateCmsKey('footer_cms', 'email', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Contact Phone</label>
                                    <input
                                        type="text"
                                        value={footerCms.phone || ''}
                                        onChange={(e) => updateCmsKey('footer_cms', 'phone', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Store Location Address</label>
                                    <input
                                        type="text"
                                        value={footerCms.address || ''}
                                        onChange={(e) => updateCmsKey('footer_cms', 'address', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Social Accounts URLs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Instagram URL</label>
                                    <input
                                        type="text"
                                        value={footerCms.instagram_url || ''}
                                        onChange={(e) => updateCmsKey('footer_cms', 'instagram_url', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Facebook URL</label>
                                    <input
                                        type="text"
                                        value={footerCms.facebook_url || ''}
                                        onChange={(e) => updateCmsKey('footer_cms', 'facebook_url', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Twitter/X URL</label>
                                    <input
                                        type="text"
                                        value={footerCms.twitter_url || ''}
                                        onChange={(e) => updateCmsKey('footer_cms', 'twitter_url', e.target.value)}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. LEGAL & ABOUT TAB */}
                {activeTab === 'pages' && (
                    <div className="space-y-6">
                        {/* About page */}
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">About Us Page Narrative</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">About Title Heading</label>
                                        <input
                                            type="text"
                                            value={policiesCms.about_title || ''}
                                            onChange={(e) => updateCmsKey('policies_cms', 'about_title', e.target.value)}
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">About Subtitle</label>
                                        <input
                                            type="text"
                                            value={policiesCms.about_subtitle || ''}
                                            onChange={(e) => updateCmsKey('policies_cms', 'about_subtitle', e.target.value)}
                                            className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Brand Story content narrative (preserves spacing and line breaks)</label>
                                    <textarea
                                        value={policiesCms.about_content || ''}
                                        onChange={(e) => updateCmsKey('policies_cms', 'about_content', e.target.value)}
                                        rows={6}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black font-serif italic"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Policies page sections */}
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-medium text-sm uppercase tracking-wide border-b pb-3 mb-4">Legal Store Policies Content</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Shipping Policy copy</label>
                                    <textarea
                                        value={policiesCms.shipping_policy || ''}
                                        onChange={(e) => updateCmsKey('policies_cms', 'shipping_policy', e.target.value)}
                                        rows={4}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black text-xs font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Returns & Exchanges Policy copy</label>
                                    <textarea
                                        value={policiesCms.returns_policy || ''}
                                        onChange={(e) => updateCmsKey('policies_cms', 'returns_policy', e.target.value)}
                                        rows={4}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black text-xs font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Privacy Policy copy</label>
                                    <textarea
                                        value={policiesCms.privacy_policy || ''}
                                        onChange={(e) => updateCmsKey('policies_cms', 'privacy_policy', e.target.value)}
                                        rows={4}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black text-xs font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Terms of Service copy</label>
                                    <textarea
                                        value={policiesCms.terms_of_service || ''}
                                        onChange={(e) => updateCmsKey('policies_cms', 'terms_of_service', e.target.value)}
                                        rows={4}
                                        className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black text-xs font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
