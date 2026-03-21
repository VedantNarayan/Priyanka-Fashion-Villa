import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, two_factor_enabled')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        if (profile.two_factor_enabled) {
            return NextResponse.json({ message: "2FA already enabled" }, { status: 400 });
        }

        // Generate TOTP secret
        const secret = new OTPAuth.Secret({ size: 20 });
        const totp = new OTPAuth.TOTP({
            issuer: "Priyanka Fashionvilla",
            label: user.email || "Admin",
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: secret,
        });

        const otpauthUrl = totp.toString();
        const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

        // Store the secret temporarily (will be confirmed when user verifies first OTP)
        await supabase
            .from('profiles')
            .update({ two_factor_secret: secret.base32 })
            .eq('id', user.id);

        return NextResponse.json({
            qrCode: qrCodeDataUrl,
            secret: secret.base32,
            otpauthUrl,
        });

    } catch (error: any) {
        console.error("2FA setup error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
