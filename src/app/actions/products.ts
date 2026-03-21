"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProduct(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const image_url = formData.get("image_url") as string;
    const imagesStr = formData.get("images") as string;
    let images: string[] = [];
    if (imagesStr) {
        try { images = JSON.parse(imagesStr); } catch (e) {}
    } else if (image_url) {
        images = [image_url];
    }

    const stock = parseInt(formData.get("stock") as string);
    const sizes = (formData.get("sizes") as string).split(",").map(s => s.trim()).filter(Boolean);
    const colors = (formData.get("colors") as string).split(",").map(c => c.trim()).filter(Boolean);

    const { error } = await supabase.from("products").insert({
        name,
        description,
        price,
        category,
        images,
        image_url: images[0] || image_url,
        stock,
        sizes,
        colors,
        is_active: true,
    });

    if (error) {
        console.error("Error creating product:", error);
        return { message: "Error", error: "Failed to create product" };
    }

    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const image_url = formData.get("image_url") as string;
    const imagesStr = formData.get("images") as string;
    let images: string[] = [];
    if (imagesStr) {
        try { images = JSON.parse(imagesStr); } catch (e) {}
    } else if (image_url) {
        images = [image_url];
    }

    const stock = parseInt(formData.get("stock") as string);
    const sizes = (formData.get("sizes") as string).split(",").map(s => s.trim()).filter(Boolean);
    const colors = (formData.get("colors") as string).split(",").map(c => c.trim()).filter(Boolean);

    const { error } = await supabase
        .from("products")
        .update({
            name,
            description,
            price,
            category,
            images,
            image_url: images[0] || image_url,
            stock,
            sizes,
            colors,
        })
        .eq("id", productId);

    if (error) {
        console.error("Error updating product:", error);
        return { error: "Failed to update product" };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient();

    // Soft delete — set is_active to false
    const { error } = await supabase
        .from("products")
        .update({ is_active: false })
        .eq("id", productId);

    if (error) {
        console.error("Error deleting product:", error);
        return { error: "Failed to delete product" };
    }

    revalidatePath("/admin/products");
    return { success: true };
}

export async function uploadProductImage(formData: FormData): Promise<string | null> {
    const supabase = await createClient();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) return null;

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

    if (error) {
        console.error("Upload error:", error);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

    return publicUrl;
}
