"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${location.origin}/auth/callback?next=/update-password`,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ 
                type: 'success', 
                text: "Check your email for the password reset link. Remember to check your spam folder." 
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4 text-black">
            <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-sm">
                <h1 className="font-serif text-3xl text-center mb-2">Reset Password</h1>
                <p className="text-stone-500 text-center mb-8 text-sm uppercase tracking-wide">
                    We will send you a reset link
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

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-stone-300 text-black"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {loading ? "Sending link..." : "Send Reset Link"}
                    </button>
                </form>

                <p className="text-center text-sm text-stone-500 mt-6">
                    Remember your password?{" "}
                    <Link href="/login" className="text-black underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
