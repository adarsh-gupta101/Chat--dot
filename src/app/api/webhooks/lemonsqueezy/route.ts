import crypto from "node:crypto";
import { lemonSqueezySetup, listWebhooks } from "@lemonsqueezy/lemonsqueezy.js";
import { processWebhookEvent, storeWebhookEvent } from "@/libs/lemonsqueezy";
import { auth, currentUser } from "@clerk/nextjs/server";


function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function webhookHasMeta(obj: unknown): obj is {
  meta: {
    event_name: string;
    custom_data: {
      user_id: string;
    };
  };
} {
  if (
    isObject(obj) &&
    isObject(obj.meta) &&
    typeof obj.meta.event_name === "string" &&
    isObject(obj.meta.custom_data) &&
    typeof obj.meta.custom_data.user_id === "string"
  ) {
    return true;
  }
  return false;
}

export async function POST(request: Request) {
  try {
    if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      return new Response("Lemon Squeezy Webhook Secret not set in .env", {
        status: 400,
      });
    }
  } catch (error) {
    console.log(error);
  }

  console.log("Request received");

  // First, make sure the request is from Lemon Squeezy.
  const rawBody = await request.text();
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET as string;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(
    request.headers.get("X-Signature") || "",
    "utf8"
  );

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error("Invalid signature.");
  }
  console.log("Signature verified");

  const data = JSON.parse(rawBody) as unknown;

  console.log(data)

  if (webhookHasMeta(data)) {
    const webhookEventId = await storeWebhookEvent(data.meta.event_name, data);

    console.log("Webhook event stored", webhookEventId);

    // Call processWebhookEvent directly and await its completion
    try {
      await processWebhookEvent(webhookEventId);
      console.log("Webhook event processed successfully");
    } catch (error) {
      console.error("Error processing webhook event:", error);
      // Handle the error appropriately (e.g., log, send error response)
      return new Response("Error processing webhook event", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  }

  console.log("Data invalid");

  return new Response("Data invalid", { status: 400 });
}

const configureLemonSqueezy = lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY,
  onError(error) {
    console.log(error);
  },
});

const allWebhooks = await listWebhooks({
  filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
});

export async function GET(request: Request) {
  let user=await currentUser()??""
  console.log(user)
  return new Response(JSON.stringify(user), { status: 201 });
  return new Response(JSON.stringify(allWebhooks), { status: 200 });
}
