import { getProduct } from "@/lib/db";
import ProductDetail from "@/components/product/ProductDetail";
import ProductReviews from "@/components/product/ProductReviews";
import ProductRecommendations from "@/components/product/ProductRecommendations";
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

export const revalidate = 3600;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: [product.cardImage, product.modelImage, ...(product.images || [])].filter(Boolean),
        description: product.description,
        sku: product.id,
        offers: {
            '@type': 'Offer',
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://priyanka-fashionvilla.com'}/product/${product.id}`,
            priceCurrency: 'INR',
            price: product.price,
            itemCondition: 'https://schema.org/NewCondition',
            availability: (product.stock ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-white text-black min-h-screen">
                <ProductDetail product={product} />
                <div className="container mx-auto px-4 pb-16">
                    <ProductReviews productId={product.id} />
                    <ProductRecommendations currentProductId={product.id} category={product.category} />
                </div>
            </div>
        </>
    );
}
