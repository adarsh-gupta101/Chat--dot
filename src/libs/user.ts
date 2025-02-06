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

  if (!data || !data.credits || data.credits <= 0) {
    return { success: false, message: "Insufficient credits", credits: 0 };
  }

  return { success: true, credits: data.credits };
}

export async function deductCredit(user_id: string, amount: number) {
  let oldCredits = await getUserCredits(user_id);
  if (!oldCredits.success) {
    return oldCredits; // Return the error response from getUserCredits
  }
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


export async function addUserGeneratedImages(url:string, user_id:string) {
  const { data, error } = await supabase
    .from("user_images")
    .insert({
      user_id,
      image_url: url,
      created_at: new Date().toISOString(),
    });
    
    if (error) {
      console.error("Error adding user generated image:", error);
      throw error;
    }
    
    return data;
}


export async function getUserGeneratedImages(user_id: string) {
  const { data, error } = await supabase
    .from("user_images")
    .select("image_url")
    .eq("user_id", user_id);
    
    if (error) {
      console.error("Error getting user generated images:", error);
      throw error;
    }
    
    return data;
}

export type ChatMessage = {
  id: string
  user_id: string
  message: string
  role: 'user' | 'assistant'
  created_at: string
  conversation_id: string
}

export async function storeChatMessage({
  userId,
  message,
  role,
  conversationId
}: {
  userId: string;
  message: string;
  role: 'user' | 'assistant';
  conversationId?: string;
}) {
  const { error } = await supabase
    .from('chat_history')
    .insert({
      user_id: userId,
      message,
      role,
      conversation_id: conversationId
    });

  if (error) throw error;
}

export async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ChatMessage[];
}

export async function getConversation(conversationId: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as ChatMessage[];
}