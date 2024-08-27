"use server";

import {
  lemonSqueezySetup,
  cancelSubscription,
  createCheckout,
  getPrice,
  getSubscription,
  listProducts,
  updateSubscription,
  type Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { supabase } from "./Supabase";
import crypto from "crypto";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PaymentSuccessEmail } from "./PaymentSuccessEmail";

const configureLemonSqueezy = lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY,
  onError(error) {
    console.log(error);
  },
});

export async function getCheckoutURL(variantId: number, embed = true) {
  if (!Number.isInteger(variantId) || variantId <= 0) {
    throw new Error("Invalid variantId. Must be a positive integer.");
  }
  if (typeof embed !== "boolean") {
    throw new Error("Invalid embed value. Must be a boolean.");
  }
  const { userId } = auth();
  const user = await currentUser();

  // get email
  const userEmail = user?.emailAddresses[0].emailAddress ?? "";

  const checkout = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID as string,
    variantId,
    {
      checkoutOptions: {
        embed,
        media: true,
        logo: true,
        dark: true,
      },
      checkoutData: {
        email: userEmail,
        custom: {
          user_id: userId,
        },
      },

      productOptions: {
        enabledVariants: [variantId],
        redirectUrl: `${
          process.env.NODE_ENV === "production"
            ? "https://chat.adarsh-gupta.in"
            : process.env.NEXT_PUBLIC_APP_URL
        }/dashboard/`,
        receiptButtonText: "Go to Dashboard",
        receiptThankYouNote: "Thank you for signing up to Lemon Stand!",
      },
    }
  );

  return checkout.data?.data.attributes.url;
}

export async function syncPlans() {
  // Fetch all the plans from the database.

  const { data: existingPlans, error: fetchError } = await supabase
    .from("plans")
    .select("*");
  if (fetchError) {
    console.error("Error fetching existing plans:", fetchError);
    return;
  }

  // Fetch products from the Lemon Squeezy store.
  const productsResponse = await listProducts({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
    include: ["variants"],
  });

  console.log("productsResponse", productsResponse);

  const products = productsResponse.data?.data || [];
  const fetchedVariantIds: number[] = [];

  for (const product of products) {
    const { attributes, relationships } = product;
    const variants = relationships.variants.data;

    // Skip draft products
    if (attributes.status === "draft") {
      continue;
    }
    if (variants && productsResponse?.data?.included) {
      for (const variant of variants) {
        const variantData = productsResponse?.data?.included.find(
          (item) => item.type === "variants" && item.id === variant.id
        );

        if (!variantData) continue;

        const variantAttributes = variantData.attributes;

        // Skip pending variants if there's more than one variant
        if (variants.length > 1 && variantAttributes.status === "pending") {
          continue;
        }

        try {
          const variant_id = parseInt(variant.id);
          fetchedVariantIds.push(variant_id);

          const upsertData = {
            product_id: parseInt(product.id),
            product_name: attributes.name,
            variant_id: variant_id,
            name: variantAttributes.name,
            description: variantAttributes.description,
            price: variantAttributes.price,
            is_subscription: variantAttributes.is_subscription,
            interval: variantAttributes.interval,
            interval_count: variantAttributes.interval_count,
            trial_interval: variantAttributes.trial_interval,
            trial_interval_count: variantAttributes.trial_interval_count,
            sort: variantAttributes.sort,
          };

          const { data, error } = await supabase
            .from("plans")
            .upsert([upsertData], { onConflict: "variant_id" });

          if (error) {
            console.error("Error upserting data:", error);
          } else {
            console.log("Data upserted successfully:", data);
          }
        } catch (error) {
          console.error(`Error processing variant ${variant.id}:`, error);
        }
      }
    }
  }

  // Remove old variants not present in the fetched data
  if (fetchedVariantIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("plans")
      .delete()
      .not("variant_id", "in", `(${fetchedVariantIds.join(",")})`);

    if (deleteError) {
      console.error("Error deleting old variants:", deleteError);
    } else {
      console.log("Old variants deleted successfully.");
    }
  }
  return productsResponse;
}

export async function storeWebhookEvent(eventName: string, body: any) {
  const { data, error } = await supabase
    .from("webhook_events")
    .upsert(
      [
        {
          user_id: body.meta.custom_data.user_id,
          event_name: eventName,
          body,
        },
      ],
      { onConflict: "id" }
    )
    .select();

  if (error) {
    throw error;
  }
  return data;
}

export async function processWebhookEvent(webhookEvent: any) {
  try {
    const { data: dbWebhookEvent, error } = await supabase
      .from("webhook_events")
      .select("*")
      .eq("id", webhookEvent[0].id)
      .single();

    if (error || !dbWebhookEvent) {
      throw new Error(
        `Webhook event #${webhookEvent.id} not found in the database.`
      );
    }
  } catch (error) {
    console.error(error);
  }

  const eventBody = webhookEvent[0].body;

  if (
    webhookEvent[0].event_name.startsWith("subscription_updated") ||
    webhookEvent[0].event_name.startsWith("subscription_created")
  ) {
    const attributes = eventBody.data.attributes;
    const variantId = attributes.variant_id;

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("variant_id", variantId)
      .single();

    if (planError || !plan) {
      throw new Error(`Plan with variantId ${variantId} not found.`);
    }
    let priceId = eventBody.data.attributes.first_subscription_item.price_id;
    let lPrice = await getPrice(priceId);

    const updateData = {
      lemon_squeezy_id: eventBody.data.id,
      order_id: attributes.order_id,
      name: attributes.user_name,
      email: attributes.user_email,
      status: attributes.status,
      status_formatted: attributes.status_formatted,
      renews_at: attributes.renews_at,
      ends_at: attributes.ends_at,
      trial_ends_at: attributes.trial_ends_at,
      price: lPrice.data?.data.attributes.unit_price,
      is_paused: attributes.status == "paused" ? true : false,
      subscription_item_id: attributes.first_subscription_item.id,
      is_usage_based: attributes.first_subscription_item.is_usage_based,
      user_id: eventBody.meta.custom_data.user_id,
      plan_id: plan.id,
    };

    const { error: upsertError } = await supabase
      .from("subscriptions")
      .upsert([updateData], { onConflict: "lemon_squeezy_id" });
    if (upsertError) {
      throw new Error(`Failed to upsert subscription: ${upsertError.message}`);
    }

    /**
     * Mark the webhook event as processed
     * You can remove the webhook from the db if it is processed successfully
     */

    const { error: updateError } = await supabase
      .from("webhook_events")
      .update({ processed: true })
      .eq("id", webhookEvent[0].id);
    if (updateError) {
      throw new Error(`Failed to update webhook event: ${updateError.message}`);
    }
  }

  // payment success email
  if (webhookEvent[0].event_name.startsWith("subscription_payment_success")) {
    const attributes = eventBody.data.attributes;

    PaymentSuccessEmail(attributes.user_email, attributes.user_name);
  }

  //if single order item
  if (webhookEvent[0].event_name.startsWith("order_created")) {
    const attributes = eventBody.data.attributes;
    const variantId = attributes.first_order_item.variant_id;

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("variant_id", variantId)
      .single();

    if (planError || !plan) {
      throw new Error(`Plan with variantId ${variantId} not found.`);
    }
    let priceId = eventBody.data.attributes.first_order_item.price_id;
    let lPrice = await getPrice(priceId);

    const updateData = {
      lemon_squeezy_id: eventBody.data.id,
      order_id: attributes.order_id,
      name: attributes.user_name,
      email: attributes.user_email,
      status: attributes.status,
      status_formatted: attributes.status_formatted,
      renews_at: attributes.renews_at,
      ends_at: attributes.ends_at,
      trial_ends_at: attributes.trial_ends_at,
      price: lPrice.data?.data.attributes.unit_price,
      is_paused: attributes.status == "paused" ? true : false,
      subscription_item_id: attributes.id,
      is_usage_based: attributes.is_usage_based,
      user_id: eventBody.meta.custom_data.user_id,
      plan_id: plan.id,
    };

    const { error: upsertError } = await supabase
      .from("subscriptions")
      .upsert([updateData], { onConflict: "lemon_squeezy_id" });
    if (upsertError) {
      throw new Error(`Failed to upsert subscription: ${upsertError.message}`);
    }

    /**
     * Mark the webhook event as processed
     * You can remove the webhook from the db if it is processed successfully
     */
    const { error: updateError } = await supabase
      .from("webhook_events")
      .update({ processed: true })
      .eq("id", webhookEvent[0].id);
    if (updateError) {
      throw new Error(`Failed to update webhook event: ${updateError.message}`);
    }

    const { error: creditError } = await supabase.from("credits").upsert(
      {
        user_id: eventBody.meta.custom_data.user_id,
        // order_id: attributes.first_order_item.order_id,
        credits: 100000,
      },
      { onConflict: "user_id" }
    );

    if (creditError) {
      throw new Error(`Failed to upsert credits: ${creditError.message}`);
    }
  }
}

export async function getUserSubscription() {
  try {
    const currentUserResult = await currentUser();
    const user = currentUserResult?.id;

    if (!user) {
      notFound();
    }

    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user);

    return subscriptions;
  } catch (error) {
    console.log(error);
  }
}

export async function getSubscriptionURLs(id: string) {
  const subscription = await getSubscription(id);

  if (subscription.error) {
    throw new Error(subscription.error.message);
  }

  return subscription.data?.data.attributes.urls;
}

export async function cancelSub(id: string) {
  // Get user subscriptions
  const userSubscriptions = await getUserSubscription();

  // Check if the subscription exists
  const subscription = userSubscriptions?.find(
    (sub) => sub.lemon_squeezy_id === id
  );

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }

  const cancelledSub = await cancelSubscription(id);

  console.log(cancelledSub, "cancelledSub");

  if (cancelledSub.error) {
    throw new Error(cancelledSub.error.message);
  }

  // Update the db
  try {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: cancelledSub.data?.data.attributes.status,
        status_formatted: cancelledSub.data?.data.attributes.status_formatted,
        ends_at: cancelledSub.data?.data.attributes.ends_at,
      })
      .eq("lemon_squeezy_id", id);
  } catch (error) {
    throw new Error(`Failed to cancel Subscription #${id} in the database.`);
  }

  revalidatePath("/");

  return cancelledSub;
}

/**
 * This action will pause a subscription on Lemon Squeezy.
 */
export async function pauseUserSubscription(id: string) {
  // Get user subscriptions
  const userSubscriptions = await getUserSubscription();

  // Check if the subscription exists
  const subscription = userSubscriptions?.find(
    (sub) => sub.lemon_squeezy_id === id
  );

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }

  const returnedSub = await updateSubscription(id, {
    pause: {
      mode: "void",
    },
  });

  // Update the db
  try {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: returnedSub.data?.data.attributes.status,
        status_formatted: returnedSub.data?.data.attributes.status_formatted,
        ends_at: returnedSub.data?.data.attributes.ends_at,
        is_paused: true,
      })
      .eq("lemon_squeezy_id", id);
  } catch (error) {
    throw new Error(`Failed to pause Subscription #${id} in the database.`);
  }

  revalidatePath("/");

  return returnedSub;
}

/**
 * This action will unpause a subscription on Lemon Squeezy.
 */
export async function unpauseUserSubscription(id: string) {
  // Get user subscriptions
  const userSubscriptions = await getUserSubscription();

  // Check if the subscription exists
  const subscription = userSubscriptions?.find(
    (sub: any) => sub.lemon_squeezy_id === id
  );

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }

  const returnedSub = await updateSubscription(id, {
    pause: null,
  });

  // Update the db
  try {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: returnedSub.data?.data.attributes.status,
        status_formatted: returnedSub.data?.data.attributes.status_formatted,
        ends_at: returnedSub.data?.data.attributes.ends_at,
        is_paused: false,
      })
      .eq("lemon_squeezy_id", id);
  } catch (error) {
    throw new Error(`Failed to pause Subscription #${id} in the database.`);
  }

  revalidatePath("/");

  return returnedSub;
}

/**
 * This action will change the plan of a subscription on Lemon Squeezy.
 */
export async function changePlan(currentPlanId: number, newPlanId: number) {
  // Get user subscriptions
  const userSubscriptions = await getUserSubscription();

  // Check if the subscription exists
  const subscription = userSubscriptions?.find(
    (sub) => sub.plan_id === currentPlanId
  );

  if (!subscription) {
    throw new Error(
      `No subscription with plan id #${currentPlanId} was found.`
    );
  }

  const newPlan = await supabase
    .from("plans")
    .select("*")
    .eq("id", newPlanId)
    .single();

  console.log(newPlan, "new plan");
  // Send request to Lemon Squeezy to change the subscription.
  const updatedSub = await updateSubscription(subscription.lemon_squeezy_id, {
    variantId: newPlan.data?.variant_id,
  });

  // Save in db
  try {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        plan_id: newPlanId,
        price: newPlan.data?.price,
        ends_at: updatedSub.data?.data.attributes.ends_at,
      })
      .eq("lemon_squeezy_id", subscription.lemon_squeezy_id);
  } catch (error) {
    throw new Error(
      `Failed to update Subscription #${subscription.lemon_squeezy_id} in the database.${error}`
    );
  }

  revalidatePath("/");

  return updatedSub;
}
