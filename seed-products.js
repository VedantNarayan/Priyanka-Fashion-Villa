const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Make sure to run with --env-file=.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    {
        name: "Noir Enchanté Gown",
        price: 120,
        category: "Evening Wear",
        description: "A stunning black gown perfect for any elegant occasion.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black"],
        images: ["/images/products/black-gown.png", "/images/models/black-gown.png"],
        stock_status: "in_stock",
        stock_quantity: 10
    },
    {
        name: "Midnight Silk Slip",
        price: 180,
        category: "Cocktail",
        description: "Pure silk slip dress with delicate lace detailing.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Midnight Blue"],
        images: ["/images/products/blue-slip.png", "/images/models/blue-slip.png"],
        stock_status: "in_stock",
        stock_quantity: 10
    },
    {
        name: "Velvet Obsidian",
        price: 250,
        category: "Gala",
        description: "Luxurious velvet gown with deep plunge neckline.",
        sizes: ["S", "M", "L"],
        colors: ["Black"],
        images: ["/images/products/velvet-obsidian.png", "/images/models/velvet-obsidian.png"],
        stock_status: "low_stock",
        stock_quantity: 3
    },
    {
        name: "Ethereal Pleat Maxi",
        price: 160,
        category: "Prom",
        description: "Flowing pleated maxi dress in soft cream.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Cream"],
        images: ["/images/products/cream-pleat.png", "/images/models/cream-pleat.png"],
        stock_status: "in_stock",
        stock_quantity: 10
    },
    {
        name: "Starlight Sequin Mini",
        price: 140,
        category: "Party",
        description: "Dazzling sequin mini dress that catches the light.",
        sizes: ["XS", "S", "M"],
        colors: ["Silver"],
        images: ["/images/products/silver-sequin.png", "/images/models/silver-sequin.png"],
        stock_status: "in_stock",
        stock_quantity: 10
    }
];

async function seedProducts() {
  console.log('Seeding products to Supabase...');
  for (const product of products) {
    const { data: existing, error: errCheck } = await supabase
      .from('products')
      .select('id')
      .eq('name', product.name)
      .single();

    if (existing) {
        console.log(`Product already exists: ${product.name}`);
        continue;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();

    if (error) {
      console.error(`Error inserting ${product.name}:`, error);
    } else {
      console.log(`Successfully added: ${product.name}`);
    }
  }
  console.log('Done.');
}

seedProducts();
