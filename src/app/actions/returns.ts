"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function verifyAdmin(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") throw new Error("Forbidden");
}


export async function createReturn(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const order_id = formData.get("order_id") as string;
    const type = formData.get("type") as string;
    const reason = formData.get("reason") as string;

    const { error } = await supabase.from("returns").insert({
        order_id,
        user_id: user.id,
        type,
        reason,
        status: "requested",
    });

    if (error) {
        console.error("Error creating return:", error);
        return { error: "Failed to create return request" };
    }

    revalidatePath("/account/orders");
    revalidatePath("/account/returns");
    revalidatePath("/admin/returns");
    return { success: true };
}

export async function updateReturnStatus(
    returnId: string,
    newStatus: string,
    adminNotes?: string,
    refundAmount?: number
) {
    const supabase = await createClient();
    try {
        await verifyAdmin(supabase);
    } catch (e) {
        return { error: "Unauthorized" };
    }

    const updateData: any = { status: newStatus };
    if (adminNotes) updateData.admin_notes = adminNotes;
    if (refundAmount !== undefined) updateData.refund_amount = refundAmount;

    // If refunded, update order payment status
    if (newStatus === 'refunded') {
        const { data: returnReq } = await supabase
            .from('returns')
            .select('order_id')
            .eq('id', returnId)
            .single();

        if (returnReq) {
            await supabase
                .from('orders')
                .update({ payment_status: 'refunded', status: 'cancelled' })
                .eq('id', returnReq.order_id);
        }
    }

    const { error } = await supabase
        .from("returns")
        .update(updateData)
        .eq("id", returnId);

    if (error) {
        console.error("Error updating return:", error);
        return { error: "Failed to update return" };
    }

    revalidatePath("/admin/returns");
    revalidatePath(`/admin/returns/${returnId}`);
    return { success: true };
}
