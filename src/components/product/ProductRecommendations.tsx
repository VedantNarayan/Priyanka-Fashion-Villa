import { getProducts } from "@/lib/db";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  currentProductId: string;
  category: string;
}

export default async function ProductRecommendations({ currentProductId, category }: Props) {
  const allProducts = await getProducts();
  // Filter out the current product and prioritize same category
  let filtered = allProducts.filter((p: Product) => p.id !== currentProductId);
  
  const sameCategory = filtered.filter((p: Product) => p.category === category);
  const otherCategory = filtered.filter((p: Product) => p.category !== category);
  
  // Combine: Same category first, then fill with others up to 4 items
  const recommendations = [...sameCategory, ...otherCategory].slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-20 py-16 border-t border-stone-200">
      <h3 className="text-xl font-medium text-stone-900 mb-8 font-serif">Complete The Look</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <Link key={product.id} href={`/shop/product/${product.id}`} className="group block">
            <div className="aspect-[3/4] relative bg-stone-100 rounded-sm overflow-hidden mb-3">
              <Image
                src={product.cardImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h4 className="text-sm font-medium text-stone-900 uppercase tracking-wider">{product.name}</h4>
            <p className="text-sm text-stone-500 mt-1">₹{product.price.toLocaleString("en-IN")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
