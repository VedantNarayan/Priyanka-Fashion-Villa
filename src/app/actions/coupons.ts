"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCoupon(formData: FormData) {
    const supabase = await createClient();

    const code = (formData.get("code") as string).toUpperCase().trim();
    const type = formData.get("type") as string;
    const value = parseFloat(formData.get("value") as string);
    const min_order_amount = parseFloat(formData.get("min_order_amount") as string) || 0;
    const max_uses = formData.get("max_uses") ? parseInt(formData.get("max_uses") as string) : null;
    const expires_at = formData.get("expires_at") as string || null;

    const { error } = await supabase.from("coupons").insert({
        code,
        type,
        value,
        min_order_amount,
        max_uses,
        expires_at: expires_at || null,
        is_active: true,
    });

    if (error) {
        console.error("Error creating coupon:", error);
        return { error: error.message || "Failed to create coupon" };
    }

    revalidatePath("/admin/coupons");
    return { success: true };
}

export async function toggleCoupon(couponId: string, isActive: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("coupons")
        .update({ is_active: isActive })
        .eq("id", couponId);

    if (error) {
        return { error: "Failed to update coupon" };
    }

    revalidatePath("/admin/coupons");
    return { success: true };
}

export async function deleteCoupon(couponId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", couponId);

    if (error) {
        return { error: "Failed to delete coupon" };
    }

    revalidatePath("/admin/coupons");
    return { success: true };
}

export async function validateCoupon(code: string, orderAmount: number) {
    const supabase = await createClient();

    // Check if it is a dynamic Referral Coupon (PVREF[Referrer_Partial_ID])
    if (code.toUpperCase().startsWith("PVREF")) {
        const partialId = code.toUpperCase().replace("PVREF", "");
        
        // We look up if a profile matching this partial ID exists (cast UUID to text ILIKE)
        // Since we are checking from server-side action, we can search using pg or standard query
        const { data: referee, error: refError } = await supabase
            .from("profiles")
            .select("id, email")
            .limit(5); // Get active profiles to search in memory to avoid UUID casting errors in postgrest
            
        const matchingReferee = referee?.find(r => r.id.replace(/-/g, "").toUpperCase().startsWith(partialId));

        if (matchingReferee) {
            const minAmount = 2999;
            if (orderAmount < minAmount) {
                return { error: `Referral coupon requires a minimum order of ₹${minAmount}` };
            }
            return {
                valid: true,
                discount: 1000, // ₹1,000 off incentive for Patna luxury boutique!
                coupon: {
                    code: code.toUpperCase(),
                    type: "fixed",
                    value: 1000,
                },
            };
        } else {
            return { error: "Referrer profile not found" };
        }
    }

    const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

    if (error || !coupon) {
        return { error: "Invalid coupon code" };
    }

    const now = new Date();
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        return { error: "Coupon has expired" };
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        return { error: "Coupon usage limit reached" };
    }

    if (orderAmount < coupon.min_order_amount) {
        return { error: `Minimum order amount is ₹${coupon.min_order_amount}` };
    }

    let discount = 0;
    if (coupon.type === "percentage") {
        discount = Math.round((orderAmount * coupon.value) / 100);
    } else {
        discount = coupon.value;
    }

    return {
        valid: true,
        discount,
        coupon: {
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
        },
    };
}
