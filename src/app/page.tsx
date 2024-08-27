"use client";
import { Suspense, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import HomeScreen from "@/components/component/HomeScreen";
import Loading from "./loading";
import { getCheckoutURL } from "@/libs/lemonsqueezy";

export default function Home() {
  const user = useUser();

  useEffect(() => {
    if (typeof (window as any).createLemonSqueezy === "function") {
      (window as any).createLemonSqueezy?.();
    }
  }, []);

  async function getCheckoutURL_So_that_Users_Can_Buy() {
    const checkoutUrl = await getCheckoutURL(472559, true);
    (window as any).LemonSqueezy.Url.Open(checkoutUrl);
  }

  return (
    <main className="w-full">
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        defer
        strategy="lazyOnload"
      />

      <Suspense fallback={<Loading />}>
        <HomeScreen />
      </Suspense>
    </main>
  );
}
