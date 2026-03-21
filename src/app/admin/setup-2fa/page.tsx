"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, CheckCircle } from "lucide-react";

export default function Setup2FAPage() {
    const [step, setStep] = useState<"generate" | "verify" | "done">("generate");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [secretKey, setSecretKey] = useState<string | null>(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/setup-2fa", {
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                setLoading(false);
                return;
            }

            setQrCode(data.qrCode);
            setSecretKey(data.secret);
            setStep("verify");
        } catch {
            setError("Failed to generate 2FA secret");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/verify-2fa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, enableAfterVerify: true }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                setLoading(false);
                return;
            }

            setStep("done");
        } catch {
            setError("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="font-serif text-3xl mb-2">Setup Two-Factor Authentication</h1>
            <p className="text-stone-500 text-sm mb-8">
                Add an extra layer of security to your admin account
            </p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 text-sm mb-6 border border-red-100 rounded-sm">
                    {error}
                </div>
            )}

            {step === "generate" && (
                <div className="bg-white p-8 rounded-sm shadow-sm text-center">
                    <ShieldCheck size={48} className="text-stone-300 mx-auto mb-4" />
                    <h2 className="font-serif text-xl mb-4">Enable 2FA</h2>
                    <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">
                        You&apos;ll need an authenticator app like Google Authenticator, Authy, or 1Password.
                    </p>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {loading ? "Generating..." : "Get Started"}
                    </button>
                </div>
            )}

            {step === "verify" && (
                <div className="bg-white p-8 rounded-sm shadow-sm space-y-6">
                    <div className="text-center">
                        <h2 className="font-serif text-xl mb-4">Scan QR Code</h2>
                        <p className="text-stone-500 text-sm mb-6">
                            Scan this QR code with your authenticator app
                        </p>
                        {qrCode && (
                            <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4 w-48 h-48" />
                        )}
                        {secretKey && (
                            <div className="bg-stone-50 p-3 rounded-sm text-sm mb-4">
                                <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Manual Key</p>
                                <code className="text-black font-mono text-sm select-all">{secretKey}</code>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                placeholder="000000"
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                                className="text-center text-2xl tracking-[0.5em] w-full border border-stone-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent text-black font-mono rounded-sm"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || token.length !== 6}
                            className="w-full bg-black text-white py-3 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="animate-spin" size={16} />}
                            {loading ? "Verifying..." : "Verify & Enable 2FA"}
                        </button>
                    </form>
                </div>
            )}

            {step === "done" && (
                <div className="bg-white p-8 rounded-sm shadow-sm text-center">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h2 className="font-serif text-xl mb-2">2FA Enabled!</h2>
                    <p className="text-stone-500 text-sm mb-6">
                        Your account is now protected with two-factor authentication.
                        You&apos;ll need your authenticator code each time you access the admin panel.
                    </p>
                    <button
                        onClick={() => router.push("/admin")}
                        className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}
