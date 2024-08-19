import { type Subscription } from "@lemonsqueezy/lemonsqueezy.js";
import { getUserSubscription, syncPlans } from "@/libs/lemonsqueezy";
// import { db, plans, type NewPlan } from "@/db/schema";
import { InfoMessage, NoPlans, Plan } from "./plan";
import { allPlans } from "@/libs/Supabase";
import { notFound } from "next/navigation";

export async function Plans({
  isChangingPlans = false,
}: {
  isChangingPlans?: boolean;
  currentPlan?: any;
}) {
//   let allPlans: any[] = await db.select().from(plans);
    let {data} = await allPlans();
    let allPlan: any[] | null = data || [];
  const userSubscriptions = await getUserSubscription();
  console.log(userSubscriptions,"user subs")

  if(!userSubscriptions) return <p>no subscription</p>;
  // Do not show plans if the user already has a valid subscription.
  if (userSubscriptions?.length > 0) {
    const hasValidSubscription = userSubscriptions.some((subscription) => {
      const status =
        subscription.status as Subscription["data"]["attributes"]["status"];

      return (
        status !== "cancelled" && status !== "expired" && status !== "unpaid"
      );
    });

    if (hasValidSubscription && !isChangingPlans) {
      notFound()
    }
  }


  if (!allPlan?.length) {
    return <NoPlans />;
  }

  const sortedPlans = allPlan.sort((a, b) => {
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

  return (
    <div>
      <h2 className='flex items-center after:ml-5 after:h-px after:grow after:bg-surface-100 after:content-[""]'>
        Plans {sortedPlans.length}
      </h2>

      <div className="mb-5 mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        {sortedPlans.map((plan, index) => {
          return <Plan key={`plan-${index}`} plan={plan} />;
        })}
      </div>

      <InfoMessage />
    </div>
  );
}