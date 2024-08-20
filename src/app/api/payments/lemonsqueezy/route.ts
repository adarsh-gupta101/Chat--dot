import { NextResponse } from "next/server";
import { getCheckoutURL } from "@/libs/lemonsqueezy";

export async function POST(req: Request) {
  try {
    const url = await getCheckoutURL(parseInt(process.env.LEMONSQUEEZY_VARIANT_ID as string));
    return NextResponse.json(url);
  } catch (e) {
    console.log({e})
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
