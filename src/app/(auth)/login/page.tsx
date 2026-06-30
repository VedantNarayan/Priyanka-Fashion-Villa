"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const redirectTo = searchParams.get("redirect") || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (data?.user) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
            router.refresh();
            if (profile?.role === 'admin') {
                router.push("/admin");
            } else {
                router.push(redirectTo);
            }
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
                        <div className="flex justify-end mt-2">
                            <Link href="/reset-password" className="text-xs text-stone-500 hover:text-black hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-stone-50 text-black">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}

