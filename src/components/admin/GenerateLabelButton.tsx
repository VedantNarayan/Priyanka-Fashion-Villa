"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function GenerateLabelButton({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/shipping-label', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to generate label');

            toast.success('Shipping label generated! Order marked as shipped.');
            router.refresh(); // Refresh page to see new status and tracking number
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (currentStatus === 'shipped' || currentStatus === 'delivered' || currentStatus === 'cancelled') {
        return null;
    }

    return (
        <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-4 flex justify-center items-center gap-2 bg-stone-900 text-white px-4 py-3 text-sm uppercase tracking-wider rounded-sm hover:bg-stone-800 transition-colors disabled:opacity-50"
        >
            <Truck size={16} />
            {loading ? 'Generating...' : 'Generate Shipping Label'}
        </button>
    );
}
