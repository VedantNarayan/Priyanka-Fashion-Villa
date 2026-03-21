export interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    cardImage: string;
    modelImage: string;
    category: string;
    description: string;
    sizes: string[];
    colors: string[];
    stock?: number;
    is_active?: boolean;
    review_count?: number;
    image_url?: string;
    images?: string[];
}

export type Category = "Evening Wear" | "Cocktail" | "Gala" | "Prom" | "Party" | "Casual";

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    role: 'customer' | 'admin';
    two_factor_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface Address {
    id: string;
    user_id: string;
    label: string;
    full_name: string;
    phone: string | null;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: OrderStatus;
    items: any;
    shipping_address: any;
    payment_id: string | null;
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    razorpay_signature: string | null;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    tracking_number: string | null;
    notes: string | null;
    coupon_code: string | null;
    discount_amount: number;
    created_at: string;
    // Joined
    profiles?: Pick<Profile, 'email' | 'full_name' | 'phone'>;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    name: string;
    price: number;
    quantity: number;
    size: string | null;
    color: string | null;
    image: string | null;
}

export interface ReturnRequest {
    id: string;
    order_id: string;
    user_id: string;
    type: 'return' | 'exchange';
    reason: string;
    status: ReturnStatus;
    admin_notes: string | null;
    refund_amount: number | null;
    created_at: string;
    updated_at: string;
    // Joined
    orders?: Pick<Order, 'id' | 'total_amount' | 'created_at'>;
    profiles?: Pick<Profile, 'email' | 'full_name'>;
}

export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'picked_up' | 'refunded' | 'exchanged';

export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    title: string | null;
    body: string | null;
    is_verified: boolean;
    created_at: string;
    // Joined
    profiles?: Pick<Profile, 'full_name' | 'avatar_url'>;
}

export interface Coupon {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_order_amount: number;
    max_uses: number | null;
    used_count: number;
    is_active: boolean;
    expires_at: string | null;
    created_at: string;
}

export interface AdminSetting {
    key: string;
    value: any;
    updated_at: string;
}
