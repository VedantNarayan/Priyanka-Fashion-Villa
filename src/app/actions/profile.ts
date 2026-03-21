"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const full_name = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;

    const { error } = await supabase
        .from("profiles")
        .update({ full_name, phone })
        .eq("id", user.id);

    if (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile" };
    }

    // Also update auth metadata
    await supabase.auth.updateUser({
        data: { full_name }
    });

    revalidatePath("/account");
    return { success: true };
}

export async function addAddress(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const is_default = formData.get("is_default") === "true";

    // If setting as default, unset all others first
    if (is_default) {
        await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id);
    }

    const { error } = await supabase.from("addresses").insert({
        user_id: user.id,
        label: formData.get("label") as string || "Home",
        full_name: formData.get("full_name") as string,
        phone: formData.get("phone") as string,
        line1: formData.get("line1") as string,
        line2: formData.get("line2") as string || null,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        postal_code: formData.get("postal_code") as string,
        country: "IN",
        is_default,
    });

    if (error) {
        console.error("Error adding address:", error);
        return { error: "Failed to add address" };
    }

    revalidatePath("/account/addresses");
    return { success: true };
}

export async function updateAddress(addressId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const is_default = formData.get("is_default") === "true";

    if (is_default) {
        await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id);
    }

    const { error } = await supabase
        .from("addresses")
        .update({
            label: formData.get("label") as string || "Home",
            full_name: formData.get("full_name") as string,
            phone: formData.get("phone") as string,
            line1: formData.get("line1") as string,
            line2: formData.get("line2") as string || null,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            postal_code: formData.get("postal_code") as string,
            is_default,
        })
        .eq("id", addressId)
        .eq("user_id", user.id);

    if (error) {
        return { error: "Failed to update address" };
    }

    revalidatePath("/account/addresses");
    return { success: true };
}

export async function deleteAddress(addressId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", user.id);

    if (error) {
        return { error: "Failed to delete address" };
    }

    revalidatePath("/account/addresses");
    return { success: true };
}
