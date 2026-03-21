"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function grantAdminRights(targetUserId: string, adminPassword: string) {
    try {
        const supabase = await createClient();
        
        // 1. Get the current logged-in user (the admin)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user || !user.email) {
            return { error: "Authentication required." };
        }

        // 2. Check if the current user is actually an admin in the profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return { error: "You must be an admin to perform this action." };
        }

        // 3. Verify the admin's password
        // We do this by attempting to sign in with their email and the provided password
        // Use a separate client so we don't mess up their current session state
        // Actually, signInWithPassword will update the session, but since we are on the server
        // and not passing the response object to Next/headers directly in this isolated block,
        // it acts as a verify step.
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: adminPassword,
        });

        if (signInError) {
            return { error: "Incorrect admin password." };
        }

        // 4. Update the target user's role
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', targetUserId);

        if (updateError) {
            return { error: "Failed to update user role." };
        }

        revalidatePath('/admin/customers');
        return { success: true };

    } catch (err: any) {
        return { error: err.message || "An unexpected error occurred." };
    }
}
