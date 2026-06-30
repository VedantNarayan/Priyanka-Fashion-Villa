"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Script from "next/script";
import { Tag, X, MapPin } from "lucide-react";

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [address, setAddress] = useState({
        full_name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "Patna",
        state: "Bihar",
        postal_code: "",
        country: "IN",
    });

    // Coupon state
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState<any>(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");

    const supabase = createClient();
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= 1999 ? 0 : 99;
    const discount = couponApplied
        ? couponApplied.type === 'percentage'
            ? Math.round(subtotal * couponApplied.value / 100)
            : couponApplied.value
        : 0;
    const total = Math.max(0, subtotal + shipping - discount);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                setAddress(prev => ({ ...prev, full_name: user.user_metadata?.full_name || "" }));

                const { data: addrs } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('is_default', { ascending: false });

                if (addrs && addrs.length > 0) {
                    setSavedAddresses(addrs);
                    const defaultAddr = addrs.find((a: any) => a.is_default) || addrs[0];
                    setSelectedAddressId(defaultAddr.id);
                    setAddress({
                        full_name: defaultAddr.full_name || "",
                        phone: defaultAddr.phone || "",
                        line1: defaultAddr.line1 || "",
                        line2: defaultAddr.line2 || "",
                        city: defaultAddr.city || "",
                        state: defaultAddr.state || "",
                        postal_code: defaultAddr.postal_code || "",
                        country: "IN",
                    });
                }
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (items.length === 0 && !loading) {
            router.push("/");
        }
    }, [items, router, loading]);

    const selectSavedAddress = (addr: any) => {
        setSelectedAddressId(addr.id);
        setAddress({
            full_name: addr.full_name || "",
            phone: addr.phone || "",
            line1: addr.line1 || "",
            line2: addr.line2 || "",
            city: addr.city || "",
            state: addr.state || "",
            postal_code: addr.postal_code || "",
            country: "IN",
        });
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError("");

        try {
            const { validateCoupon } = await import("@/app/actions/coupons");
            const result = await validateCoupon(couponCode.trim(), subtotal);
            if (result.error) {
                setCouponError(result.error);
                setCouponApplied(null);
            } else {
                setCouponApplied(result.coupon);
                toast.success("Coupon applied!");
            }
        } catch {
            setCouponError("Failed to validate coupon");
        }
        setCouponLoading(false);
    };

    const removeCoupon = () => {
        setCouponApplied(null);
        setCouponCode("");
        setCouponError("");
    };

    const handlePayment = async () => {
        if (!address.line1 || !address.city || !address.state || !address.postal_code) {
            toast.error("Please fill in your shipping address");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    amount: subtotal + shipping,
                    shipping_address: address,
                    coupon_code: couponApplied?.code || null,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.orderId.amount,
                currency: "INR",
                name: "Priyanka Fashionvilla",
                description: "Fashion Purchase",
                order_id: data.orderId.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                db_order_id: data.dbOrderId,
                            }),
                        });

                        if (verifyRes.ok) {
                            toast.success("Payment verified! Order placed successfully.");
                            clearCart();
                            router.push("/account/orders");
                        } else {
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    } catch {
                        toast.error("Error verifying payment. Please contact support.");
                    }
                },
                prefill: {
                    name: address.full_name || user?.user_metadata?.full_name || "",
                    email: user?.email || "",
                    contact: address.phone || "",
                },
                theme: { color: "#000000" },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error: any) {
            console.error("Checkout Error:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-12 text-black">
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="font-serif text-3xl md:text-4xl mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Saved Addresses */}
                        {savedAddresses.length > 0 && (
                            <div className="bg-white p-6 rounded-sm shadow-sm">
                                <h2 className="font-serif text-xl mb-4 flex items-center gap-2"><MapPin size={18} /> Select Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {savedAddresses.map(addr => (
                                        <button
                                            key={addr.id}
                                            onClick={() => selectSavedAddress(addr)}
                                            className={`text-left p-4 border rounded-sm transition-colors ${
                                                selectedAddressId === addr.id ? 'border-black bg-stone-50' : 'border-stone-200 hover:border-stone-400'
                                            }`}
                                        >
                                            <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">{addr.label || 'Address'} {addr.is_default ? '(Default)' : ''}</p>
                                            <p className="text-sm font-medium">{addr.full_name}</p>
                                            <p className="text-xs text-stone-500 mt-1">{addr.line1}, {addr.city} {addr.postal_code}</p>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { setSelectedAddressId("new"); setAddress({ full_name: "", phone: "", line1: "", line2: "", city: "Patna", state: "Bihar", postal_code: "", country: "IN" }); }}
                                        className={`text-left p-4 border border-dashed rounded-sm transition-colors ${
                                            selectedAddressId === "new" ? 'border-black bg-stone-50' : 'border-stone-300 hover:border-stone-400'
                                        }`}
                                    >
                                        <p className="text-sm text-stone-500">+ New Address</p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Address Form */}
                        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                            <h2 className="font-serif text-xl mb-2">Shipping Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Full Name</label>
                                    <input type="text" className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black text-sm" value={address.full_name} onChange={(e) => setAddress({ ...address, full_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Phone</label>
                                    <input type="tel" className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black text-sm" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+91 9999999999" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Address Line 1</label>
                                <input type="text" className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black text-sm" placeholder="Flat, House no., Building" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Address Line 2</label>
                                <input type="text" className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black text-sm" placeholder="Area, Colony" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">City (Locked)</label>
                                    <input type="text" readOnly className="w-full bg-stone-100 border border-stone-200 p-3 outline-none text-stone-500 text-sm cursor-not-allowed" value={address.city} />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">State (Locked)</label>
                                    <input type="text" readOnly className="w-full bg-stone-100 border border-stone-200 p-3 outline-none text-stone-500 text-sm cursor-not-allowed" value={address.state} />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">PIN Code</label>
                                    <input type="text" className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black text-sm" value={address.postal_code} onChange={(e) => setAddress({ ...address, postal_code: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24">
                            <h2 className="font-serif text-xl mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-14 h-18 bg-stone-50 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium leading-tight">{item.name}</p>
                                            <p className="text-xs text-stone-500 mt-0.5">{item.size} / {item.color}</p>
                                        </div>
                                        <div className="text-sm font-medium">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon */}
                            <div className="border-t border-stone-100 pt-4 mb-4">
                                {couponApplied ? (
                                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-sm">
                                        <div className="flex items-center gap-2">
                                            <Tag size={14} className="text-green-600" />
                                            <span className="text-sm font-medium text-green-700">{couponApplied.code}</span>
                                            <span className="text-xs text-green-600">(-₹{discount})</span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-stone-400 hover:text-red-500">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Coupon code"
                                            className="flex-1 border border-stone-200 p-2 text-sm uppercase focus:outline-none focus:border-black"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            disabled={couponLoading}
                                            className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider hover:bg-stone-800 disabled:opacity-50"
                                        >
                                            {couponLoading ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                            </div>

                            <div className="border-t border-stone-100 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-stone-500 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-stone-500 text-sm">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 text-sm">
                                        <span>Discount</span>
                                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-black font-medium text-lg pt-2">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full bg-black text-white h-14 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : `Pay ₹${total.toLocaleString('en-IN')}`}
                            </button>

                            {subtotal < 1999 && (
                                <p className="text-xs text-stone-400 mt-3 text-center">
                                    Add ₹{(1999 - subtotal).toLocaleString('en-IN')} more for free shipping!
                                </p>
                            )}

                            <p className="text-xs text-stone-400 mt-2 text-center">
                                Secure payments powered by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
