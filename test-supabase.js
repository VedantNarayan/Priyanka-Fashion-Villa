require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase
        .from("order_items")
        .select(`
            id,
            orders!inner(user_id, status)
        `)
        .eq("product_id", "some-uuid")
        .eq("orders.user_id", "some-uuid")
        .in("orders.status", ["delivered"]);
    console.log({data, error});
}
test();
