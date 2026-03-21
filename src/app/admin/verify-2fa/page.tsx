"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function Verify2FAPage() {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/verify-2fa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Verification failed");
                setLoading(false);
                return;
            }

            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100">
            <div className="w-full max-w-md bg-white p-8 shadow-sm rounded-sm">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                </div>

                <h1 className="font-serif text-2xl text-center mb-2 text-black">Two-Factor Authentication</h1>
                <p className="text-stone-500 text-center text-sm mb-8">
                    Enter the 6-digit code from your authenticator app
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-sm mb-4 border border-red-100 rounded-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-center">
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            placeholder="000000"
                            value={token}
                            onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                            className="text-center text-3xl tracking-[0.5em] w-56 border-b-2 border-stone-300 py-3 focus:outline-none focus:border-black transition-colors bg-transparent text-black font-mono"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || token.length !== 6}
                        className="w-full bg-black text-white py-3 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {loading ? "Verifying..." : "Verify & Continue"}
                    </button>
                </form>

                <p className="text-xs text-stone-400 text-center mt-6">
                    Open your authenticator app (Google Authenticator, Authy, etc.) to get the code.
                </p>
            </div>
        </div>
    );
}
