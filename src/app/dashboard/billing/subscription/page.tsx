import { Section } from "@/components/section";
import { ChangePlan } from "@/components/ui/plans/change-plan-button";
import { getUserSubscription } from "@/libs/lemonsqueezy";
import { allPlans } from "@/libs/Supabase";
import { cn, isValidSubscription } from "@/libs/utils/utils";
import React from "react";

//test

// import { Section } from '../../section'
// import { ChangePlan } from '../plans/change-plan-button'
import { SubscriptionActions } from "../../../../components/ui/subscriptions/action";
// import { SubscriptionDate } from './date'
// import { SubscriptionPrice } from './price'
// import { SubscriptionStatus } from './status'
// import { type SubscriptionStatusType } from '@/types/types'
// import { db, plans, type NewSubscription } from '@/db/schema'
// import { getUserSubscriptions } from '@/app/actions

async function page() {
  const subscriptionDetails = await getUserSubscription();

  if (subscriptionDetails?.length === 0) {
    return (
      <div>
        <h1>No subscription found</h1>
      </div>
    );
  }

  // Show active subscriptions first, then paused, then canceled
  const sortedSubscriptions = subscriptionDetails?.sort((a, b) => {
    if (a.status === "active" && b.status !== "active") {
      return -1;
    }

    if (a.status === "paused" && b.status === "cancelled") {
      return -1;
    }

    return 0;
  });
  return (
    <>
      <Section className="not-prose relative">
        {sortedSubscriptions?.map(async (subscription, index) => {
          //   const plan =  allPlans().eq("id", subscription.plan);
          const allPlansData = await allPlans();
          
          const plan = allPlansData?.data?.find(
            (plan: { id: number }) => plan.id === subscription.plan_id
          );
          // return JSON.stringify(plan);
          const status = subscription.status;
          console.log(status);

          if (!plan) {
            throw new Error("Plan not found");
          }

          return (
            <Section.Item key={index}>
              <h2
                className={cn(
                  "text-surface-900 text-lg",
                  !isValidSubscription(status) && "text-inherit"
                )}
              >
              product name<br/>  {plan.productName} ({plan.name})
              </h2>

              <div className="flex items-center gap-2">
                {isValidSubscription(status) && (
                  <ChangePlan planId={subscription.planId} />
                )}

                <SubscriptionActions subscription={subscription} />
              </div>
            </Section.Item>
          );
        })}
      </Section>
      hi
    </>
  );
}

export default page;
