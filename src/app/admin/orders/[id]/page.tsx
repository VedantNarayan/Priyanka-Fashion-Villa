import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "@/app/actions/orders";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = params;

    const { data: order } = await supabase
        .from('orders')
        .select(`
            *,
            profiles:user_id (email, full_name, phone)
        `)
        .eq('id', id)
        .single();

    if (!order) {
        notFound();
    }

    // Status Badge Logic
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/orders" className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="font-serif text-3xl flex items-center gap-4">
                        Order #{order.id.slice(0, 8)}
                        <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wide ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
                            <h2 className="font-medium text-sm uppercase tracking-wide flex items-center gap-2">
                                <Package size={16} /> Items
                            </h2>
                        </div>
                        <div className="divide-y divide-stone-100">
                            {order.items && order.items.map((item: any, index: number) => (
                                <div key={index} className="p-6 flex gap-4">
                                    <div className="w-20 h-24 relative bg-stone-100 shrink-0">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-stone-400">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-serif text-lg">{item.name}</h3>
                                        <p className="text-sm text-stone-500">Size: {item.size} | Color: {item.color}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-sm">Qty: {item.quantity}</p>
                                            <p className="font-medium">${item.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-stone-50 p-6 border-t border-stone-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-stone-500 text-sm">Valid Order Total</span>
                                <span className="text-sm font-medium">${order.total_amount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-stone-500 text-sm">Shipping</span>
                                <span className="text-sm font-medium">Free</span>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-200">
                                <span className="font-serif text-lg">Total</span>
                                <span className="font-serif text-xl">${order.total_amount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Actions */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <div className="bg-white rounded-sm shadow-sm p-6">
                        <h2 className="font-medium text-sm uppercase tracking-wide mb-4">Update Status</h2>
                        <form action={async (formData) => {
                            "use server";
                            const status = formData.get("status") as string;
                            await updateOrderStatus(order.id, status);
                        }}>
                            <div className="flex gap-2">
                                <select name="status" defaultValue={order.status} className="flex-1 border border-stone-200 p-2 rounded-sm text-sm focus:outline-none focus:border-black text-black">
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <button type="submit" className="bg-black text-white px-4 py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-stone-800 transition-colors">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-sm shadow-sm p-6">
                        <h2 className="font-medium text-sm uppercase tracking-wide mb-4">Customer Details</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Name</p>
                                <p className="font-medium">{order.profiles?.full_name || "Guest"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Email</p>
                                <p className="font-medium truncate">{order.profiles?.email || order.user_id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Shipping Address</p>
                                <div className="text-sm text-stone-600">
                                    <p>{order.shipping_address?.fullName}</p>
                                    <p>{order.shipping_address?.address}</p>
                                    <p>{order.shipping_address?.city}, {order.shipping_address?.postalCode}</p>
                                    <p>{order.shipping_address?.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
