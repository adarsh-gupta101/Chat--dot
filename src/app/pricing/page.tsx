"use client"
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Script from "next/script";
import { getCheckoutURL, storeWebhookEvent, syncPlans } from "@/libs/lemonsqueezy";
import Pricing from '@/components/ui/pricing';
import Header from '@/components/ui/Header';
import { HeaderComponent } from '@/components/component/header-component';


function Page() {

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
    <div>
      <HeaderComponent/>
       <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        defer
        strategy="lazyOnload"
        onLoad={() => {
          window.createLemonSqueezy();
        }}
      ></Script>
        
      <Pricing/>

    </div>
  )
}

export default Page
