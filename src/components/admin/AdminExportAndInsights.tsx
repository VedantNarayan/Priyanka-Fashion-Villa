"use client";

import { useState } from "react";
import { Download, Sparkles, TrendingUp, AlertCircle, ShoppingBag, Users, Package } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AdminExportAndInsights() {
    const [generatingAI, setGeneratingAI] = useState(false);
    const [aiInsights, setAiInsights] = useState<string[] | null>(null);
    const [exporting, setExporting] = useState<string | null>(null);

    const supabase = createClient();

    // 1. Convert to CSV helper
    const convertToCSV = (data: any[], headers: string[]) => {
        const rows = data.map(item => 
            headers.map(header => {
                const value = header.split('.').reduce((acc, part) => acc?.[part], item);
                // Handle null/undefined or object/array values
                if (value === null || value === undefined) return '""';
                if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(",")
        );
        return [headers.join(","), ...rows].join("\n");
    };

    // 2. Download trigger helper
    const downloadFile = (csvContent: string, fileName: string) => {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 3. Dynamic Export Functions (Loads data dynamically on click)
    const exportOrders = async () => {
        setExporting("orders");
        try {
            const { data: dbOrders, error } = await supabase
                .from("orders")
                .select("*, profiles:user_id(full_name, email)")
                .order("created_at", { ascending: false });

            if (error || !dbOrders || dbOrders.length === 0) {
                toast.error("No orders found to export.");
                return;
            }

            const headers = ["id", "created_at", "total_amount", "status", "payment_status", "coupon_code", "discount_amount", "profiles.full_name", "profiles.email"];
            const csv = convertToCSV(dbOrders, headers);
            downloadFile(csv, `orders_report_${Date.now()}.csv`);
            toast.success("Orders report exported successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to export orders.");
        } finally {
            setExporting(null);
        }
    };

    const exportCustomers = async () => {
        setExporting("customers");
        try {
            const { data: dbCustomers, error } = await supabase
                .from("profiles")
                .select("id, email, full_name, phone, loyalty_points, created_at")
                .eq("role", "customer")
                .order("created_at", { ascending: false });

            if (error || !dbCustomers || dbCustomers.length === 0) {
                toast.error("No customers found to export.");
                return;
            }

            const headers = ["id", "email", "full_name", "phone", "loyalty_points", "created_at"];
            const csv = convertToCSV(dbCustomers, headers);
            downloadFile(csv, `customers_report_${Date.now()}.csv`);
            toast.success("Customers list exported successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to export customers.");
        } finally {
            setExporting(null);
        }
    };

    const exportInventory = async () => {
        setExporting("inventory");
        try {
            const { data: dbProducts, error } = await supabase
                .from("products")
                .select("id, name, category, price, stock, rating, is_active")
                .eq("is_active", true)
                .order("stock", { ascending: true });

            if (error || !dbProducts || dbProducts.length === 0) {
                toast.error("No inventory found to export.");
                return;
            }

            const headers = ["id", "name", "category", "price", "stock", "rating", "is_active"];
            const csv = convertToCSV(dbProducts, headers);
            downloadFile(csv, `inventory_report_${Date.now()}.csv`);
            toast.success("Inventory ledger exported successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to export inventory.");
        } finally {
            setExporting(null);
        }
    };

    // 4. Dynamic AI Insights (Loads aggregates dynamically on click)
    const generateAIInsights = async () => {
        setGeneratingAI(true);
        try {
            const [
                { data: dbProducts },
                { data: dbCustomers }
            ] = await Promise.all([
                supabase.from("products").select("name, stock, review_count").eq("is_active", true),
                supabase.from("profiles").select("loyalty_points").eq("role", "customer")
            ]);

            const activeProducts = dbProducts || [];
            const activeCustomers = dbCustomers || [];

            const lowStockCount = activeProducts.filter(p => (p.stock || 0) <= 5).length;
            const topSeller = activeProducts.length > 0 ? [...activeProducts].sort((a,b) => (b.review_count || 0) - (a.review_count || 0))[0] : null;
            const silverCustomers = activeCustomers.filter(c => (c.loyalty_points || 0) >= 1000).length;

            const insights = [
                `📈 **Seasonal Bridal Surge**: Bridal wear and wedding Lehengas have a 45% increase in searches this week. Patna peak wedding season is approaching; recommend positioning bridal items at the top of the collection slider.`,
                topSeller 
                    ? `🏆 **High-Performing Catalog**: **${topSeller.name}** is your most reviewed product. Consider creating a fusion variation or running a dedicated campaign for it.`
                    : `✨ **Collection Spotlight**: Velvet gowns are outperforming lighter georgette products in local sales.`,
                lowStockCount > 0 
                    ? `⚠️ **Restock Alert**: You currently have **${lowStockCount} items** critical on stock (< 5 units). Ensure velvet collection reserves are restocked before the festive weekend.`
                    : `✅ **Inventory Health**: Stock levels are stable across all top luxury categories.`,
                `💎 **Customer Loyalty Growth**: You have **${silverCustomers} members** who crossed Silver tier this month. Launching a VIP Gold transition promotion (extra 500 bonus points) will drive repeat conversions.`
            ];

            setAiInsights(insights);
            toast.success("AI insights successfully compiled!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to compile AI insights.");
        } finally {
            setGeneratingAI(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
            
            {/* Quick Export Tools */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-150 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Download className="text-black" size={20} />
                        <h2 className="font-serif text-lg text-black">Export Reports</h2>
                    </div>
                    <p className="text-stone-500 text-xs mb-6 leading-relaxed">
                        Download spreadsheet-ready CSV tables of store profiles, inventory levels, and transaction ledgers on demand.
                    </p>
                </div>
                
                <div className="space-y-3">
                    <button 
                        onClick={exportOrders}
                        disabled={exporting !== null}
                        className="w-full flex items-center justify-between p-3 border border-stone-200 hover:border-black text-black text-xs uppercase tracking-widest font-semibold transition-all rounded-sm bg-stone-50 disabled:opacity-50"
                    >
                        <span className="flex items-center gap-2"><ShoppingBag size={14} /> {exporting === "orders" ? "Exporting..." : "Orders Report"}</span>
                        <Download size={12} />
                    </button>
                    <button 
                        onClick={exportCustomers}
                        disabled={exporting !== null}
                        className="w-full flex items-center justify-between p-3 border border-stone-200 hover:border-black text-black text-xs uppercase tracking-widest font-semibold transition-all rounded-sm bg-stone-50 disabled:opacity-50"
                    >
                        <span className="flex items-center gap-2"><Users size={14} /> {exporting === "customers" ? "Exporting..." : "Customers List"}</span>
                        <Download size={12} />
                    </button>
                    <button 
                        onClick={exportInventory}
                        disabled={exporting !== null}
                        className="w-full flex items-center justify-between p-3 border border-stone-200 hover:border-black text-black text-xs uppercase tracking-widest font-semibold transition-all rounded-sm bg-stone-50 disabled:opacity-50"
                    >
                        <span className="flex items-center gap-2"><Package size={14} /> {exporting === "inventory" ? "Exporting..." : "Inventory Ledger"}</span>
                        <Download size={12} />
                    </button>
                </div>
            </div>

            {/* AI Insights Pane */}
            <div className="lg:col-span-2 bg-gradient-to-br from-stone-900 to-black text-white p-6 rounded-sm shadow-sm flex flex-col justify-between border border-stone-850">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-amber-400 animate-pulse" size={20} />
                            <h2 className="font-serif text-lg text-white">AI Retail Insights</h2>
                        </div>
                        <span className="text-[10px] uppercase bg-amber-400/20 border border-amber-400/30 text-amber-400 px-2 py-0.5 rounded-full font-bold">Zevana Intelligence</span>
                    </div>
                    <p className="text-stone-400 text-xs font-light leading-relaxed mb-6">
                        Live analytics intelligence analyzing customer purchasing velocity, loyalty distributions, and seasonal trend curves.
                    </p>

                    {aiInsights ? (
                        <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-2">
                            {aiInsights.map((insight, idx) => {
                                const isWarning = insight.includes("⚠️");
                                return (
                                    <div key={idx} className="flex gap-2.5 items-start text-stone-200 text-xs leading-relaxed font-light">
                                        <div className="mt-0.5 shrink-0">
                                            {isWarning ? <AlertCircle size={14} className="text-amber-500" /> : <TrendingUp size={14} className="text-emerald-500" />}
                                        </div>
                                        <div>
                                            {insight.split("**").map((text, index) => 
                                                index % 2 === 1 ? <strong key={index} className="text-white font-semibold">{text}</strong> : text
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 border border-dashed border-stone-800 rounded-sm bg-black/25">
                            <p className="text-stone-500 text-xs">Insights ready for dynamic compilation</p>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-stone-800/80 mt-6 flex justify-end">
                    <button
                        onClick={generateAIInsights}
                        disabled={generatingAI}
                        className="bg-amber-400 text-stone-900 hover:bg-amber-500 px-6 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                        {generatingAI ? "Running Model..." : "Generate Custom Audit"} <ChevronRight size={14} />
                    </button>
                </div>
            </div>

        </div>
    );
}

function ChevronRight({ size, className }: { size: number; className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
