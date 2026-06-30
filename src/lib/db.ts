import { createClient } from "@/lib/supabase/server";
import { products as mockProducts } from "@/lib/data";
import { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('products').select('*');

        if (error || !data || data.length === 0) {
            console.log("Using mock products due to DB empty/error");
            return mockProducts;
        }

        return data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            rating: p.rating || 5.0, // Default rating
            cardImage: p.images?.[0] || p.image_url || "/images/placeholder.png", // Fallback
            modelImage: p.images?.[1] || p.images?.[0] || p.image_url || "/images/placeholder.png",
            category: p.category,
            description: p.description,
            sizes: p.sizes || ["S", "M", "L"],
            colors: p.colors || ["Black"]
        }));

    } catch (e) {
        console.error("Failed to fetch products", e);
        return mockProducts;
    }
}

export async function getProduct(id: string): Promise<Product | undefined> {
    const supabase = await createClient();
    try {
        // First try to find in mock (for integer IDs that might be mocks)
        const mock = mockProducts.find(p => p.id === id);
        // But we want DB priority? Mocks have simple IDs constants. DB UUIDs.
        // Let's try DB first.

        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

        if (error || !data) {
            if (mock) return mock;
            throw error;
        }

        return {
            id: data.id,
            name: data.name,
            price: data.price,
            rating: data.rating || 5.0,
            cardImage: data.images?.[0] || data.image_url || "/images/placeholder.png",
            modelImage: data.images?.[1] || data.images?.[0] || data.image_url || "/images/placeholder.png",
            category: data.category,
            description: data.description,
            sizes: data.sizes || ["S", "M", "L"],
            colors: data.colors || ["Black"]
        };

    } catch (e) {
        // If fetch failed, try mock
        return mockProducts.find(p => p.id === id);
    }
}

export async function getAdminSettings(): Promise<Record<string, any>> {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('admin_settings').select('*');
        if (error || !data) return {};
        const map: Record<string, any> = {};
        data.forEach(s => {
            try {
                map[s.key] = typeof s.value === 'string' ? JSON.parse(s.value) : s.value;
            } catch (e) {
                map[s.key] = s.value;
            }
        });
        return map;
    } catch (e) {
        console.error("Failed to fetch settings", e);
        return {};
    }
}
