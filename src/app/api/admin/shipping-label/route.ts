import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Verify admin access
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Parse request body
        const { orderId } = await request.json();
        
        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        // 3. Fetch order information for the label (simulated courier interaction)
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, profiles:user_id(full_name, email, phone)')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 4. Simulate API call to logistics partner (e.g., Delhivery, Shiprocket, BlueDart)
        console.log(`[Logistics API] Generating label for Order ${orderId}...`);
        
        // Mock successful generation with a tracking number and PDF URL
        const mockTrackingNumber = `AWB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const mockLabelUrl = `https://cdn.fashionvilla.com/labels/${mockTrackingNumber}.pdf`;

        // 5. Update order with tracking information
        const { error: updateError } = await supabase
            .from('orders')
            .update({ 
                tracking_number: mockTrackingNumber,
                status: 'shipped' // Automatically move to shipped
            })
            .eq('id', orderId);

        if (updateError) {
            throw new Error('Failed to update order with tracking info');
        }

        return NextResponse.json({ 
            success: true, 
            trackingNumber: mockTrackingNumber,
            labelUrl: mockLabelUrl,
            message: 'Shipping label generated successfully and order marked as shipped.'
        });

    } catch (error: any) {
        console.error('Shipping label generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
