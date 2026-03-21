import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, Mail, ShoppingBag } from "lucide-react";
import CustomerActions from "@/components/admin/CustomerActions";

export default async function AdminCustomersPage() {
    const supabase = await createClient();

    const { data: customers } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

    // Get order counts per customer
    const customerIds = customers?.map(c => c.id) || [];
    let orderCounts: Record<string, { count: number; total: number }> = {};

    if (customerIds.length > 0) {
        const { data: orders } = await supabase
            .from('orders')
            .select('user_id, total_amount')
            .in('user_id', customerIds)
            .eq('payment_status', 'paid');

        if (orders) {
            orders.forEach(o => {
                if (!orderCounts[o.user_id]) {
                    orderCounts[o.user_id] = { count: 0, total: 0 };
                }
                orderCounts[o.user_id].count++;
                orderCounts[o.user_id].total += o.total_amount || 0;
            });
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-3xl">Customers</h1>
                <p className="text-stone-500 text-sm">{customers?.length || 0} total</p>
            </div>

            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Customer</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Email</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Phone</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Orders</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Total Spent</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500">Joined</th>
                            <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider text-stone-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {!customers || customers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-stone-400">No customers found.</td>
                            </tr>
                        ) : (
                            customers.map((customer: any) => {
                                const stats = orderCounts[customer.id] || { count: 0, total: 0 };
                                return (
                                    <tr key={customer.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
                                                    {(customer.full_name?.[0] || customer.email?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <span className="font-medium text-sm">{customer.full_name || 'No Name'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-stone-600">{customer.email}</td>
                                        <td className="px-6 py-4 text-sm text-stone-600">{customer.phone || '—'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm">
                                                <ShoppingBag size={14} className="text-stone-400" />
                                                {stats.count}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">₹{stats.total.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-sm text-stone-500">
                                            {new Date(customer.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end pr-2">
                                                <CustomerActions 
                                                    customerId={customer.id} 
                                                    customerName={customer.full_name || ""} 
                                                    customerEmail={customer.email || ""}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
