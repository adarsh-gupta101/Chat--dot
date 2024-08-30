"use client"
import React, { useEffect } from 'react'
import Script from "next/script";
import { getCheckoutURL } from "@/libs/lemonsqueezy";
import Pricing from '@/components/ui/pricing';
import { HeaderComponent } from '@/components/component/header-component';
import FooterComponent from '@/components/ui/footer';

function Page() {
  useEffect(() => {
    if (typeof (window as any).createLemonSqueezy === "function") {
      (window as any).createLemonSqueezy?.();
    }
  }, []);

  async function getCheckoutURL_So_that_Users_Can_Buy() {
    let checkoutUrl = await getCheckoutURL(485166, true);
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <HeaderComponent />
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        defer
        strategy="lazyOnload"
      />
      
      <main className="pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Choose the right plan for you
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Get started with our flexible pricing options
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 py-8 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Pricing />
          </div>
        </div>

        {/* <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Choose a plan that works best for you and your team.
          </p>
          <div className="mt-8">
            <button
              onClick={getCheckoutURL_So_that_Users_Can_Buy}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get started
            </button>
          </div>
        </div> */}
      </main>

      <FooterComponent />
    </div>
  )
}

export default Page
