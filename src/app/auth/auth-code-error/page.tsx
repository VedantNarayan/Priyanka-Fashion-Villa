import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthCodeError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4 text-black">
            <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-sm text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                </div>

                <h1 className="font-serif text-2xl mb-4">Link Expired or Invalid</h1>
                <p className="text-stone-600 mb-8">
                    The link you clicked has expired or is no longer valid.
                    This usually happens if the link was already used or if it timed out.
                    <br /><br />
                    Please try requesting a new link.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="w-full bg-black text-white py-3 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors inline-block"
                    >
                        Back to Login
                    </Link>
                    <Link
                        href="/reset-password"
                        className="text-stone-500 hover:text-black hover:underline text-sm uppercase tracking-wide mt-2"
                    >
                        Request New Password Reset
                    </Link>
                </div>
            </div>
        </div>
    );
}
