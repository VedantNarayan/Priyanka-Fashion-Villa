"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { Sparkles, Gift, Copy, MessageCircle, Coins, Award } from "lucide-react";
import StyleQuiz from "@/components/ui/StyleQuiz";

export default function AccountPage() {
    const [profile, setProfile] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [quizOpen, setQuizOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = "/login";
                return;
            }
            setEmail(user.email || "");
            setUserId(user.id);
            
            // Fetch profile
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(data);

            // Fetch products for quiz
            const { data: prodData } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true);
            setProducts(prodData || []);

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

    const copyReferralLink = () => {
        const refLink = `${window.location.origin}?ref=${userId.slice(0, 8).toUpperCase()}`;
        navigator.clipboard.writeText(refLink);
        toast.success("Referral link copied to clipboard!");
    };

    if (loading) return <div className="text-stone-400 text-center py-12">Loading profile...</div>;

    // Loyalty Tier Logic
    const points = profile?.loyalty_points || 0;
    let tier = "Bronze";
    let nextTier = "Silver";
    let pointsNeeded = 1000 - points;
    let progressPercent = Math.min((points / 1000) * 100, 100);

    if (points >= 5000) {
        tier = "Platinum";
        nextTier = "Elite";
        pointsNeeded = 0;
        progressPercent = 100;
    } else if (points >= 2500) {
        tier = "Gold";
        nextTier = "Platinum";
        pointsNeeded = 5000 - points;
        progressPercent = Math.min(((points - 2500) / 2500) * 100, 100);
    } else if (points >= 1000) {
        tier = "Silver";
        nextTier = "Gold";
        pointsNeeded = 2500 - points;
        progressPercent = Math.min(((points - 1000) / 1500) * 100, 100);
    }

    const startCrispChat = () => {
        if ((window as any).$crisp) {
            (window as any).$crisp.push(["do", "chat:open"]);
        } else {
            toast.info("Stylist chat is not loaded. Please try again later.");
        }
    };

    return (
        <div className="text-black">
            <h1 className="font-serif text-3xl mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Form (Left 2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <form action={handleSubmit} className="bg-white p-6 rounded-sm shadow-sm space-y-6">
                        <h2 className="font-serif text-xl mb-4">Edit Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Full Name</label>
                                <input
                                    name="full_name"
                                    defaultValue={profile?.full_name || ''}
                                    className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black bg-white focus:outline-none focus:border-black"
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
                                className="w-full border border-stone-200 p-3 rounded-sm text-sm text-black bg-white focus:outline-none focus:border-black"
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
                    </form>

                    {/* Personal Styling & Visual Tools */}
                    <div className="bg-gradient-to-r from-stone-900 to-black text-white p-6 rounded-sm shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-stone-850">
                        <div>
                            <span className="bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Premium Service</span>
                            <h3 className="font-serif text-xl mt-2 text-white">Your Signature Personal Stylist</h3>
                            <p className="text-stone-400 text-xs mt-1 max-w-md font-light leading-relaxed">
                                Get custom ethnic outfit curation and styling advice live from our senior boutique consultants in Patna.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setQuizOpen(true)}
                                className="bg-white text-black px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center gap-1.5"
                            >
                                <Sparkles size={14} className="text-stone-900" /> Style Quiz
                            </button>
                            <button
                                onClick={startCrispChat}
                                className="bg-stone-800 text-white border border-stone-750 px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest hover:bg-stone-750 transition-all flex items-center gap-1.5"
                            >
                                <MessageCircle size={14} className="text-amber-400" /> Talk to Stylist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loyalty and Referral Sidebar (Right 1 col) */}
                <div className="space-y-6">
                    {/* Loyalty Points */}
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-serif text-lg text-black">Villa Points</h3>
                            <span className="bg-stone-100 text-stone-800 border border-stone-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <Award size={14} className="text-amber-500" /> {tier}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-sm mb-4">
                            <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-500">
                                <Coins size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-stone-400 uppercase tracking-wider">Current balance</p>
                                <p className="text-2xl font-bold text-stone-900">{points.toLocaleString()} <span className="text-xs text-stone-400 font-normal">pts</span></p>
                            </div>
                        </div>

                        {pointsNeeded > 0 ? (
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-stone-500">
                                    <span>Progress to {nextTier}</span>
                                    <span>{points} / {tier === "Bronze" ? 1000 : tier === "Silver" ? 2500 : 5000}</span>
                                </div>
                                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                                </div>
                                <p className="text-[10px] text-stone-400 mt-1">Earn {pointsNeeded} more points to reach {nextTier} status.</p>
                            </div>
                        ) : (
                            <p className="text-xs text-stone-500">Congratulations! You have reached our premium {tier} loyalty status.</p>
                        )}
                    </div>

                    {/* Referrals */}
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Gift size={20} className="text-amber-500" />
                            <h3 className="font-serif text-lg text-black">Refer & Earn</h3>
                        </div>
                        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                            Share luxury with friends. Send them ₹1,000 off their first order, and earn ₹1,000 in Villa loyalty points when they complete checkout.
                        </p>

                        <div className="bg-stone-50 p-3 rounded-sm flex items-center justify-between border border-stone-200">
                            <code className="text-xs text-stone-800 font-mono select-all truncate max-w-[70%]">
                                PVREF{userId.slice(0, 8).toUpperCase()}
                            </code>
                            <button
                                onClick={copyReferralLink}
                                className="p-2 hover:bg-stone-200 text-stone-500 hover:text-black rounded-sm transition-colors"
                                title="Copy Referral Link"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quiz Modal */}
            <StyleQuiz 
                isOpen={quizOpen} 
                onClose={() => setQuizOpen(false)} 
                products={products} 
            />
        </div>
    );
}
