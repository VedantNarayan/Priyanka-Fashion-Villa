import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Default to a console warn if Resend is not fully configured, prevents crashing
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(request: Request) {
    try {
        // Authenticate webhook (in production, use a secure secret header from Supabase)
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
            // Soft fail if no auth, allowing testing in dev if no role key exists
            if (process.env.NODE_ENV === 'production') {
                 return NextResponse.json({ error: 'Unauthorized webhook call' }, { status: 401 });
            }
        }

        const payload = await request.json();
        
        // Supabase webhook payload structure
        const record = payload.record || payload;

        if (!record.id || !record.name || record.stock === undefined) {
             return NextResponse.json({ error: 'Invalid payload: missing product data' }, { status: 400 });
        }

        if (record.stock <= 10) {
            console.log(`[INVENTORY ALERT] ${record.name} is low on stock (${record.stock} remaining)`);

            if (process.env.RESEND_API_KEY) {
                try {
                    await resend.emails.send({
                        from: 'Priyanka Fashionvilla <onboarding@resend.dev>',
                        to: 'admin@example.com', // In production, send to actual admin emails
                        subject: `🚨 Inventory Alert: ${record.name} is running low!`,
                        html: `
                            <h2>Inventory Alert</h2>
                            <p>Product: <strong>${record.name}</strong> (ID: ${record.id})</p>
                            <p style="color: red; font-size: 18px;">Current Stock: ${record.stock}</p>
                            <p>Please restock this item soon to avoid out-of-stock scenarios.</p>
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/products/${record.id}/edit">Manage Product</a>
                        `
                    });
                    console.log('Alert email dispatched via Resend.');
                } catch (emailError) {
                    console.error('Failed to send Resend email:', emailError);
                }
            }

            return NextResponse.json({ success: true, alerted: true, message: 'Stock alert processed' });
        }

        return NextResponse.json({ success: true, alerted: false, message: 'Stock level is healthy' });
        
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
