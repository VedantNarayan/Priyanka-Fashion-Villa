import { createClient } from "@/lib/supabase/server";
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch real stats
    const [
        { count: totalOrders },
        { count: totalCustomers },
        { count: totalProducts },
        { data: revenueData },
        { data: recentOrders },
        { data: lowStockProducts },
        { data: pendingReturns },
    ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('orders').select('total_amount').eq('payment_status', 'paid'),
        supabase.from('orders').select('*, profiles:user_id(full_name, email)').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('id, name, stock').eq('is_active', true).lt('stock', 10).order('stock', { ascending: true }).limit(5),
        supabase.from('returns').select('*, profiles:user_id(full_name), orders:order_id(id)').eq('status', 'requested').order('created_at', { ascending: false }).limit(5),
    ]);

    const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

    return (
        <div>
            <h1 className="font-serif text-3xl mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-stone-500 text-sm uppercase tracking-wider">Total Revenue</h3>
                        <DollarSign size={20} className="text-green-500" />
                    </div>
                    <p className="text-3xl font-medium">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-stone-400 mt-2">{totalOrders || 0} paid orders</p>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-stone-500 text-sm uppercase tracking-wider">Total Orders</h3>
                        <ShoppingBag size={20} className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-medium">{totalOrders || 0}</p>
                    <Link href="/admin/orders" className="text-xs text-blue-500 mt-2 inline-block hover:underline">View all →</Link>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-stone-500 text-sm uppercase tracking-wider">Customers</h3>
                        <Users size={20} className="text-purple-500" />
                    </div>
                    <p className="text-3xl font-medium">{totalCustomers || 0}</p>
                    <Link href="/admin/customers" className="text-xs text-purple-500 mt-2 inline-block hover:underline">View all →</Link>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-stone-500 text-sm uppercase tracking-wider">Products</h3>
                        <Package size={20} className="text-orange-500" />
                    </div>
                    <p className="text-3xl font-medium">{totalProducts || 0}</p>
                    <Link href="/admin/products" className="text-xs text-orange-500 mt-2 inline-block hover:underline">Manage →</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-xl">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs uppercase tracking-wider text-stone-500 hover:text-black">View All</Link>
                    </div>
                    {!recentOrders || recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-stone-400">No orders yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order: any) => (
                                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between p-3 rounded-sm hover:bg-stone-50 transition-colors">
                                    <div>
                                        <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-stone-500">{order.profiles?.full_name || order.profiles?.email || 'Customer'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">₹{order.total_amount}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>{order.status}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Alerts */}
                <div className="space-y-6">
                    {/* Low Stock Alert */}
                    <div className="bg-white p-6 rounded-sm shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle size={18} className="text-amber-500" />
                            <h2 className="font-medium text-sm uppercase tracking-wide">Low Stock</h2>
                        </div>
                        {!lowStockProducts || lowStockProducts.length === 0 ? (
                            <p className="text-sm text-stone-400">All products are well stocked.</p>
                        ) : (
                            <div className="space-y-2">
                                {lowStockProducts.map((p: any) => (
                                    <div key={p.id} className="flex justify-between text-sm">
                                        <span className="text-stone-600 truncate mr-2">{p.name}</span>
                                        <span className={`font-medium ${p.stock <= 0 ? 'text-red-500' : 'text-amber-500'}`}>
                                            {p.stock <= 0 ? 'Out' : p.stock}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending Returns */}
                    <div className="bg-white p-6 rounded-sm shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <RotateCcw size={18} className="text-blue-500" />
                            <h2 className="font-medium text-sm uppercase tracking-wide">Pending Returns</h2>
                        </div>
                        {!pendingReturns || pendingReturns.length === 0 ? (
                            <p className="text-sm text-stone-400">No pending returns.</p>
                        ) : (
                            <div className="space-y-2">
                                {pendingReturns.map((r: any) => (
                                    <Link key={r.id} href={`/admin/returns/${r.id}`} className="flex justify-between text-sm hover:bg-stone-50 p-1 rounded-sm">
                                        <span className="text-stone-600 truncate mr-2">{r.profiles?.full_name || 'Customer'}</span>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full capitalize">{r.type}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
