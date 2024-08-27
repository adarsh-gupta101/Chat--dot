import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { upsertUser } from "@/libs/user";
import { supabase } from "@/libs/Supabase";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id") as string,
    "svix-timestamp": headerPayload.get("svix-timestamp") as string,
    "svix-signature": headerPayload.get("svix-signature") as string,
  };


  // If there are no headers, error out
  if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });

  }


  const body = JSON.stringify(await req.json());
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;


  // Verify the payload with the headers
  try {
       evt = wh.verify(body, svixHeaders) as WebhookEvent;

  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  // Handle the event

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const username = `${first_name || ''} ${last_name || ''}`.trim();


    if (id && email) {
      try {
        await upsertUser(id, email, first_name, last_name);
        // add credits

        if (evt.type === "user.created") {
          await supabase.from("credits").upsert(
            {
              user_id: id,
              credits: 200,
            },
            {
              onConflict: "user_id",
            }
          );
        }

        let username = first_name + " " + last_name;
        // if (evt.type !== "user.updated") {
        //   sendSignUpEmail(email, username);
        // }
        return NextResponse.json(
          { message: "User updated in Supabase" },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error upserting user to Supabase:", error);
        return NextResponse.json(
          { error: "Error upserting user to Supabase" },
          { status: 500 }
        );
      }
    } else {
      console.error("Missing required user data");
      return NextResponse.json(
        { error: "Missing required user data" },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
