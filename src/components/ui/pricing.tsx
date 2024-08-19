"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getCheckoutURL,
  storeWebhookEvent,
  syncPlans,
} from "@/libs/lemonsqueezy";

import {
  BadgePercent,
  DollarSignIcon,
  JoystickIcon,
  Mail,
  ToyBrick,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { SignIn } from "@clerk/clerk-react";
import { useUser, useSignIn, useClerk } from "@clerk/nextjs";
import Script from "next/script";

function Pricing() {
  useEffect(() => {
    if (typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy();
    }
  }, []);
  async function getCheckoutURL_So_that_Users_Can_Buy() {
    let checkoutUrl = await getCheckoutURL(485166, true);
    // window.open(checkoutUrl);
    window.LemonSqueezy.Url.Open(checkoutUrl);
  }

  return (
    <div className="">
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        defer
        strategy="lazyOnload"
        onLoad={() => {
          window.createLemonSqueezy();
        }}
      ></Script>

      <h2 className="scroll-m-20 text-center pb-2 text-5xl font-semibold tracking-tight first:mt-0">
        Pricing
      </h2>

      <p className="leading-7 [&:not(:first-child)]:mt-6 font-medium  text-center">
        Chat With Claude, OpenAI, Gemini in Just one App
      </p>

      <div className="flex md:flex-row flex-col justify-center mt-16">
        <PricingTable
          product_id={`${
            process.env.NODE_ENV == "production"
              ? "price_1OJDxeSHBIS48Dl7JOmVMxhk"
              : "price_1OJBI4SHBIS48Dl7RwjXoZKk"
          }`}
          // product_id="price_1OJDxeSHBIS48Dl7JOmVMxhk"
        />

        {/* <PricingTable /> */}
      </div>
    </div>
  );
}

export default Pricing;

function PricingTable({ product_id }: { product_id?: string }) {
  let { isSignedIn } = useUser();
  const { signIn } = useSignIn();
  const [isUserSignedIn, setIsUserSignedIn] = React.useState(isSignedIn);
  const clerk = useClerk();
  const formRef = React.useRef<HTMLFormElement>(null);

  async function getCheckoutURL_So_that_Users_Can_Buy() {
    let checkoutUrl = await getCheckoutURL(485166, true);
    // window.open(checkoutUrl);
    window.LemonSqueezy.Url.Open(checkoutUrl);
  }
  return (
    <Card className=" md:w-1/4 px-6 bg-gray-50 ring-1 ring-gray-50 rounded m-6">
      <CardHeader>
        <CardTitle>Premium</CardTitle>
        <CardDescription>
          All essential features to get started with your app
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <p className="text-4xl font-bold text-gray-800 my-2">$9</p>
        <div className="flex items-center">
          <ul>
          <li className="flex mt-2">
              <BadgePercent className="w-6 mr-2 text-green-500" />
             1,00,000 Chat tokens{" "}
            </li>
            <li className="flex mt-2">
              <BadgePercent className="w-6 mr-2 text-green-500" />
              Chat With 9+ AI tools
            </li>

            <li className="flex mt-2">
              <BadgePercent className="w-6 mr-2 text-green-500" /> Create UI
            </li>

            <li className="flex mt-2">
              <BadgePercent className="w-6 mr-2 text-green-500" />
              Pay-as-u-Use Model{" "}
            </li>
          </ul>
        </div>

        <SignedIn>
          <Button
            className="mt-4 bg-gradient-to-r w-full from-pink-700 to-blue-700"
            type="submit"
            onClick={() => getCheckoutURL_So_that_Users_Can_Buy()}
          >
            <JoystickIcon className="mr-2 h-4 w-4" />
            Buy Now✨
          </Button>
        </SignedIn>

        <SignedOut>
            <Button
                className="mt-4 bg-gradient-to-r w-full from-pink-700 to-blue-700"
                type="submit"
            >
                <JoystickIcon className="mr-2 h-4 w-4" />
<SignInButton/>            </Button>

        </SignedOut>
      </CardContent>
    </Card>
  );
}
