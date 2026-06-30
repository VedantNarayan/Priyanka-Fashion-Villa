"use server";

import { createClient } from "@/lib/supabase/server";

export async function getBgRemovalStats() {
    const supabase = await createClient();
    
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const { count: todayCount } = await supabase
            .from('bg_removal_log')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfDay)
            .eq('status', 'success');

        const { count: monthCount } = await supabase
            .from('bg_removal_log')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfMonth)
            .eq('status', 'success');

        const costPerImage = 0.039;
        const estimatedCostUSD = (monthCount || 0) * costPerImage;
        const estimatedCostINR = estimatedCostUSD * 83.5;

        return {
            today: todayCount || 0,
            thisMonth: monthCount || 0,
            estimatedCostUSD: Math.round(estimatedCostUSD * 100) / 100,
            estimatedCostINR: Math.round(estimatedCostINR * 100) / 100,
            model: 'gemini-2.5-flash-image',
            dailyLimit: 1000,
        };
    } catch (error) {
        console.warn('bg_removal_log table may not exist yet:', error);
        return {
            today: 0,
            thisMonth: 0,
            estimatedCostUSD: 0,
            estimatedCostINR: 0,
            model: 'gemini-2.5-flash-image',
            dailyLimit: 1000,
        };
    }
}
