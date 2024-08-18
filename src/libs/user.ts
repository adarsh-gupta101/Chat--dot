import { supabase } from "./Supabase";

export async function upsertUser(
  id: string,
  email: string,
  firstName: string | null,
  lastName: string | null
) {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        user_id: id,
        email,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select();

  if (error) {
    console.error("Error upserting user:", error);
    throw error;
  }

  return data;
}

export async function getUserCredits(user_id: string) {
  const { data, error } = await supabase
    .from("credits")
    .select("credits")
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("Error getting user credits:", error);
    throw error;
  }

  if (!data || data.credits <= 0) {
    // User has no credits
    return { success: false, message: "Insufficient credits" ,credits:data.credits};
  }

  return { success: true, credits: data.credits };
}

export async function deductCredit(user_id: string, amount: number) {
  let oldCredits = await getUserCredits(user_id);
  console.log({amount,old:oldCredits?.credits})
  console.log({oldCredits: oldCredits, amount})
  const { data, error } = await supabase
    .from("credits")
    .update({ credits: Number(oldCredits.credits) - amount })
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("Error deducting credits:", error);
    throw error;
  }

  return { success: true, message: "Credit used successfully" };
}
