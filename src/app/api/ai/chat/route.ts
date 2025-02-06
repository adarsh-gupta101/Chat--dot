import { supabase } from "@/libs/Supabase";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    // console.log({user})
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, role, conversationId } = await req.json();

    // First, try to get existing conversation
    const { data: existingConversation, error: fetchError } = await supabase
      .from("chat_history")
      .select("messages")
      .eq("id", conversationId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found"
      throw fetchError;
    }

    const newMessage = {
      role,
      content: message,
      timestamp: new Date().toISOString(),
    };

    // const { error } = await supabase
    //   .from("chat_history")
    //   .insert({
    //     user_id: user.id,
    //     message,
    //     role,
    //     conversation_id: conversationId
    //   });

    if (!existingConversation) {
      // Create new conversation
      const { error } = await supabase.from("chat_history").insert({
        id: conversationId,
        user_id: user.id,
        messages: [newMessage],
        message: message,
        role: newMessage.role,
      });

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("chat_history")
        .update({
          messages: [...existingConversation.messages, newMessage],//
        })
        .eq("id", conversationId);

      if (error){
        console.log({ error });
        throw error;
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing chat message:", error);
    return NextResponse.json(
      { error: "Failed to store message" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    const query = supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", user.id);

    if (conversationId) {
      query.eq("conversation_id", conversationId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: true,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
