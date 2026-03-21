import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag, Eye } from "lucide-react";

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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

    return (
        <div>
            <h1 className="font-serif text-3xl mb-8">My Orders</h1>

            {!orders || orders.length === 0 ? (
                <div className="bg-white p-12 rounded-sm shadow-sm text-center">
                    <ShoppingBag size={48} className="mx-auto text-stone-300 mb-4" />
                    <p className="text-stone-500 mb-4">You haven&apos;t placed any orders yet.</p>
                    <Link href="/" className="bg-black text-white px-6 py-2 uppercase tracking-widest text-xs hover:bg-stone-800">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => {
                        const items = order.items || [];
                        return (
                            <Link key={order.id} href={`/account/orders/${order.id}`} className="block bg-white p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-stone-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 text-xs capitalize rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-stone-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                                    <p className="font-medium">₹{order.total_amount}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
