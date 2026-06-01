"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
    const supabase = await createClient();

    const name = (formData.get("name") as string).trim();
    if (!name) return { error: "Category name is required" };

    const { error } = await supabase.from("categories").insert({
        name,
    });

    if (error) {
        console.error("Error creating category:", error);
        return { error: error.message || "Failed to create category" };
    }

    revalidatePath("/admin/categories");
    return { success: true };
}

export async function updateCategory(categoryId: string, formData: FormData) {
    const supabase = await createClient();

    const name = (formData.get("name") as string).trim();
    if (!name) return { error: "Category name is required" };

    const { error } = await supabase
        .from("categories")
        .update({ name })
        .eq("id", categoryId);

    if (error) {
        console.error("Error updating category:", error);
        return { error: error.message || "Failed to update category" };
    }

    revalidatePath("/admin/categories");
    return { success: true };
}

export async function deleteCategory(categoryId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

    if (error) {
        console.error("Error deleting category:", error);
        return { error: error.message || "Failed to delete category" };
    }

    revalidatePath("/admin/categories");
    return { success: true };
}
