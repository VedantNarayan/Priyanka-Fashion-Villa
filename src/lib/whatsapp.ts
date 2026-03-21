/**
 * WhatsApp Business API Integration
 * Supports Meta Cloud API or Twilio-based integration
 * Configure via admin settings or environment variables
 */

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || '';
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || '';
const ADMIN_PHONE = process.env.WHATSAPP_ADMIN_PHONE || '';

interface OrderNotification {
    orderId: string;
    customerName: string;
    totalAmount: number;
    itemCount: number;
    paymentStatus: string;
}

export async function sendOrderNotification(order: OrderNotification): Promise<boolean> {
    if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN || !ADMIN_PHONE) {
        console.log('[WhatsApp] Not configured — skipping notification');
        return false;
    }

    const message = `🛍️ *New Order Received!*

📦 Order: #${order.orderId.slice(0, 8)}
👤 Customer: ${order.customerName}
💰 Amount: ₹${order.totalAmount}
📝 Items: ${order.itemCount}
💳 Payment: ${order.paymentStatus}

_Reply with a command to update:_
• \`ship ${order.orderId.slice(0, 8)}\` — Mark as Shipped
• \`deliver ${order.orderId.slice(0, 8)}\` — Mark as Delivered
• \`cancel ${order.orderId.slice(0, 8)}\` — Cancel Order`;

    try {
        const response = await fetch(WHATSAPP_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: ADMIN_PHONE,
                type: 'text',
                text: { body: message },
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('[WhatsApp] Send failed:', err);
            return false;
        }

        console.log('[WhatsApp] Order notification sent successfully');
        return true;
    } catch (error) {
        console.error('[WhatsApp] Error sending notification:', error);
        return false;
    }
}

export async function sendStatusUpdate(
    customerPhone: string,
    orderId: string,
    newStatus: string
): Promise<boolean> {
    if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN) {
        console.log('[WhatsApp] Not configured — skipping customer notification');
        return false;
    }

    const statusMessages: Record<string, string> = {
        confirmed: '✅ Your order has been confirmed and is being prepared!',
        processing: '🔧 Your order is being processed.',
        shipped: '🚚 Your order has been shipped! Track it from your account.',
        delivered: '📬 Your order has been delivered! We hope you love it.',
        cancelled: '❌ Your order has been cancelled.',
    };

    const statusMsg = statusMessages[newStatus] || `Your order status has been updated to: ${newStatus}`;

    const message = `🛍️ *Priyanka Fashionvilla*

Order #${orderId.slice(0, 8)}
${statusMsg}

Visit your account for details.`;

    try {
        const response = await fetch(WHATSAPP_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: customerPhone,
                type: 'text',
                text: { body: message },
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('[WhatsApp] Error sending status update:', error);
        return false;
    }
}

/**
 * Parse incoming WhatsApp messages for order status commands
 * Expected formats: "ship abc123", "deliver abc123", "cancel abc123"
 */
export function parseStatusCommand(message: string): { action: string; orderRef: string } | null {
    const trimmed = message.trim().toLowerCase();
    const match = trimmed.match(/^(ship|deliver|cancel|process|confirm)\s+#?([a-z0-9]+)$/);
    
    if (!match) return null;

    const actionMap: Record<string, string> = {
        ship: 'shipped',
        deliver: 'delivered',
        cancel: 'cancelled',
        process: 'processing',
        confirm: 'confirmed',
    };

    return {
        action: actionMap[match[1]] || match[1],
        orderRef: match[2],
    };
}
