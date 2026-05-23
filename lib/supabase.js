import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("=== SUPABASE DEBUG ===");
console.log("URL:", supabaseUrl);
console.log("Key exists:", !!supabaseAnonKey);
console.log(
  "Key preview:",
  supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + "..." : "MISSING",
);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing environment variables!");
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection immediately
supabase
  .from("users")
  .select("count", { count: "exact", head: true })
  .then((result) => {
    console.log("✅ Supabase connection test:", result);
    if (result.error) {
      console.error("❌ Connection error:", result.error);
    }
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
  });
