"use client";

import { useState } from "react";
import { Shield, Loader2 } from "lucide-react";
import { grantAdminRights } from "@/app/actions/admin";
import { toast } from "sonner";

export default function CustomerActions({ 
    customerId, 
    customerName, 
    customerEmail 
}: { 
    customerId: string, 
    customerName: string, 
    customerEmail: string 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGrantAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await grantAdminRights(customerId, password);
        
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(`Admin rights granted to ${customerName || customerEmail}`);
            setIsOpen(false);
            setPassword("");
        }
        
        setLoading(false);
    };

    return (
        <div>
            <button 
                onClick={() => setIsOpen(true)}
                className="text-stone-500 hover:text-black transition-colors"
                title="Grant Admin Rights"
            >
                <Shield size={16} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 shadow-xl w-full max-w-sm border border-stone-200">
                        <h2 className="font-serif text-xl mb-2">Grant Admin Rights</h2>
                        <p className="text-stone-500 text-sm mb-6">
                            Are you sure you want to make <span className="font-medium text-black">{customerName || customerEmail}</span> an admin? 
                            Please enter your own admin password to confirm.
                        </p>

                        <form onSubmit={handleGrantAdmin}>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Your Admin Password"
                                className="w-full border border-stone-200 px-3 py-2 text-sm mb-4 focus:outline-none focus:border-black"
                            />

                            <div className="flex gap-2 justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsOpen(false); setPassword(""); }}
                                    className="px-4 py-2 text-sm border border-stone-200 hover:bg-stone-50 transition-colors uppercase tracking-wider text-stone-600"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading || !password}
                                    className="px-4 py-2 text-sm bg-black text-white hover:bg-stone-800 transition-colors uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin"/> : null}
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
