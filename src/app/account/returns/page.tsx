import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RotateCcw } from "lucide-react";

export default async function UserReturnsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: returns } = await supabase
        .from('returns')
        .select('*, orders:order_id(id, total_amount)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested': return 'bg-yellow-100 text-yellow-700';
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'refunded': return 'bg-purple-100 text-purple-700';
            case 'exchanged': return 'bg-teal-100 text-teal-700';
            default: return 'bg-stone-100 text-stone-600';
        }
    };

    return (
        <div>
            <h1 className="font-serif text-3xl mb-8">My Returns</h1>

            {!returns || returns.length === 0 ? (
                <div className="bg-white p-12 rounded-sm shadow-sm text-center">
                    <RotateCcw size={48} className="mx-auto text-stone-300 mb-4" />
                    <p className="text-stone-500">No return requests.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {returns.map((ret: any) => (
                        <div key={ret.id} className="bg-white p-6 rounded-sm shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-medium text-sm">
                                        {ret.type === 'return' ? '↩ Return' : '🔄 Exchange'} Request
                                    </p>
                                    <p className="text-xs text-stone-500">
                                        Order #{ret.orders?.id?.slice(0, 8)} • {new Date(ret.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-xs capitalize rounded-full ${getStatusColor(ret.status)}`}>
                                    {ret.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-sm text-stone-600 mt-2">{ret.reason}</p>
                            {ret.admin_notes && (
                                <p className="text-sm text-stone-500 mt-2 bg-stone-50 p-2 rounded-sm">
                                    <span className="font-medium">Admin: </span>{ret.admin_notes}
                                </p>
                            )}
                            {ret.refund_amount && (
                                <p className="text-sm text-green-600 mt-2 font-medium">Refund: ₹{ret.refund_amount}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
