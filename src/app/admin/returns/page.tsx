"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RotateCcw, Eye, CheckCircle, XCircle } from "lucide-react";

export default function AdminReturnsPage() {
    const [returns, setReturns] = useState<any[]>([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchReturns();
    }, [filter]);

    const fetchReturns = async () => {
        setLoading(true);
        let query = supabase
            .from('returns')
            .select('*, profiles:user_id(full_name, email), orders:order_id(id, total_amount)')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data } = await query;
        setReturns(data || []);
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'picked_up': return 'bg-blue-100 text-blue-800';
            case 'refunded': return 'bg-purple-100 text-purple-800';
            case 'exchanged': return 'bg-teal-100 text-teal-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-3xl">Returns & Exchanges</h1>
            </div>

            <div className="flex gap-2 mb-6">
                {['all', 'requested', 'approved', 'rejected', 'picked_up', 'refunded', 'exchanged'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 text-xs uppercase tracking-wider rounded-sm transition-colors ${
                            filter === s ? 'bg-black text-white' : 'bg-white text-stone-600 hover:bg-stone-100'
                        }`}
                    >
                        {s === 'all' ? 'All' : s.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">ID</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Customer</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Type</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Order</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Status</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Date</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {loading ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-400">Loading...</td></tr>
                        ) : returns.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-400">No returns found.</td></tr>
                        ) : (
                            returns.map((ret: any) => (
                                <tr key={ret.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-sm">#{ret.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 text-sm text-stone-600">{ret.profiles?.full_name || ret.profiles?.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs uppercase tracking-wide rounded-full ${
                                            ret.type === 'return' ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800'
                                        }`}>{ret.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-600">#{ret.orders?.id?.slice(0, 8)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs uppercase tracking-wide rounded-full ${getStatusColor(ret.status)}`}>
                                            {ret.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-500">{new Date(ret.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/returns/${ret.id}`} className="text-black underline text-xs uppercase tracking-wider hover:text-stone-600">
                                            View
                                        </Link>
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
