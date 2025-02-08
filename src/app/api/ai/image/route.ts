import { NextResponse } from "next/server";
import * as fal from "@fal-ai/serverless-client";
import { currentUser } from "@clerk/nextjs/server";
import {
  addUserGeneratedImages,
  deductCredit,
  getUserCredits,
} from "@/libs/user";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const { credits, success } = await getUserCredits(user.id);
    if (!success || credits < 200) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    fal.config({
      credentials: process.env.FAL_KEY,
    });

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: prompt,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => console.log(log.message));
        }
      },
    });

    await deductCredit(user.id, 200); // Deduct 1000 credits for image generation
    try {
      await addUserGeneratedImages(
        (result as { images: { url: string }[] }).images[0].url,
        user.id
      );
    } catch (error) {
      console.error("Failed to add user generated image:", error);
    }

    return NextResponse.json({
      url: (result as { images: { url: string }[] }).images[0].url,
    });
  } catch (error) {
    console.error("Failed to generate image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
