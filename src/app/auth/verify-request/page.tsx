import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function VerifyRequest() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4 text-black">
            <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-sm text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                        <MailCheck className="text-green-600" size={32} />
                    </div>
                </div>

                <h1 className="font-serif text-2xl mb-4">Check your email</h1>
                <p className="text-stone-600 mb-8">
                    We sent a sign-in link to your email address.
                    <br />Please click the link to verify your account.
                </p>

                <Link
                    href="/login"
                    className="text-stone-500 hover:text-black hover:underline text-sm uppercase tracking-wide"
                >
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}
