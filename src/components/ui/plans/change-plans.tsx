import { redirect } from "next/navigation";
import { getUserSubscription } from "@/libs/lemonsqueezy";
// import { db, plans, type NewPlan } from "@/db/schema";
import { InfoMessage, NoPlans, Plan } from "./plan";
import { allPlans } from "@/libs/Supabase";

export async function ChangePlans({ currentPlan }: { currentPlan?: any }) {
//   const allPlans: NewPlan[] = await db.select().from(plans);
const allPlan: any = (await allPlans()).data;
  const userSubscriptions = await getUserSubscription();

  // If user does not have a valid subscription, redirect to the billing page, or
  // if there are no plans in the database, redirect to the billing page to fetch.
  if (!userSubscriptions?.length || !allPlan?.length) {
    redirect("/dashboard/billing");
  }

  const isCurrentPlanUsageBased = currentPlan?.isUsageBased;
 
  const filteredPlans = allPlan
    .filter((plan) => {
      return isCurrentPlanUsageBased
        ? Boolean(plan.isUsageBased)
        : Boolean(!plan.isUsageBased);
    })
    .sort((a, b) => {
      if (
        a.sort === undefined ||
        a.sort === null ||
        b.sort === undefined ||
        b.sort === null
      ) {
        return 0;
      }

      return a.sort - b.sort;
    });

  if (filteredPlans.length < 2) {
    return <NoPlans />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        {filteredPlans.map((plan, index) => {
          return (
            <Plan
              isChangingPlans={true}
              key={`plan-${index}`}
              plan={plan}
              currentPlan={currentPlan}
            />
          );
        })}
      </div>

      <InfoMessage />
    </div>
  );
}