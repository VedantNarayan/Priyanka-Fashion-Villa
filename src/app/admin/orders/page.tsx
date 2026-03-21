"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Eye, Trash2, Truck } from "lucide-react";
import { updateOrderStatus, deleteOrder, updateTrackingNumber } from "@/app/actions/orders";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => { fetchOrders(); }, [filter]);

    const fetchOrders = async () => {
        setLoading(true);
        let query = supabase
            .from('orders')
            .select('*, profiles:user_id(full_name, email)')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data } = await query;
        setOrders(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Permanently delete this order?")) {
            await deleteOrder(id);
            setOrders(prev => prev.filter(o => o.id !== id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-purple-100 text-purple-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-stone-100 text-stone-600';
        }
    };

    const filtered = orders.filter(o =>
        o.id?.includes(search) ||
        o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.profiles?.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-3xl">Orders</h1>
                <p className="text-stone-500 text-sm">{orders.length} total</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by order ID, customer name or email..."
                        className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-sm text-sm text-black focus:outline-none focus:border-black bg-white"
                    />
                </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 text-xs uppercase tracking-wider whitespace-nowrap rounded-sm transition-colors ${
                            filter === s ? 'bg-black text-white' : 'bg-white text-stone-600 hover:bg-stone-100'
                        }`}
                    >
                        {s === 'all' ? 'All' : s}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Order</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Customer</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Status</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Payment</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Total</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Date</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {loading ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-400">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-400">No orders found.</td></tr>
                        ) : (
                            filtered.map((order: any) => (
                                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-sm">#{order.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium">{order.profiles?.full_name || 'Customer'}</p>
                                        <p className="text-xs text-stone-400">{order.profiles?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs capitalize rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {order.payment_status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">₹{order.total_amount}</td>
                                    <td className="px-6 py-4 text-sm text-stone-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/orders/${order.id}`} className="p-2 text-stone-400 hover:text-black" title="View">
                                                <Eye size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(order.id)} className="p-2 text-stone-400 hover:text-red-500" title="Delete">
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
