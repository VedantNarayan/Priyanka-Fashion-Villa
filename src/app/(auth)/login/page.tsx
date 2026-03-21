"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.refresh();
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4 text-black">
            <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-sm">
                <h1 className="font-serif text-3xl text-center mb-2">Welcome Back</h1>
                <p className="text-stone-500 text-center mb-8 text-sm uppercase tracking-wide">
                    Sign in to your account
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-sm mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                            Password
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-stone-500 mt-6">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-black underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
