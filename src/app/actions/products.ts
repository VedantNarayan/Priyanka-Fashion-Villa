"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function verifyAdmin(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") throw new Error("Forbidden");
}


export async function addProduct(prevState: any, formData: FormData) {
    const supabase = await createClient();
    try {
        await verifyAdmin(supabase);
    } catch (e) {
        return { message: "Error", error: "Unauthorized" };
    }

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

    // Parse size_chart from formData
    let size_chart: any = null;
    const sizeChartStr = formData.get("size_chart") as string;
    if (sizeChartStr) {
        try { size_chart = JSON.parse(sizeChartStr); } catch (e) {}
    }

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
        size_chart,
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
    try {
        await verifyAdmin(supabase);
    } catch (e) {
        return { error: "Unauthorized" };
    }

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

    // Parse size_chart from formData
    let size_chart: any = null;
    const sizeChartStr = formData.get("size_chart") as string;
    if (sizeChartStr) {
        try { size_chart = JSON.parse(sizeChartStr); } catch (e) {}
    }

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
            size_chart,
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
    try {
        await verifyAdmin(supabase);
    } catch (e) {
        return { error: "Unauthorized" };
    }

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

export async function removeImageBackground(
    base64Image: string,
    mimeType: string
): Promise<{ base64: string; mimeType: string; success: boolean }> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY not set, skipping background removal");
            return { base64: base64Image, mimeType, success: false };
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: "Remove the background from this product photo. Return only the product item on a pure white (#FFFFFF) background. Maintain the original image quality and proportions.",
                                },
                                {
                                    inlineData: {
                                        mimeType,
                                        data: base64Image,
                                    },
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        responseModalities: ["IMAGE"],
                    },
                }),
            }
        );

        if (!response.ok) {
            console.warn(`Gemini API returned ${response.status}: ${response.statusText}`);
            return { base64: base64Image, mimeType, success: false };
        }

        const result = await response.json();

        const parts = result?.candidates?.[0]?.content?.parts;
        if (parts) {
            for (const part of parts) {
                if (part.inlineData) {
                    return {
                        base64: part.inlineData.data,
                        mimeType: part.inlineData.mimeType,
                        success: true,
                    };
                }
            }
        }

        console.warn("Gemini API response did not contain image data");
        return { base64: base64Image, mimeType, success: false };
    } catch (error) {
        console.warn("Background removal failed:", error);
        return { base64: base64Image, mimeType, success: false };
    }
}

export async function uploadProductImageWithBgRemoval(
    formData: FormData
): Promise<{ url: string | null; bgRemoved: boolean }> {
    const supabase = await createClient();
    try {
        await verifyAdmin(supabase);
    } catch (e) {
        return { url: null, bgRemoved: false };
    }

    const file = formData.get("file") as File;
    const imageIndex = formData.get("imageIndex") as string;

    if (!file || file.size === 0) return { url: null, bgRemoved: false };

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // Attempt background removal for first two images if API key is available
    if ((imageIndex === "0" || imageIndex === "1") && process.env.GEMINI_API_KEY) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString("base64");
            const fileMimeType = file.type || `image/${ext}`;

            const result = await removeImageBackground(base64, fileMimeType);

            if (result.success) {
                const processedBuffer = Buffer.from(result.base64, "base64");
                const processedExt = result.mimeType.split("/").pop() || ext;
                const processedFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${processedExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("product-images")
                    .upload(processedFileName, processedBuffer, {
                        contentType: result.mimeType,
                    });

                if (uploadError) {
                    console.error("Upload error (processed):", uploadError);
                    return { url: null, bgRemoved: false };
                }

                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from("product-images")
                    .getPublicUrl(processedFileName);

                // Log the usage to bg_removal_log table
                try {
                    await supabase.from("bg_removal_log").insert({
                        image_index: parseInt(imageIndex),
                        status: "success",
                        model_used: "gemini-2.5-flash-image",
                        input_bytes: arrayBuffer.byteLength,
                        output_bytes: processedBuffer.byteLength,
                    });
                } catch (logError) {
                    // Silently catch — table may not exist yet
                }

                return { url: publicUrl, bgRemoved: true };
            }
        } catch (error) {
            console.warn("Background removal pipeline failed, falling back to original:", error);
        }
    }

    // Fallback: upload original file directly (same as existing uploadProductImage)
    const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

    if (error) {
        console.error("Upload error:", error);
        return { url: null, bgRemoved: false };
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(fileName);

    return { url: publicUrl, bgRemoved: false };
}
