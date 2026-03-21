import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    productId: string
    name: string
    price: number
    image: string
    quantity: number
    size: string
    color: string
}

interface CartState {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'id'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    isOpen: boolean
    toggleCart: () => void
    openCart: () => void
    closeCart: () => void
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (newItem) => {
                const items = get().items
                const existingItem = items.find(
                    (item) => item.productId === newItem.productId && item.size === newItem.size && item.color === newItem.color
                )

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === existingItem.id
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        ),
                        isOpen: true,
                    })
                } else {
                    set({
                        items: [...items, { ...newItem, id: Math.random().toString(36).substring(7) }],
                        isOpen: true
                    })
                }
            },
            removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
            updateQuantity: (id, quantity) =>
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
                    ),
                }),
            clearCart: () => set({ items: [] }),
            toggleCart: () => set({ isOpen: !get().isOpen }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
        }),
        {
            name: 'cart-storage',
        }
    )
)
