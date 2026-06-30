import ZevanaHome from "@/components/home/ZevanaHome";
import { getProducts, getAdminSettings } from "@/lib/db";

export default async function Home() {
  const products = await getProducts();
  const settings = await getAdminSettings();
  return <ZevanaHome products={products} settings={settings} />;
}
