"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = await createClient();

    const updateData: any = { status: newStatus };
    
    // If cancelled, restore stock
    if (newStatus === 'cancelled') {
        const { data: orderItems } = await supabase
            .from('order_items')
            .select('product_id, quantity')
            .eq('order_id', orderId);

        if (orderItems) {
            for (const item of orderItems) {
                if (item.product_id) {
                    const { data: product } = await supabase
                        .from('products')
                        .select('stock')
                        .eq('id', item.product_id)
                        .single();

                    if (product) {
                        await supabase
                            .from('products')
                            .update({ stock: (product.stock || 0) + item.quantity })
                            .eq('id', item.product_id);
                    }
                }
            }
        }
    }

    const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order status:", error);
        return { error: "Failed to update order status" };
    }

    // Try to send an email notification
    try {
        const { data: orderData } = await supabase
            .from('orders')
            .select('*, profiles:user_id(email, full_name)')
            .eq('id', orderId)
            .single();

        if (orderData && orderData.profiles?.email) {
            const customerName = orderData.profiles.full_name || "Customer";
            const toEmail = orderData.profiles.email;
            
            if (newStatus === 'shipped') {
                sendEmail({
                    to: toEmail,
                    subject: `Your order #${orderId.slice(0, 8)} has been shipped!`,
                    html: emailTemplates.orderShipped(orderId, customerName, orderData.tracking_number)
                }).catch(console.error);
            } else if (newStatus === 'delivered') {
                sendEmail({
                    to: toEmail,
                    subject: `Your order #${orderId.slice(0, 8)} has been delivered`,
                    html: emailTemplates.orderDelivered(orderId, customerName)
                }).catch(console.error);
            }
        }
    } catch(err) {
         console.error("Failed sending status email", err);
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
}

export async function deleteOrder(orderId: string) {
    const supabase = await createClient();

    // Delete order items first
    await supabase.from('order_items').delete().eq('order_id', orderId);
    
    const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

    if (error) {
        console.error("Error deleting order:", error);
        return { error: "Failed to delete order" };
    }

    revalidatePath("/admin/orders");
    return { success: true };
}

export async function updateTrackingNumber(orderId: string, trackingNumber: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("orders")
        .update({ tracking_number: trackingNumber })
        .eq("id", orderId);

    if (error) {
        console.error("Error updating tracking:", error);
        return { error: "Failed to update tracking number" };
    }

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
}
