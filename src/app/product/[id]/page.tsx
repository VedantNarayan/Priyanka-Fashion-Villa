import { getProduct } from "@/lib/db";
import ProductDetail from "@/components/product/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return { title: 'Product Not Found' };
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: `${product.name} | Priyanka Fashionvilla`,
            description: product.description,
            images: [{ url: product.cardImage }],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return <ProductDetail product={product} />;
}
