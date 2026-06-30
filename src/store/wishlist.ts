import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export interface WishlistItem {
    id: string; // Product ID
    name: string;
    price: number;
    image: string;
}

interface WishlistState {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => Promise<boolean>;
    removeItem: (id: string) => Promise<void>;
    isInWishlist: (id: string) => boolean;
    syncFromDb: () => Promise<void>;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: async (item) => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                const items = get().items;
                if (!items.find((i) => i.id === item.id)) {
                    const newItems = [...items, item];
                    set({ items: newItems });
                    
                    // Sync to supabase user_metadata if user is logged in
                    if (user) {
                        await supabase.auth.updateUser({
                            data: { wishlist: newItems }
                        });
                    }
                    toast.success("Added to Wishlist");
                    return true;
                }
                return false;
            },
            removeItem: async (id) => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                const newItems = get().items.filter((i) => i.id !== id);
                set({ items: newItems });
                
                if (user) {
                    // Sync to supabase
                    await supabase.auth.updateUser({
                        data: { wishlist: newItems }
                    });
                }
            },
            isInWishlist: (id) => !!get().items.find((i) => i.id === id),
            syncFromDb: async () => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user && user.user_metadata?.wishlist) {
                    set({ items: user.user_metadata.wishlist });
                }
            },
            clearWishlist: () => set({ items: [] })
        }),
        {
            name: 'wishlist-storage',
            skipHydration: true, // We will manually hydrate on the client
        }
    )
)
