"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Package, ArrowLeft, Clock, CheckCircle, Truck, MapPin, RotateCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createReturn } from "@/app/actions/returns";

const STATUS_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: Package },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'processing', label: 'Processing', icon: Clock },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: MapPin },
];

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReturn, setShowReturn] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [returnType, setReturnType] = useState("return");
    const [submitting, setSubmitting] = useState(false);
    const supabase = createClient();

    useEffect(() => { fetchOrder(); }, []);

    const fetchOrder = async () => {
        const { data } = await supabase
            .from('orders')
            .select('*')
            .eq('id', params.id)
            .single();

        const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', params.id);

        setOrder(data);
        setOrderItems(items || []);
        setLoading(false);
    };

    const handleReturnRequest = async () => {
        setSubmitting(true);
        const formData = new FormData();
        formData.set("order_id", params.id as string);
        formData.set("type", returnType);
        formData.set("reason", returnReason);
        await createReturn(formData);
        setShowReturn(false);
        alert("Return request submitted successfully!");
        setSubmitting(false);
    };

    if (loading) return <div className="text-stone-400 text-center py-12">Loading order...</div>;
    if (!order) return <div className="text-stone-400 text-center py-12">Order not found.</div>;

    const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order.status);
    const isCancelled = order.status === 'cancelled';
    const items = orderItems.length > 0 ? orderItems : (order.items || []);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/account/orders" className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-serif text-2xl">Order #{order.id.slice(0, 8)}</h1>
                    <p className="text-stone-500 text-sm">{new Date(order.created_at).toLocaleString()}</p>
                </div>
            </div>

            {/* Tracking Timeline */}
            {!isCancelled && (
                <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
                    <h2 className="font-medium text-sm uppercase tracking-wider mb-6">Order Tracking</h2>
                    <div className="flex items-center justify-between relative">
                        {/* Connecting line */}
                        <div className="absolute top-5 left-8 right-8 h-0.5 bg-stone-200" />
                        <div className="absolute top-5 left-8 h-0.5 bg-black transition-all duration-500" style={{ width: `${Math.max(0, (currentStepIdx / (STATUS_STEPS.length - 1)) * 100)}%`, maxWidth: 'calc(100% - 64px)' }} />

                        {STATUS_STEPS.map((step, i) => {
                            const isCompleted = i <= currentStepIdx;
                            const isCurrent = i === currentStepIdx;
                            const Icon = step.icon;
                            return (
                                <div key={step.key} className="flex flex-col items-center z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                        isCompleted ? 'bg-black text-white' : 'bg-stone-200 text-stone-400'
                                    } ${isCurrent ? 'ring-4 ring-stone-300' : ''}`}>
                                        <Icon size={18} />
                                    </div>
                                    <p className={`text-xs mt-2 ${isCompleted ? 'text-black font-medium' : 'text-stone-400'}`}>
                                        {step.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    {order.tracking_number && (
                        <p className="text-sm text-stone-500 mt-4">
                            Tracking: <span className="font-mono text-black">{order.tracking_number}</span>
                        </p>
                    )}
                </div>
            )}

            {isCancelled && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-sm mb-6 text-red-700 text-sm">
                    This order has been cancelled.
                </div>
            )}

            {/* Order Items */}
            <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
                <h2 className="font-medium text-sm uppercase tracking-wider mb-4">Order Items</h2>
                <div className="space-y-4">
                    {items.map((item: any, i: number) => (
                        <div key={item.id || i} className="flex items-center gap-4">
                            {(item.image || item.cardImage) && (
                                <img src={item.image || item.cardImage} alt={item.name} className="w-16 h-16 object-cover rounded-sm" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-stone-500">
                                    {item.size && `Size: ${item.size}`}
                                    {item.size && item.color && ' · '}
                                    {item.color && `Color: ${item.color}`}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-sm">₹{item.price}</p>
                                <p className="text-xs text-stone-500">× {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between items-center">
                    {order.discount_amount > 0 && (
                        <p className="text-sm text-green-600">Discount: -₹{order.discount_amount}</p>
                    )}
                    <p className="font-medium text-lg ml-auto">Total: ₹{order.total_amount}</p>
                </div>
            </div>

            {/* Shipping Address */}
            {order.shipping_address && Object.keys(order.shipping_address).length > 0 && (
                <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
                    <h2 className="font-medium text-sm uppercase tracking-wider mb-3">Shipping Address</h2>
                    <p className="text-sm text-stone-600">
                        {order.shipping_address.full_name || order.shipping_address.name}<br />
                        {order.shipping_address.line1 || order.shipping_address.address}<br />
                        {order.shipping_address.line2 && <>{order.shipping_address.line2}<br /></>}
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code || order.shipping_address.zip}
                    </p>
                </div>
            )}

            {/* Return/Exchange */}
            {order.status === 'delivered' && (
                <div className="bg-white p-6 rounded-sm shadow-sm">
                    {!showReturn ? (
                        <button
                            onClick={() => setShowReturn(true)}
                            className="flex items-center gap-2 text-sm text-stone-600 hover:text-black transition-colors"
                        >
                            <RotateCcw size={16} /> Request Return or Exchange
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="font-medium">Request Return/Exchange</h2>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Type</label>
                                <select
                                    value={returnType}
                                    onChange={(e) => setReturnType(e.target.value)}
                                    className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black"
                                >
                                    <option value="return">Return (Refund)</option>
                                    <option value="exchange">Exchange</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Reason</label>
                                <textarea
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    rows={3}
                                    required
                                    placeholder="Please describe the reason for your return/exchange..."
                                    className="w-full border border-stone-200 p-2 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleReturnRequest}
                                    disabled={!returnReason || submitting}
                                    className="bg-black text-white px-6 py-2 uppercase tracking-widest text-xs hover:bg-stone-800 disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Request'}
                                </button>
                                <button onClick={() => setShowReturn(false)} className="px-4 py-2 text-xs text-stone-500 hover:text-black">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
