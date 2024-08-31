import { getUserGeneratedImages } from "@/libs/user";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// get user generated images
export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }
  const images = await getUserGeneratedImages(user.id);
  return NextResponse.json(images);
}
