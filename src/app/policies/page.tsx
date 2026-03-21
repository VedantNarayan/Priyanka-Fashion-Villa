export default function PoliciesPage() {
    return (
        <div className="min-h-screen bg-white text-stone-900">
            <div className="bg-black text-white py-20 text-center">
                <h1 className="font-serif text-5xl mb-3">Store Policies</h1>
                <p className="text-stone-400 text-sm tracking-wide uppercase">Transparency First</p>
            </div>

            <div className="container mx-auto px-4 max-w-3xl py-16 space-y-12">
                <section id="shipping">
                    <h2 className="font-serif text-2xl mb-4">Shipping Policy</h2>
                    <div className="prose prose-stone text-sm leading-relaxed space-y-3">
                        <p>We ship across India using trusted courier partners to ensure your order reaches you safely.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Standard delivery: 5–7 business days</li>
                            <li>Express delivery: 2–3 business days (select cities)</li>
                            <li>Free shipping on orders above ₹1,999</li>
                            <li>Flat ₹99 shipping fee for orders below ₹1,999</li>
                        </ul>
                        <p>Tracking information will be shared via email and WhatsApp once your order is shipped.</p>
                    </div>
                </section>

                <hr className="border-stone-200" />

                <section id="returns">
                    <h2 className="font-serif text-2xl mb-4">Returns & Exchanges</h2>
                    <div className="prose prose-stone text-sm leading-relaxed space-y-3">
                        <p>We want you to love what you buy. If you&apos;re not satisfied, here&apos;s our return policy:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Returns accepted within 7 days of delivery</li>
                            <li>Items must be unworn, unwashed, and with original tags</li>
                            <li>Exchanges available for size/color changes (subject to availability)</li>
                            <li>Refunds processed within 5–7 business days to original payment method</li>
                        </ul>
                        <p>To initiate a return, go to My Account → Orders → select order → Request Return.</p>
                    </div>
                </section>

                <hr className="border-stone-200" />

                <section id="privacy">
                    <h2 className="font-serif text-2xl mb-4">Privacy Policy</h2>
                    <div className="prose prose-stone text-sm leading-relaxed space-y-3">
                        <p>Your privacy matters to us. Here&apos;s how we handle your data:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>We collect only information necessary to process your orders (name, email, address, phone)</li>
                            <li>Payment information is processed securely through Razorpay — we never store card details</li>
                            <li>We do not sell, rent, or share your personal information with third parties</li>
                            <li>Cookies are used to enhance your browsing experience</li>
                            <li>You can request data deletion by contacting support@priyankafashionvilla.com</li>
                        </ul>
                    </div>
                </section>

                <hr className="border-stone-200" />

                <section id="terms">
                    <h2 className="font-serif text-2xl mb-4">Terms of Service</h2>
                    <div className="prose prose-stone text-sm leading-relaxed space-y-3">
                        <p>By using our website, you agree to the following:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>All products and prices are subject to availability</li>
                            <li>We reserve the right to cancel orders in case of pricing errors</li>
                            <li>Product images are for representation; slight variations in color/texture may occur</li>
                            <li>Accounts are personal and non-transferable</li>
                            <li>Misuse of coupon codes may result in order cancellation</li>
                        </ul>
                        <p>For any queries, contact us at support@priyankafashionvilla.com.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
