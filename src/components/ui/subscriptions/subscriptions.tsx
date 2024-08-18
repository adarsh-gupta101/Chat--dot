// import { type SubscriptionStatusType } from "@/types/types";
import { cn, formatDate, isValidSubscription } from "@/libs/utils/utils";
// import { db, plans, type NewSubscription } from "@/db/schema";
import { getUserSubscription } from "@/libs/lemonsqueezy";
import { Section } from "../../section";
import { ChangePlan } from "../plans/change-plan-button";
import { SubscriptionActions } from "./action";
import { SubscriptionDate } from "./date";
import { SubscriptionPrice } from "./price";
import { SubscriptionStatus } from "./status";
import {  allPlans  } from "@/libs/Supabase";

export async function Subscriptions() {
  const userSubscriptions = await getUserSubscription();
//   const allPlans = await db.select().from(plans);
const allPlan = await allPlans();
console.log(userSubscriptions,"user subs")
// return;

  if (userSubscriptions.length === 0) {
    return (
      <p className="not-prose mb-2">
        It appears that you do not have any subscriptions. Please sign up for a
        plan below.
      </p>
    );
  }

  // Show active subscriptions first, then paused, then canceled
  const sortedSubscriptions = userSubscriptions.sort((a, b) => {
    if (a.status === "active" && b.status !== "active") {
      return -1;
    }

    if (a.status === "paused" && b.status === "cancelled") {
      return -1;
    }

    return 0;
  });

  return (
    <Section className="not-prose relative">
      {sortedSubscriptions.map(
        (subscription: any, index: number) => {
            const plan = allPlan.data?.find((p) => p.id === subscription.plan_id);
           
          const status = subscription.status as any;
        //   console.log(subscription,"[][][][][]",plan,"((((()))))")

          if (!plan) {
            throw new Error("Plan not found");
          }

          return (
            <Section.Item
              key={index}
              className="flex-col items-stretch justify-center gap-2"
            >
              <header className="flex items-center justify-between gap-3">
                <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1">
                  <h2
                    className={cn(
                      "text-lg text-surface-900",
                      !isValidSubscription(status) && "text-inherit",
                    )}
                  >
                    {plan.product_name}  ({plan.name})
                  </h2>

                  {/* show whether cancelled or not */}
                  {!isValidSubscription(status) && (
                    <span className="text-sm text-surface-500">
                      ({subscription.status_formatted})
                      {/* ends on */}
                      {status === "cancelled" && (
                        <>
                          {" "}
                         Ends on{" "}
                          <time dateTime={subscription.ends_at}>
                            { formatDate( subscription.ends_at)}
                          </time>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isValidSubscription(status) && (
                    <ChangePlan planId={subscription.plan_id} />
                  )}

                  <SubscriptionActions subscription={subscription} />
                </div>
              </header>

              <div className="flex flex-wrap items-center gap-2">
                <SubscriptionPrice
                  endsAt={subscription.ends_at}
                  interval={plan.interval}
                  intervalCount={plan.interval_count}
                  price={subscription.price}
                  isUsageBased={subscription.is_usage_based ?? false}
                />

                <SubscriptionStatus
                  status={status}
                  statusFormatted={subscription.statusFormatted}
                  isPaused={Boolean(subscription.isPaused)}
                />

                <SubscriptionDate
                  endsAt={subscription.endsAt}
                  renewsAt={subscription.renewsAt}
                  status={status}
                  trialEndsAt={subscription.trialEndsAt}
                />
              </div>
            </Section.Item>
          );
        },
      )}
    </Section>
  );
}