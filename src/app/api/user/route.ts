import { getUserCredits } from "@/libs/user";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  let user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 400 });

  // fetch credit details
  let { success, credits, message } = await getUserCredits(user.id);
  if (!success) {
    return NextResponse.json({ error: message,credits:0 }, { status: 400 });
  }
  return NextResponse.json({ credits }, { status: 200 });
}
