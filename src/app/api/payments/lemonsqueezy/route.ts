import { NextResponse } from "next/server";
import { getCheckoutURL } from "@/libs/lemonsqueezy";

export async function POST(req: Request) {
  try {
    const url = await getCheckoutURL(process.env.LEMONSQUEEZY_VARIANT_ID as unknown as number);
    return NextResponse.json(url);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
