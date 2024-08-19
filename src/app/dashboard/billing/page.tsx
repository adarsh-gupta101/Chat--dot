import { Suspense } from "react";
import { Plans } from "@/components/ui/plans/plans";
import { Subscriptions } from "@/components/ui/subscriptions/subscriptions";
// import { DashboardContent } from "@/components/dashboard/content";

export const dynamic = "force-dynamic";

export default function BillingPage() {
  return (
   
      <div>
        <Suspense >
          {/* <Subscriptions /> */}
        </Suspense>

        <Suspense>
            plans
          <Plans />
        </Suspense>
      </div>
  );
}