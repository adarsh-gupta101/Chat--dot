import Link from "next/link";

export function ChangePlan({ planId }: { planId: number }) {
  return (
    <button >
      <Link href={`/dashboard/billing/change-plans/${planId}`}>
        Change plan
      </Link>
    </button>
  );
}