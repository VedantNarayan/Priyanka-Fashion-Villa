import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as OTPAuth from "otpauth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { token, enableAfterVerify } = await request.json();

        // Get stored secret
        const { data: profile } = await supabase
            .from('profiles')
            .select('two_factor_secret, two_factor_enabled, role')
            .eq('id', user.id)
            .single();

        if (!profile || !profile.two_factor_secret || profile.role !== 'admin') {
            return NextResponse.json({ message: "2FA not configured" }, { status: 400 });
        }

        // Verify TOTP
        const totp = new OTPAuth.TOTP({
            issuer: "Priyanka Fashionvilla",
            label: user.email || "Admin",
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(profile.two_factor_secret),
        });

        const delta = totp.validate({ token, window: 1 });

        if (delta === null) {
            return NextResponse.json({ message: "Invalid OTP code" }, { status: 400 });
        }

        // If this is the initial setup confirmation, enable 2FA
        if (enableAfterVerify && !profile.two_factor_enabled) {
            await supabase
                .from('profiles')
                .update({ two_factor_enabled: true })
                .eq('id', user.id);
        }

        // Set 2FA verified cookie (expires in 24 hours)
        const cookieStore = await cookies();
        cookieStore.set('2fa_verified', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return NextResponse.json({ verified: true });

    } catch (error: any) {
        console.error("2FA verification error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
