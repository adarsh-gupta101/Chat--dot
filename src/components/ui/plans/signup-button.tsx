"use client";

import { Button, Loading } from "@lemonsqueezy/wedges";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useState,
  type ComponentProps,
  type ElementRef,
} from "react";
import { toast } from "sonner";
import { changePlan, getCheckoutURL } from "@/libs/lemonsqueezy";
import Script from "next/script";

type ButtonElement = ElementRef<typeof Button>;
type ButtonProps = ComponentProps<typeof Button> & {
  embed?: boolean;
  isChangingPlans?: boolean;
  currentPlan?: any;
  plan: any;
};

// eslint-disable-next-line react/display-name
export const SignupButton = forwardRef<ButtonElement, ButtonProps>(
  (props, ref) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
      embed = true,
      plan,
      currentPlan,
      isChangingPlans = false,
      ...otherProps
    } = props;

    const isCurrent = plan.id === currentPlan?.id;

    // eslint-disable-next-line no-nested-ternary -- allow
    const label = isCurrent
      ? "Your plan"
      : isChangingPlans
      ? "Switch to this plan"
      : "Subscribe";

    // return `so ${label}`;
    // Make sure Lemon.js is loaded
    useEffect(() => {
      if (typeof (window as any).createLemonSqueezy === "function") {
        (window as any).createLemonSqueezy();
      }
    }, []);

    // eslint-disable-next-line no-nested-ternary -- disabled
    const before = loading ? (
      <Loading size="sm" className="size-4 dark" color="secondary" />
    ) : props.before ?? isCurrent ? (
      <CheckIcon className="size-4" />
    ) : (
      <PlusIcon className="size-4" />
    );

    return (
      <>
        <Script
          src="https://assets.lemonsqueezy.com/lemon.js"
          defer
          strategy="lazyOnload"
          // onLoad={() => {
          //   window.createLemonSqueezy();
          // }}
        ></Script>
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          ref={ref}
          before={before}
          disabled={loading || isCurrent || props.disabled}
          onClick={async () => {
            // If changing plans, call server action.
            if (isChangingPlans) {
              console.log("changing plans", isChangingPlans);
              if (!currentPlan?.id) {
                throw new Error("Current plan not found.");
              }

              if (!plan.id) {
                throw new Error("New plan not found.");
              }

              setLoading(true);
              await changePlan(currentPlan.id, plan.id);
              setLoading(false);

              return;
            }

            // Otherwise, create a checkout and open the Lemon.js modal.
            let checkoutUrl: string | undefined = "";
            try {
              setLoading(true);
              checkoutUrl = await getCheckoutURL(plan.variant_id, embed);
            } catch (error) {
              setLoading(false);
              toast("Error creating a checkout.", {
                description:
                  "Please check the server console for more information.",
              });
            } finally {
              embed && setLoading(false);
            }

            // embed
            //   ? checkoutUrl && LemonSqueezy?.Url.Open(checkoutUrl)
            //   : router.push(checkoutUrl ?? "/");

            if (embed) {
              if (checkoutUrl) {
                (window as any).LemonSqueezy.Url.Open(checkoutUrl);
              }
            } else {
              router.push(checkoutUrl ?? "/");
            }
          }}
          {...otherProps}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-white ">
            {label}
          </span>
        </button>
      </>
    );
  }
);
