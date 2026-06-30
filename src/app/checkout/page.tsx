"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Script from "next/script";
import { Tag, X, MapPin, ShieldCheck } from "lucide-react";

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
        <div className="min-h-screen bg-alabaster pt-28 pb-20 text-obsidian">
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <span className="text-gold-zari text-xs uppercase tracking-[0.25em] block mb-2 font-semibold">Atelier Secure Gateway</span>
                    <h1 className="font-serif text-3xl md:text-4xl uppercase tracking-widest text-obsidian">Checkout</h1>
                    <div className="w-12 h-[1px] bg-gold-zari mx-auto mt-3"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Saved Addresses */}
                        {savedAddresses.length > 0 && (
                            <div className="bg-silk-ivory p-6 md:p-8 border border-gold-zari/15 shadow-sm text-left">
                                <h2 className="font-serif text-lg uppercase tracking-wider mb-5 flex items-center gap-2 text-obsidian">
                                    <MapPin size={16} className="text-gold-zari" /> Select Delivery Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedAddresses.map(addr => (
                                        <button
                                            key={addr.id}
                                            onClick={() => selectSavedAddress(addr)}
                                            className={`text-left p-4 border rounded-none transition-all duration-300 ${
                                                selectedAddressId === addr.id 
                                                    ? 'border-burgundy bg-alabaster shadow-inner' 
                                                    : 'border-gold-zari/20 bg-silk-ivory hover:border-gold-zari/50'
                                            }`}
                                        >
                                            <p className="text-[9px] uppercase tracking-widest text-gold-zari mb-1 font-semibold">
                                                {addr.label || 'Address'} {addr.is_default ? '(Default)' : ''}
                                            </p>
                                            <p className="text-sm font-semibold text-obsidian">{addr.full_name}</p>
                                            <p className="text-xs text-stone-500 mt-1 leading-relaxed">{addr.line1}, {addr.city} {addr.postal_code}</p>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { 
                                            setSelectedAddressId("new"); 
                                            setAddress({ full_name: "", phone: "", line1: "", line2: "", city: "Patna", state: "Bihar", postal_code: "", country: "IN" }); 
                                        }}
                                        className={`text-left p-4 border border-dashed rounded-none transition-colors ${
                                            selectedAddressId === "new" ? 'border-burgundy bg-alabaster' : 'border-gold-zari/20 bg-silk-ivory hover:border-gold-zari/50'
                                        }`}
                                    >
                                        <p className="text-xs text-gold-zari uppercase tracking-wider font-semibold">+ New Address</p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Address Form */}
                        <div className="bg-silk-ivory p-6 md:p-8 border border-gold-zari/15 shadow-sm space-y-6 text-left">
                            <h2 className="font-serif text-lg uppercase tracking-wider mb-2 text-obsidian">Shipping Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-gold-zari font-semibold mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-transparent border-b border-gold-zari/30 py-2.5 outline-none focus:border-burgundy text-sm text-obsidian transition-colors placeholder:text-rose-ash/30" 
                                        value={address.full_name} 
                                        onChange={(e) => setAddress({ ...address, full_name: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-gold-zari font-semibold mb-1">Phone</label>
                                    <input 
                                        type="tel" 
                                        className="w-full bg-transparent border-b border-gold-zari/30 py-2.5 outline-none focus:border-burgundy text-sm text-obsidian transition-colors placeholder:text-rose-ash/30" 
                                        value={address.phone} 
                                        onChange={(e) => setAddress({ ...address, phone: e.target.value })} 
                                        placeholder="+91 99999-99999" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gold-zari font-semibold mb-1">Address Line 1</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-transparent border-b border-gold-zari/30 py-2.5 outline-none focus:border-burgundy text-sm text-obsidian transition-colors placeholder:text-rose-ash/30" 
                                    placeholder="Flat, House no., Building" 
                                    value={address.line1} 
                                    onChange={(e) => setAddress({ ...address, line1: e.target.value })} 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gold-zari font-semibold mb-1">Address Line 2</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-transparent border-b border-gold-zari/30 py-2.5 outline-none focus:border-burgundy text-sm text-obsidian transition-colors placeholder:text-rose-ash/30" 
                                    placeholder="Area, Colony, Landmark" 
                                    value={address.line2} 
                                    onChange={(e) => setAddress({ ...address, line2: e.target.value })} 
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-1">City (Locked)</label>
                                    <input type="text" readOnly className="w-full bg-transparent border-b border-gold-zari/10 py-2.5 outline-none text-stone-400 text-sm cursor-not-allowed" value={address.city} />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-1">State (Locked)</label>
                                    <input type="text" readOnly className="w-full bg-transparent border-b border-gold-zari/10 py-2.5 outline-none text-stone-400 text-sm cursor-not-allowed" value={address.state} />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-gold-zari font-semibold mb-1">PIN Code</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-transparent border-b border-gold-zari/30 py-2.5 outline-none focus:border-burgundy text-sm text-obsidian transition-colors placeholder:text-rose-ash/30" 
                                        value={address.postal_code} 
                                        onChange={(e) => setAddress({ ...address, postal_code: e.target.value })} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 text-left">
                        <div className="bg-silk-ivory p-6 md:p-8 border border-gold-zari/15 shadow-sm sticky top-24">
                            <h2 className="font-serif text-lg uppercase tracking-wider mb-6 text-obsidian">Order Summary</h2>
                            <div className="space-y-5 mb-6 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-2 border border-gold-zari/5 bg-alabaster/40">
                                        <div className="relative w-14 h-18 bg-neutral-100 flex-shrink-0 border border-gold-zari/10">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-burgundy text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-serif font-semibold text-obsidian line-clamp-1">{item.name}</p>
                                            <p className="text-[9px] uppercase tracking-widest text-gold-zari mt-0.5">{item.size} / {item.color}</p>
                                        </div>
                                        <div className="text-xs font-serif font-bold text-rose-ash">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon */}
                            <div className="border-t border-gold-zari/15 pt-5 mb-5">
                                {couponApplied ? (
                                    <div className="flex items-center justify-between bg-gold-zari/10 p-3 border border-gold-zari/35">
                                        <div className="flex items-center gap-2">
                                            <Tag size={12} className="text-burgundy" />
                                            <span className="text-xs uppercase tracking-widest font-bold text-burgundy">{couponApplied.code}</span>
                                            <span className="text-[10px] text-burgundy font-serif font-semibold">(-₹{discount})</span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-stone-400 hover:text-burgundy">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter Coupon code"
                                            className="flex-1 bg-transparent border-b border-gold-zari/30 p-2 text-xs uppercase tracking-widest focus:outline-none focus:border-burgundy text-obsidian placeholder:text-rose-ash/30"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            disabled={couponLoading}
                                            className="px-4 py-2 bg-burgundy text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-burgundy-soft disabled:opacity-50 transition-colors"
                                        >
                                            {couponLoading ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-[10px] text-burgundy font-semibold mt-1.5">{couponError}</p>}
                            </div>

                            <div className="border-t border-gold-zari/15 pt-5 space-y-3 mb-6">
                                <div className="flex justify-between text-rose-ash/70 text-xs font-semibold uppercase tracking-wider">
                                    <span>Subtotal</span>
                                    <span className="font-serif">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-rose-ash/70 text-xs font-semibold uppercase tracking-wider">
                                    <span>Shipping</span>
                                    <span className="font-serif">{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-burgundy text-xs font-semibold uppercase tracking-wider">
                                        <span>Atelier Discount</span>
                                        <span className="font-serif">-₹{discount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-obsidian font-serif font-bold text-base pt-2 border-t border-gold-zari/10">
                                    <span>Total Amount</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full bg-burgundy text-white h-14 uppercase tracking-widest text-xs font-semibold hover:bg-burgundy-soft transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-burgundy shadow-sm"
                            >
                                {loading ? "Processing..." : `Securely Pay ₹${total.toLocaleString('en-IN')}`}
                            </button>

                            {subtotal < 1999 && (
                                <p className="text-[10px] text-gold-zari mt-4 text-center font-serif italic">
                                    Add ₹{(1999 - subtotal).toLocaleString('en-IN')} more for complimentary shipping!
                                </p>
                            )}

                            <p className="text-[9px] text-stone-400 mt-3 text-center uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
                                <ShieldCheck size={12} className="text-gold-zari" /> Secure payments powered by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
