import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Protect Admin Routes — require admin role + 2FA
    if (request.nextUrl.pathname.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Check admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, two_factor_enabled')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Check 2FA (skip if on 2FA pages themselves)
        const is2FAPage = request.nextUrl.pathname.startsWith("/admin/verify-2fa") || 
                          request.nextUrl.pathname.startsWith("/admin/setup-2fa");
        
        if (profile.two_factor_enabled && !is2FAPage) {
            const twoFactorVerified = request.cookies.get('2fa_verified')?.value;
            if (twoFactorVerified !== 'true') {
                return NextResponse.redirect(new URL("/admin/verify-2fa", request.url));
            }
        }

        // Pass authentication/authorization headers instantly downstream to Layout
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-admin-email", user.email || "");
        requestHeaders.set("x-admin-2fa-enabled", String(profile.two_factor_enabled));
        requestHeaders.set("x-admin-id", user.id);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    // Protect Checkout/Account
    if (request.nextUrl.pathname.startsWith("/account") || request.nextUrl.pathname.startsWith("/checkout")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login?next=" + request.nextUrl.pathname, request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|images|api/whatsapp).*)",
    ],
};
