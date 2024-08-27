import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { currentUser } from "@clerk/nextjs/server";
import { deductCredit, getUserCredits } from "@/libs/user";

const VALID_MODELS = ["openai", "claude", "google"] as const;
type ValidModel = (typeof VALID_MODELS)[number];

const submodelMapper: Record<string, string> = {
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
  { params }: { params: { model: ValidModel } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const { credits, success } = await getUserCredits(user.id);
    if (!success || credits < 100) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    if (!VALID_MODELS.includes(params.model)) {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    const { message, submodel, history } = await request.json();

    const result = await handleModelRequest(
      params.model,
      submodel,
      message,
      history,
      user.id
    );
    return result.toTextStreamResponse();
  } catch (error) {
    console.error(`Failed to process request:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleModelRequest(
  model: ValidModel,
  submodel: string,
  message: string,
  history: Message[],
  userId: string
) {
  if (!submodelMapper[submodel]) {
    throw new Error(`Invalid submodel: ${submodel}`);
  }

  const apiKey = getApiKeyForModel(model);
  const modelInstance = getModelInstance(model, apiKey);

  return streamText({
    model: modelInstance(submodelMapper[submodel]),
    messages: [...history, { role: "user", content: message }],
    async onFinish({ usage, finishReason }) {
      console.log({ 
        usage, 
        finishReason, 
        model 
      });
      if (usage.totalTokens > 0) {
        await deductCredit(userId, usage.totalTokens);
      }
    },
  });
}

function getApiKeyForModel(model: ValidModel): string {
   switch (model) {
    case "openai":
      if(!process.env.OPENAI_API_KEY){
        throw new Error("OPENAI_API_KEY is not set");
      }
      return process.env.OPENAI_API_KEY;
    case "claude":
      if(!process.env.ANTHROPIC_API_KEY){
        throw new Error("ANTHROPIC_API_KEY is not set");
      }
      return process.env.ANTHROPIC_API_KEY;
    case "google":
      if(!process.env.GOOGLE_API_KEY){
        throw new Error("GOOGLE_API_KEY is not set");
      }
      return process.env.GOOGLE_API_KEY;
   }
}

function getModelInstance(model: ValidModel, apiKey: string) {
  switch (model) {
    case "openai":
      return createOpenAI({ apiKey, compatibility: "strict" });
    case "claude":
      return createAnthropic({ apiKey });
    case "google":
      return createGoogleGenerativeAI({ apiKey });
  }
}
