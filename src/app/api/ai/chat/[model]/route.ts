import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { currentUser } from "@clerk/nextjs/server";
import { deductCredit, getUserCredits } from "@/libs/user";

const VALID_MODELS = ["openai", "claude", "google"];
const submodelMapper = {
  "claude-3-haiku": "claude-3-haiku-20240307",
  "claude-3-opus": "claude-3-opus-20240229",
  "claude-3-sonnet": "claude-3-sonnet-20240229",
  "claude-3-5-sonnet": "claude-3-5-sonnet-20240620",
  "gpt-3.5-turbo": "gpt-3.5-turbo",
  "gpt-4o": "gpt-4o",
  "gpt-4omini": "gpt-4o-mini",
  "llama-3.1-70b": "llama-3.1-70b-versatile",
  "llama-3.1-405b": "llama-3.1-405b-versatile",
  "gemini-1.5-flash": "models/gemini-1.5-flash-latest",
  "gemini-1.5-pro": "models/gemini-1.5-pro-latest",
};
type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { model: string } }
) {
  let user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  let creditsRemainig = await getUserCredits(user.id);
  console.log({ creditsRemainig });
  if (creditsRemainig.credits < 100 || creditsRemainig.success === false) {
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 400 }
    );
  }
  if (!VALID_MODELS.includes(params.model as (typeof VALID_MODELS)[number])) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  console.log({ params });

  const { message, submodel, history } = await request.json();

  console.log({ message, submodel, history });

  let response;
  switch (params.model) {
    case "openai":
      try {
        const openai = createOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const result = await streamText({
          model: openai(submodelMapper[submodel]),
          messages: [...history, { role: "user", content: message }],
          async onFinish({
            text,
            toolCalls,
            toolResults,
            usage,
            finishReason,
          }) {
            // implement your own storage logic:
            console.log({ text, toolCalls, toolResults, usage, finishReason });
            deductCredit(user.id, usage.totalTokens);
          },
        });
        return result.toTextStreamResponse();
      } catch (error) {
        console.error(`Failed to send message: ${error}`);
        return NextResponse.json(
          { error: "Failed to send message" },
          { status: 500 }
        );
      }
      break;
    case "claude":
      // Implement Claude API call
      try {
        const anthropic = createAnthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const result = await streamText({
          model: anthropic(submodelMapper[submodel]),
          messages: [...history, { role: "user", content: message }],
          async onFinish({
            text,
            toolCalls,
            toolResults,
            usage,
            finishReason,
          }) {
            // implement your own storage logic:
            deductCredit(user.id, usage.totalTokens);

            console.log({
              text,
              toolCalls,
              toolResults,
              usage,
              finishReason,
              "used claude": "true",
            });
          },
        });

        return result.toTextStreamResponse();
      } catch (err) {
        console.error(`Failed to send message: ${err}`);
        return NextResponse.json(
          { error: "Failed to send message" },
          { status: 500 }
        );
      }
      response = `Claude response to:n ${message}`;
      break;
    case "google":
      // Implement Google API call
      try {
        const google = createGoogleGenerativeAI({
          apiKey: process.env.GOOGLE_API_KEY,
        });

        const result = await streamText({
          model: google(submodelMapper[submodel]),
          messages: [...history, { role: "user", content: message }],
          async onFinish({
            text,
            toolCalls,
            toolResults,
            usage,
            finishReason,
          }) {
            // implement your own storage logic:
            console.log({ text, toolCalls, toolResults, usage, finishReason });
            deductCredit(user.id, usage.totalTokens);
          },
        });

        return result.toTextStreamResponse();
      } catch (err) {
        console.error(`Failed to send message: ${err}`);
        return NextResponse.json(
          { error: "Failed to send message" },
          { status: 500 }
        );
      }

      response = `Google response to: ${message}`;
      break;
    // no case

    case "default":
      response = `No model found for: ${params.model}`;
      break;
  }

  return NextResponse.json({ message: response });
}
