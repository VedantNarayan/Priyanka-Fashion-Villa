"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "You must be logged in to review." };

    const rating = Number(formData.get("rating"));
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    if (!rating || rating < 1 || rating > 5) return { error: "Invalid rating" };
    if (!body?.trim()) return { error: "Review cannot be empty" };

    try {
        // Check if user has purchased the item
        const { data: orderItems, error: orderError } = await supabase
            .from("order_items")
            .select(`
                id,
                orders!inner(user_id, status)
            `)
            .eq("product_id", productId);
            
        // We will allow users to review even if not purchased, but mark is_verified correctly
        const is_verified = orderItems ? orderItems.some((item: any) => item.orders?.user_id === user.id && item.orders?.status === 'delivered') : false;

        const { error } = await supabase
            .from("reviews")
            .insert({
                product_id: productId,
                user_id: user.id,
                rating,
                title,
                body,
                is_verified
            });

        if (error) {
            if (error.code === '23505') { // Unique constraint
               return { error: "You have already reviewed this product." };
            }
            return { error: error.message || "Database error submitting review" };
            throw error;
        }

        // Update product average rating & review count
        const { data: stats } = await supabase
            .from("reviews")
            .select("rating")
            .eq("product_id", productId);
            
        if (stats && stats.length > 0) {
            const count = stats.length;
            const avg = stats.reduce((sum, r) => sum + r.rating, 0) / count;
            
            await supabase
                .from("products")
                .update({ 
                    rating: Number(avg.toFixed(1)), 
                    review_count: count 
                })
                .eq("id", productId);
        }

        revalidatePath(`/product/${productId}`);
        revalidatePath(`/shop`);
        
        return { success: true };
    } catch (err: any) {
        console.error("Review submission error:", err);
        return { error: err?.message || "Failed to submit review." };
    }
}

export async function getProductReviews(productId: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("reviews")
        .select(`
            id, rating, title, body, created_at, is_verified,
            profiles(full_name, avatar_url)
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
        
    if (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
    
    return data;
}
