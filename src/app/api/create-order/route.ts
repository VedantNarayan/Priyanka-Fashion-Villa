import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.warn("Razorpay keys are missing. Skipping payment initialization.");
        }

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_placeholder",
        });
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { items, amount, shipping_address, coupon_code } = await request.json();

        // Validate coupon if provided
        let discount = 0;
        if (coupon_code) {
            const { data: coupon } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', coupon_code.toUpperCase())
                .eq('is_active', true)
                .single();

            if (coupon) {
                const now = new Date();
                const notExpired = !coupon.expires_at || new Date(coupon.expires_at) > now;
                const notMaxed = !coupon.max_uses || coupon.used_count < coupon.max_uses;
                const meetsMin = amount >= coupon.min_order_amount;

                if (notExpired && notMaxed && meetsMin) {
                    if (coupon.type === 'percentage') {
                        discount = Math.round((amount * coupon.value) / 100);
                    } else {
                        discount = coupon.value;
                    }
                    // Increment used count
                    await supabase
                        .from('coupons')
                        .update({ used_count: coupon.used_count + 1 })
                        .eq('id', coupon.id);
                }
            }
        }

        const finalAmount = Math.max(amount - discount, 0);

        // Create Razorpay Order
        const order = await razorpay.orders.create({
            amount: Math.round(finalAmount * 100), // amount in paise
            currency: "INR",
            receipt: `order_${Math.random().toString(36).substring(7)}`,
        });

        // Create Order in Supabase
        const { data: dbOrder, error } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                total_amount: finalAmount,
                status: 'pending',
                items: items,
                shipping_address: shipping_address || {},
                payment_id: null,
                razorpay_order_id: order.id,
                payment_status: 'pending',
                coupon_code: coupon_code || null,
                discount_amount: discount,
            })
            .select()
            .single();

        if (error) {
            console.error("DB create order error:", error);
            return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
        }

        // Insert order items into normalized table
        if (dbOrder && items && items.length > 0) {
            const orderItems = items.map((item: any) => ({
                order_id: dbOrder.id,
                product_id: item.productId || null,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size || null,
                color: item.color || null,
                image: item.image || null,
            }));

            await supabase.from('order_items').insert(orderItems);
        }

        return NextResponse.json({
            orderId: order,
            dbOrderId: dbOrder?.id,
            discount,
            finalAmount,
        });

    } catch (error: any) {
        console.error("Order creation error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
