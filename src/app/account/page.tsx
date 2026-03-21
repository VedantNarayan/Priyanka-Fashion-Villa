"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";

export default function AccountPage() {
    const [profile, setProfile] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = "/login";
                return;
            }
            setEmail(user.email || "");
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(data);
            setLoading(false);
        };
        init();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        const result = await updateProfile(formData);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Profile updated!");
        }
    };

    if (loading) return <div className="text-stone-400 text-center py-12">Loading profile...</div>;

    return (
        <div>
            <h1 className="font-serif text-3xl mb-8">My Profile</h1>

            <form action={handleSubmit} className="bg-white p-6 rounded-sm shadow-sm space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Full Name</label>
                        <input
                            name="full_name"
                            defaultValue={profile?.full_name || ''}
                            className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full border border-stone-200 p-3 rounded-sm text-sm text-stone-400 bg-stone-50"
                        />
                    </div>
                </div>
                <div className="md:w-1/2">
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Phone</label>
                    <input
                        name="phone"
                        type="tel"
                        defaultValue={profile?.phone || ''}
                        placeholder="+91 9999999999"
                        className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black focus:outline-none focus:border-black"
                    />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>

                <div className="pt-4 border-t border-stone-100">
                    <p className="text-xs text-stone-400">
                        Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
            </form>
        </div>
    );
}
