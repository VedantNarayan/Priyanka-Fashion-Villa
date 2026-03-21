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
