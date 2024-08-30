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

declare global {
  interface Window {
    LemonSqueezy: any;
  }
}

function Pricing() {
  useEffect(() => {
    if (typeof (window as any).createLemonSqueezy === "function") {
      (window as any).createLemonSqueezy?.();
    }
  }, []);

  return (
    <div className="mt-6">
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        defer
        strategy="lazyOnload"
        onLoad={() => {
          (window as any).createLemonSqueezy();
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

        // product_id="price_1OJDxeSHBIS48Dl7JOmVMxhk"
        />

        {/* <PricingTable /> */}
      </div>
    </div>
  );
}

export default Pricing;

function PricingTable() {
  let { isSignedIn } = useUser();
  const { signIn } = useSignIn();
  const [isUserSignedIn, setIsUserSignedIn] = React.useState(isSignedIn);
  const clerk = useClerk();
  const formRef = React.useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);

  const getCheckoutURL = async () => {
    try {
      setIsLoading(true); // Set loading state to true before making the request
      const response = await fetch("/api/payments/lemonsqueezy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      console.log({response})
      if (!response.ok) {
        throw new Error("Failed to get checkout URL");
      }

      
      const res = await response.json();
      
      // console.log("Response:", response);
      if (res && window.LemonSqueezy && window.LemonSqueezy.Url) {
        window.LemonSqueezy.Url.Open(res);
      } else {
        console.error("LemonSqueezy or LemonSqueezy.Url is not available");
        // Handle the case when LemonSqueezy or LemonSqueezy.Url is not available
        // For example, you can open the URL in a new tab as a fallback
        window.open(res, '_self');
      }
    } catch (error) {
      console.error("Error getting checkout URL:", error);
    } finally {
      setIsLoading(false); // Set loading state back to false after the request is completed
    }
  };

  return (
    <Card className="md:w-96 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 rounded-lg shadow-lg m-6 transform hover:scale-105 transition-transform duration-300">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">Premium</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          All essential features to supercharge your app
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-800 to-blue-600 my-4">
          $8
        </p>
        <ul className="space-y-3 text-gray-700 dark:text-gray-200">
          <PricingFeature icon={BadgePercent} text="1,00,000 Chat tokens" />
          <PricingFeature icon={BadgePercent} text="Chat With 9+ AI tools" />
          <PricingFeature icon={BadgePercent} text="Create UI" />
          <PricingFeature icon={BadgePercent} text="Pay-as-you-Use Model" />
        </ul>

        <SignedIn>
          <Button
            className="mt-8 w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300"
            type="submit"
            onClick={() => getCheckoutURL()}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <JoystickIcon className="mr-2 h-5 w-5" />
                Upgrade Now ✨
              </>
            )}
          </Button>
        </SignedIn>

        <SignedOut>
          <Button
            className="mt-8 w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300"
            type="submit"
          >
            <JoystickIcon className="mr-2 h-5 w-5" />
            <SignInButton />
          </Button>
        </SignedOut>
      </CardContent>
    </Card>
  );
}

function PricingFeature({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <li className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-green-500" />
      <span>{text}</span>
    </li>
  );
}
