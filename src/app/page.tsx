import ZevanaHome from "@/components/home/ZevanaHome";
import { getProducts } from "@/lib/db";

export default async function Home() {
  const products = await getProducts();
  return <ZevanaHome products={products} />;
}
