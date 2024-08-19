import { Webhook } from "svix";
import { headers } from "next/headers";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { upsertUser } from "@/libs/user";
import { sendSignUpEmail } from "@/libs/SignUpEmail";
import { supabase } from "@/libs/Supabase";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occured", {
      status: 400,
    });
  }

  // Handle the event

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;

    console.log("User data:", id, email, first_name, last_name);
    if (id && email) {
      try {
        await upsertUser(id, email, first_name, last_name);
        // add credits
        await supabase.from("credits").insert({
          user_id:id,
          credits:0
        })
        let username = first_name + " " + last_name;
        if (evt.type !== "user.updated") {
          sendSignUpEmail(email, username);
        }
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
