"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: "Passwords do not match." });
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
            setLoading(false);
        } else {
            setMessage({ type: 'success', text: "Password updated successfully!" });
            
            // Wait 2 seconds then redirect
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4 text-black">
            <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-sm">
                <h1 className="font-serif text-3xl text-center mb-2">Set New Password</h1>
                <p className="text-stone-500 text-center mb-8 text-sm uppercase tracking-wide">
                    Choose a strong password
                </p>

                {message && (
                    <div className={`p-3 text-sm mb-4 border ${
                        message.type === 'error' 
                            ? 'bg-red-50 text-red-600 border-red-100' 
                            : 'bg-green-50 text-green-700 border-green-100'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-stone-300 text-black"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-stone-300 text-black"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
