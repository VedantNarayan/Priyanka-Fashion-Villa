"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ShieldCheck, User } from "lucide-react";
import { submitReview, getProductReviews } from "@/app/actions/reviews";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [rating, setRating] = useState(0);
    const [user, setUser] = useState<any>(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        const data = await getProductReviews(productId);
        setReviews(data || []);
        setLoading(false);
    }, [productId]);

    useEffect(() => {
        const fetchUserData = async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        fetchUserData();
        fetchReviews();
    }, [productId, fetchReviews]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Please login to write a review");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        setSubmitting(true);
        const formData = new FormData(e.currentTarget);
        formData.append("rating", rating.toString());
        
        const result = await submitReview(productId, formData);
        
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Review submitted successfully!");
            setShowForm(false);
            setRating(0);
            fetchReviews();
        }
        setSubmitting(false);
    };

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="mt-24 pt-16 border-t border-stone-100">
            <h2 className="font-serif text-3xl mb-12 text-center">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {/* Stats & Form Toggle */}
                <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-stone-100 pb-8 lg:pb-0 lg:pr-12 text-center lg:text-left">
                    <div className="mb-8">
                        <div className="text-6xl font-serif mb-4">{averageRating}</div>
                        <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                    key={s} 
                                    size={20} 
                                    className={cn("fill-current", s <= Number(averageRating) ? "text-amber-400" : "text-stone-200")} 
                                />
                            ))}
                        </div>
                        <p className="text-stone-500 text-sm">Based on {reviews.length} review{reviews.length !== 1 && 's'}</p>
                    </div>
                    
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="w-full py-4 border border-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                        {showForm ? "Cancel Review" : "Write a Review"}
                    </button>
                    {!user && !showForm && (
                        <p className="text-xs text-stone-400 mt-3">You must be logged in to review.</p>
                    )}
                </div>

                {/* Reviews List & Form */}
                <div className="lg:col-span-2">
                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-stone-50 p-6 md:p-8 rounded-sm mb-12">
                            <h3 className="font-serif text-xl mb-6">Write Your Review</h3>
                            
                            <div className="mb-6">
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="focus:outline-none"
                                        >
                                            <Star 
                                                size={24} 
                                                className={cn(
                                                    "transition-colors", 
                                                    (hoveredRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-stone-300"
                                                )} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Review Title (Optional)</label>
                                <input 
                                    name="title" 
                                    type="text" 
                                    className="w-full bg-white border border-stone-200 p-3 text-sm focus:outline-none focus:border-black"
                                    placeholder="Summarize your thoughts"
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Review Detail *</label>
                                <textarea 
                                    name="body" 
                                    rows={4} 
                                    required
                                    className="w-full bg-white border border-stone-200 p-3 text-sm focus:outline-none focus:border-black"
                                    placeholder="What did you like or dislike?"
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="bg-black text-white px-8 py-3 uppercase text-xs tracking-widest hover:bg-stone-800 disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    )}

                    <div className="space-y-8">
                        {loading ? (
                            <p className="text-stone-400 text-sm">Loading reviews...</p>
                        ) : reviews.length === 0 ? (
                            <p className="text-stone-400 text-sm italic">No reviews yet. Be the first to share your thoughts!</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="border-b border-stone-100 pb-8 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star 
                                                    key={s} 
                                                    size={14} 
                                                    className={cn("fill-current", s <= review.rating ? "text-amber-400" : "text-stone-200")} 
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-stone-400">
                                            {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    
                                    {review.title && <h4 className="font-serif text-lg mb-2">{review.title}</h4>}
                                    <p className="text-stone-600 text-sm leading-relaxed mb-4">{review.body}</p>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                                            <User size={12} />
                                        </div>
                                        <span className="text-xs text-stone-500 font-medium">
                                            {review.profiles?.full_name || "Anonymous User"}
                                        </span>
                                        {review.is_verified && (
                                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-2">
                                                <ShieldCheck size={10} /> Verified Buyer
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
