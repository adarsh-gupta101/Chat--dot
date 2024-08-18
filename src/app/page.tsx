"use client";
import Header from "@/components/ui/Header";
import { getCheckoutURL, storeWebhookEvent, syncPlans } from "@/libs/lemonsqueezy";
import { getAuthenticatedUser } from "@lemonsqueezy/lemonsqueezy.js"
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Script from "next/script";
import { useEffect } from "react";
import HomeScreen from "@/components/component/HomeScreen";
import { MultiChat } from "@/components/component/multi-chat";

export default function Home() {
  const user= useUser();
  console.log(user);
  useEffect(() => {
    if (typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy();
    }
  }, []);
  async function getCheckoutURL_So_that_Users_Can_Buy() {
    let checkoutUrl = await getCheckoutURL(472559, true);
    // window.open(checkoutUrl);
    window.LemonSqueezy.Url.Open(checkoutUrl);
  }

  return (
    <main className="w-full ">
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        defer
        strategy="lazyOnload"
        onLoad={() => {
          window.createLemonSqueezy();
        }}
      ></Script>
     <HomeScreen/>
    </main>
  );
}
