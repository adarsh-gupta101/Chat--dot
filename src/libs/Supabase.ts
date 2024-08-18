import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// getplans

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function allPlans() {
  return await supabase.from("plans").select("*");
}

