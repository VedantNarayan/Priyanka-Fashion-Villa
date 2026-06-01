import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
    color: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    syncFromDb: () => Promise<void>;
}

const syncToSupabase = async (cartItems: CartItem[]) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.auth.updateUser({
            data: { cart: cartItems } // Store for abandoned cart recovery
        });
    }
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            
            addItem: async (newItem) => {
                const items = get().items;
                const existingItem = items.find(
                    (item) => item.productId === newItem.productId && item.size === newItem.size && item.color === newItem.color
                );
                
                let newItems;
                if (existingItem) {
                    newItems = items.map((item) =>
                        item.id === existingItem.id
                            ? { ...item, quantity: item.quantity + newItem.quantity }
                            : item
                    );
                } else {
                    newItems = [...items, { ...newItem, id: Math.random().toString(36).substring(7) }];
                }
                
                set({ items: newItems, isOpen: true });
                await syncToSupabase(newItems);
            },
            
            removeItem: async (id) => {
                const newItems = get().items.filter((i) => i.id !== id);
                set({ items: newItems });
                await syncToSupabase(newItems);
            },
            
            updateQuantity: async (id, quantity) => {
                const newItems = get().items.map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
                );
                set({ items: newItems });
                await syncToSupabase(newItems);
            },
            
            clearCart: async () => {
                set({ items: [] });
                await syncToSupabase([]);
            },
            
            syncFromDb: async () => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.user_metadata?.cart) {
                    set({ items: user.user_metadata.cart });
                }
            },
            
            toggleCart: () => set({ isOpen: !get().isOpen }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
        }),
        {
            name: 'cart-storage',
        }
    )
);
