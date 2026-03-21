"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateReturnStatus } from "@/app/actions/returns";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function AdminReturnDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [returnReq, setReturnReq] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [adminNotes, setAdminNotes] = useState("");
    const [refundAmount, setRefundAmount] = useState("");
    const [updating, setUpdating] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchReturn();
    }, []);

    const fetchReturn = async () => {
        const { data } = await supabase
            .from('returns')
            .select('*, profiles:user_id(full_name, email, phone), orders:order_id(id, total_amount, items, created_at, status)')
            .eq('id', params.id)
            .single();

        setReturnReq(data);
        setAdminNotes(data?.admin_notes || "");
        setRefundAmount(data?.refund_amount?.toString() || data?.orders?.total_amount?.toString() || "");
        setLoading(false);
    };

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        await updateReturnStatus(
            params.id as string,
            newStatus,
            adminNotes,
            newStatus === 'refunded' ? parseFloat(refundAmount) : undefined
        );
        router.refresh();
        fetchReturn();
        setUpdating(false);
    };

    if (loading) return <div className="text-stone-400 text-center py-12">Loading...</div>;
    if (!returnReq) return <div className="text-stone-400 text-center py-12">Return not found.</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'refunded': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/returns" className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-serif text-3xl flex items-center gap-3">
                        Return #{returnReq.id.slice(0, 8)}
                        <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wide ${getStatusColor(returnReq.status)}`}>
                            {returnReq.status.replace('_', ' ')}
                        </span>
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">
                        {returnReq.type === 'return' ? 'Return Request' : 'Exchange Request'} • {new Date(returnReq.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Reason */}
                    <div className="bg-white p-6 rounded-sm shadow-sm">
                        <h2 className="font-medium text-sm uppercase tracking-wide mb-3">Reason</h2>
                        <p className="text-stone-600">{returnReq.reason}</p>
                    </div>

                    {/* Linked Order */}
                    <div className="bg-white p-6 rounded-sm shadow-sm">
                        <h2 className="font-medium text-sm uppercase tracking-wide mb-3">Linked Order</h2>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Order #{returnReq.orders?.id?.slice(0, 8)}</p>
                                <p className="text-sm text-stone-500">{new Date(returnReq.orders?.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">₹{returnReq.orders?.total_amount}</p>
                                <Link href={`/admin/orders/${returnReq.order_id}`} className="text-xs text-black underline uppercase tracking-wider">View Order</Link>
                            </div>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-white p-6 rounded-sm shadow-sm">
                        <h2 className="font-medium text-sm uppercase tracking-wide mb-3">Admin Notes</h2>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={3}
                            className="w-full border border-stone-200 p-3 rounded-sm focus:outline-none focus:border-black text-sm text-black"
                            placeholder="Internal notes about this return..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white p-6 rounded-sm shadow-sm">
                        <h2 className="font-medium text-sm uppercase tracking-wide mb-3">Customer</h2>
                        <p className="font-medium">{returnReq.profiles?.full_name || 'Customer'}</p>
                        <p className="text-sm text-stone-500">{returnReq.profiles?.email}</p>
                        {returnReq.profiles?.phone && <p className="text-sm text-stone-500">{returnReq.profiles.phone}</p>}
                    </div>

                    {/* Actions */}
                    <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                        <h2 className="font-medium text-sm uppercase tracking-wide mb-3">Actions</h2>

                        {returnReq.type === 'return' && returnReq.status !== 'refunded' && (
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-stone-500">Refund Amount (₹)</label>
                                <input
                                    type="number"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    className="w-full border border-stone-200 p-2 rounded-sm text-sm focus:outline-none focus:border-black text-black"
                                />
                            </div>
                        )}

                        {returnReq.status === 'requested' && (
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleStatusUpdate('approved')}
                                    disabled={updating}
                                    className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-green-700 disabled:opacity-50"
                                >
                                    <CheckCircle size={14} /> Approve
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('rejected')}
                                    disabled={updating}
                                    className="flex items-center justify-center gap-2 bg-red-600 text-white py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-red-700 disabled:opacity-50"
                                >
                                    <XCircle size={14} /> Reject
                                </button>
                            </div>
                        )}

                        {returnReq.status === 'approved' && (
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleStatusUpdate('picked_up')}
                                    disabled={updating}
                                    className="w-full bg-blue-600 text-white py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Mark as Picked Up
                                </button>
                                {returnReq.type === 'return' && (
                                    <button
                                        onClick={() => handleStatusUpdate('refunded')}
                                        disabled={updating}
                                        className="w-full bg-purple-600 text-white py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        Process Refund
                                    </button>
                                )}
                                {returnReq.type === 'exchange' && (
                                    <button
                                        onClick={() => handleStatusUpdate('exchanged')}
                                        disabled={updating}
                                        className="w-full bg-teal-600 text-white py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-teal-700 disabled:opacity-50"
                                    >
                                        Mark as Exchanged
                                    </button>
                                )}
                            </div>
                        )}

                        {returnReq.status === 'picked_up' && (
                            <div className="space-y-2">
                                {returnReq.type === 'return' && (
                                    <button
                                        onClick={() => handleStatusUpdate('refunded')}
                                        disabled={updating}
                                        className="w-full bg-purple-600 text-white py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        Process Refund (₹{refundAmount})
                                    </button>
                                )}
                                {returnReq.type === 'exchange' && (
                                    <button
                                        onClick={() => handleStatusUpdate('exchanged')}
                                        disabled={updating}
                                        className="w-full bg-teal-600 text-white py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-teal-700 disabled:opacity-50"
                                    >
                                        Mark as Exchanged
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
