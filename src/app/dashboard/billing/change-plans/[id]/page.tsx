import { Alert, Button } from "@lemonsqueezy/wedges";
// import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUserSubscription } from "@/libs/lemonsqueezy";
import { ChangePlans } from "@/components/ui/plans/change-plans";
// import { DashboardContent } from "@/components/dashboard/content";
// import { PageTitleAction } from "@/components/dashboard/page-title-action";
// import { db, plans } from "@/db/schema";
import { isValidSubscription } from "@/libs/utils/utils";
import { supabase } from "@/libs/Supabase";
// import { type SubscriptionStatusType } from "@/types/types";

export const dynamic = "force-dynamic";

export default async function ChangePlansPage({
  params,
}: {
  params: { id?: string };
}) {
  if (!params.id) {
    notFound();
  }
  const currentPlanId = parseInt(params.id);
  //   console.log(currentPlanId,"1111111111111111");

  if (isNaN(currentPlanId)) {
    notFound();
  }

  // Get user subscriptions to check the current plan.
  const userSubscriptions = await getUserSubscription();

  console.log(userSubscriptions?.length, 22222222222222222222);

  if (!userSubscriptions?.length) {
    notFound();
  }

  const isCurrentPlan = userSubscriptions.find(
    (s) => s.plan_id === currentPlanId && isValidSubscription(s.status)
  );

  console.log(!isCurrentPlan, 999999999999999);

  if (!isCurrentPlan) {
    // return "you are not a plan"
    redirect("/dashboard/billing");
  }

  //   const currentPlan = await db
  //     .select()
  //     .from(plans)
  //     .where(eq(plans.id, currentPlanId));

  const currentPlan = await supabase
    .from("plans")
    .select("*")
    .eq("id", currentPlanId);
  console.log(
    currentPlan.data?.length,
    "55555555555555555555555555555555555555555555"
  );
  if (!currentPlan.data?.length) {
    notFound();
  }

  return (
    <div>
      <Link href="/dashboard/billing">Back to Billing</Link>
      <ChangePlans currentPlan={currentPlan.data.at(0)} />
    </div>
    //   title="Change Plans"
    //   subtitle="Choose a plan that works for you."
    //   action={
    //     <div className="flex items-center gap-4">
    //       <Button asChild variant="tertiary">
    //       </Button>
    //       <PageTitleAction />
    //     </div>
    //   }
    // >
    //   <ChangePlans currentPlan={currentPlan.at(0)} />
    // </DashboardContent>
  );
}
