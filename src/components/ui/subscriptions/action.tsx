import { SubscriptionActionsDropdown } from "./action-dropdown";
import { getSubscriptionURLs } from "@/libs/lemonsqueezy";

export async function SubscriptionActions({
  subscription,
}: {
  subscription: any;
}) {
  if (
    subscription.status === "expired" ||
    subscription.status === "cancelled" ||
    subscription.status === "unpaid"
  ) {
    return null;
  }

  const urls = await getSubscriptionURLs(subscription.lemon_squeezy_id);

  return (
    <SubscriptionActionsDropdown subscription={subscription} urls={urls} />
  );
}
