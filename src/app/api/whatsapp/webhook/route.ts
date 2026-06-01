import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseStatusCommand } from "@/lib/whatsapp";

/**
 * WhatsApp Webhook — receives incoming messages from Meta Business API
 * GET: Webhook verification
 * POST: Incoming message handling
 */

// Webhook verification (Meta sends GET request during setup)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "priyanka-fashionvilla-webhook";

    if (mode === "subscribe" && token === verifyToken) {
        return new Response(challenge, { status: 200 });
    }

    return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// Handle incoming messages
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Meta Cloud API format
        const entry = body?.entry?.[0];
        const changes = entry?.changes?.[0];
        const message = changes?.value?.messages?.[0];

        if (!message || message.type !== "text") {
            return NextResponse.json({ status: "ok" });
        }

        const incomingText = message.text.body;
        const command = parseStatusCommand(incomingText);

        if (!command) {
            return NextResponse.json({ status: "ignored" });
        }

        const supabase = await createClient();

        // Find order by partial ID via Postgres RPC function (handles UUID typecasting)
        const { data: orders, error: rpcError } = await supabase
            .rpc("find_order_by_partial_id", { partial_id: command.orderRef })
            .limit(1);

        if (rpcError || !orders || orders.length === 0) {
            console.error("[WhatsApp] Order lookup error:", rpcError);
            return NextResponse.json({ status: "order_not_found" });
        }

        const order = orders[0];

        // Update order status
        await supabase
            .from("orders")
            .update({ status: command.action })
            .eq("id", order.id);

        console.log(`[WhatsApp] Order ${order.id.slice(0, 8)} updated to ${command.action}`);

        return NextResponse.json({ status: "updated", orderId: order.id, newStatus: command.action });

    } catch (error) {
        console.error("[WhatsApp Webhook] Error:", error);
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}
