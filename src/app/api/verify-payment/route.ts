import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createHmac } from "crypto";
import { sendOrderNotification } from "@/lib/whatsapp";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            db_order_id
        } = await request.json();

        // Verify Razorpay signature
        const keySecret = process.env.RAZORPAY_KEY_SECRET!;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = createHmac("sha256", keySecret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            // Mark payment as failed
            if (db_order_id) {
                await supabase
                    .from('orders')
                    .update({ payment_status: 'failed' })
                    .eq('id', db_order_id);
            }
            return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
        }

        // Payment verified — update order
        if (db_order_id) {
            await supabase
                .from('orders')
                .update({
                    razorpay_payment_id,
                    razorpay_signature,
                    payment_status: 'paid',
                    status: 'confirmed'
                })
                .eq('id', db_order_id);

            // Deduct stock for each item
            const { data: orderItems } = await supabase
                .from('order_items')
                .select('product_id, quantity')
                .eq('order_id', db_order_id);

            if (orderItems) {
                for (const item of orderItems) {
                    if (item.product_id) {
                        await supabase.rpc('decrement_stock', {
                            p_id: item.product_id,
                            qty: item.quantity
                        });
                    }
                }
            }

            // Get order details for WhatsApp notification
            const { data: order } = await supabase
                .from('orders')
                .select('*, profiles:user_id(full_name)')
                .eq('id', db_order_id)
                .single();

            if (order) {
                // Send WhatsApp notification to admin (non-blocking)
                sendOrderNotification({
                    orderId: order.id,
                    customerName: order.profiles?.full_name || user.email || 'Customer',
                    totalAmount: order.total_amount,
                    itemCount: orderItems?.length || 0,
                    paymentStatus: 'Paid',
                }).catch(console.error);

                // Send Email to customer
                if (user.email) {
                    sendEmail({
                        to: user.email,
                        subject: `Order Confirmation #${order.id.slice(0, 8)}`,
                        html: emailTemplates.orderConfirmation(
                            order.id, 
                            order.profiles?.full_name || "Customer", 
                            order.total_amount
                        )
                    }).catch(console.error);
                }
            }
        }

        return NextResponse.json({ verified: true });

    } catch (error: any) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
