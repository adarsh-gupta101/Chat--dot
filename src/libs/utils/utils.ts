import { type Subscription } from "@lemonsqueezy/lemonsqueezy.js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function isValidSubscription(
  status: Subscription["data"]["attributes"]["status"]
) {
  return status !== "cancelled" && status !== "expired" && status !== "unpaid";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// if status = expired user should not be able use the product

export function isPlanExpired(
  status: Subscription["data"]["attributes"]["status"]
) {
  return status === "expired";
}

export function formatPrice(priceInCents: string) {
  const price = parseFloat(priceInCents);
  const dollars = price / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // Use minimumFractionDigits to handle cases like $59.00 -> $59
    minimumFractionDigits: dollars % 1 !== 0 ? 2 : 0,
  }).format(dollars);
}

export function formatDate(date: string | number | Date | null | undefined) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
