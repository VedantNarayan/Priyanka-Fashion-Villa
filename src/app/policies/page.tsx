import { getAdminSettings } from "@/lib/db";

export default async function PoliciesPage() {
    const settings = await getAdminSettings();
    const cms = settings?.policies_cms || {};

    const shippingPolicy = cms.shipping_policy || `We ship across India using trusted courier partners to ensure your order reaches you safely.
- Standard delivery: 5–7 business days
- Express delivery: 2–3 business days (select cities)
- Free shipping on orders above ₹1,999
- Flat ₹99 shipping fee for orders below ₹1,999

Tracking information will be shared via email and WhatsApp once your order is shipped.`;

    const returnsPolicy = cms.returns_policy || `We want you to love what you buy. If you're not satisfied, here's our return policy:
- Returns accepted within 7 days of delivery
- Items must be unworn, unwashed, and with original tags
- Exchanges available for size/color changes (subject to availability)
- Refunds processed within 5–7 business days to original payment method

To initiate a return, go to My Account → Orders → select order → Request Return.`;

    const privacyPolicy = cms.privacy_policy || `Your privacy matters to us. Here's how we handle your data:
- We collect only information necessary to process your orders (name, email, address, phone)
- Payment information is processed securely through Razorpay — we never store card details
- We do not sell, rent, or share your personal information with third parties
- Cookies are used to enhance your browsing experience
- You can request data deletion by contacting support@priyankafashionvilla.com`;

    const termsOfService = cms.terms_of_service || `By using our website, you agree to the following:
- All products and prices are subject to availability
- We reserve the right to cancel orders in case of pricing errors
- Product images are for representation; slight variations in color/texture may occur
- Accounts are personal and non-transferable
- Misuse of coupon codes may result in order cancellation

For any queries, contact us at support@priyankafashionvilla.com.`;

    return (
        <div className="min-h-screen bg-white text-stone-900 pt-20">
            <div className="bg-black text-white py-20 text-center">
                <h1 className="font-serif text-5xl mb-3">Store Policies</h1>
                <p className="text-stone-400 text-sm tracking-wide uppercase">Transparency First</p>
            </div>

            <div className="container mx-auto px-4 max-w-3xl py-16 space-y-12">
                <section id="shipping">
                    <h2 className="font-serif text-2xl mb-4 text-burgundy uppercase tracking-wider">Shipping Policy</h2>
                    <div className="text-sm leading-relaxed space-y-3 whitespace-pre-line text-stone-600 font-serif italic">
                        {shippingPolicy}
                    </div>
                </section>

                <hr className="border-stone-200" />

                <section id="returns">
                    <h2 className="font-serif text-2xl mb-4 text-burgundy uppercase tracking-wider">Returns & Exchanges</h2>
                    <div className="text-sm leading-relaxed space-y-3 whitespace-pre-line text-stone-600 font-serif italic">
                        {returnsPolicy}
                    </div>
                </section>

                <hr className="border-stone-200" />

                <section id="privacy">
                    <h2 className="font-serif text-2xl mb-4 text-burgundy uppercase tracking-wider">Privacy Policy</h2>
                    <div className="text-sm leading-relaxed space-y-3 whitespace-pre-line text-stone-600 font-serif italic">
                        {privacyPolicy}
                    </div>
                </section>

                <hr className="border-stone-200" />

                <section id="terms">
                    <h2 className="font-serif text-2xl mb-4 text-burgundy uppercase tracking-wider">Terms of Service</h2>
                    <div className="text-sm leading-relaxed space-y-3 whitespace-pre-line text-stone-600 font-serif italic">
                        {termsOfService}
                    </div>
                </section>
            </div>
        </div>
    );
}
