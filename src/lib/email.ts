import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export async function sendEmail({
    to,
    subject,
    html
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    if (resend) {
        try {
            await resend.emails.send({
                from: 'Priyanka Fashionvilla <onboarding@resend.dev>',
                to,
                subject,
                html,
            });
            console.log(`[Email] Sent via Resend to ${to}`);
        } catch (error) {
            console.error('[Email] Resend delivery error:', error);
        }
    } else {
        // Fallback for development/testing without API keys
        console.log('\n================== EMAIL MOCK ==================');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body:\n${html.replace(/<[^>]+>/g, '')}`); // Strip HTML for console readability
        console.log('================================================\n');
    }
}

export const emailTemplates = {
    orderConfirmation: (orderId: string, name: string, total: number) => `
        <h1>Order Confirmation</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your order! Your order <strong>#${orderId.slice(0, 8)}</strong> has been confirmed.</p>
        <p>Total amount: ₹${total}</p>
        <p>We'll notify you when your items ship.</p>
    `,
    orderShipped: (orderId: string, name: string, trackingInfo?: string) => `
        <h1>Your Order is on the Way!</h1>
        <p>Hi ${name},</p>
        <p>Great news! Your order <strong>#${orderId.slice(0, 8)}</strong> has been shipped.</p>
        ${trackingInfo ? `<p>Tracking info: ${trackingInfo}</p>` : ''}
    `,
    orderDelivered: (orderId: string, name: string) => `
        <h1>Order Delivered</h1>
        <p>Hi ${name},</p>
        <p>Your order <strong>#${orderId.slice(0, 8)}</strong> has been delivered.</p>
        <p>We hope you love your new purchase! Plase review your items on our website.</p>
    `
};
