"use client";
import { Suspense, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import HomeScreen from "@/components/component/HomeScreen";
import Loading from "./loading";

export default function Home() {
  const user = useUser();

  useEffect(() => {
    if (typeof (window as any).createLemonSqueezy === "function") {
      (window as any).createLemonSqueezy?.();
    }
  }, []);

 

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
