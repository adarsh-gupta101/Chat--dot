"use client";

import { DropdownMenu } from "@lemonsqueezy/wedges";
import Script from "next/script";
import { type ReactNode, useEffect } from "react";

export function LemonSqueezyModalLink({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {


  return (
    <>
     <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        defer
        strategy="lazyOnload"
        onLoad={() => {
          window.createLemonSqueezy();
        }}
      ></Script>
    <DropdownMenu.Item
      onClick={() => {
        if (href) {
          window.LemonSqueezy.Url.Open(href);
        } else {
          throw new Error(
            "href provided for the Lemon Squeezy modal is not valid.",
          );
        }
      }}
    >
      {children}
    </DropdownMenu.Item>
    </>
  );
}