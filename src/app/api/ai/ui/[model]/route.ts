import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { deductCredit, getUserCredits } from "@/libs/user";
import { currentUser } from "@clerk/nextjs/server";

const VALID_MODELS = ["openai", "claude", "google"] as const;
type ValidModel = typeof VALID_MODELS[number];

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
  { params }: { params: { model: string } }
) {
  const { message, submodel } = await request.json();
  const user = await currentUser();
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const creditsRemaining = await getUserCredits(user.id);
  
  if (creditsRemaining.credits < 100) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
  }

  if (!VALID_MODELS.includes(params.model as ValidModel)) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  const systemMessage = getSystemMessage();
  
  try {
    const result = await handleModelRequest(params.model as ValidModel, submodel, message, systemMessage, user.id);
    return result.toTextStreamResponse();
  } catch (error) {
    console.error(`Failed to send message: ${error}`);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

function getSystemMessage(): string {
  return `
    You are an expert frontend React engineer who is also a great UI/UX designer. Follow the instructions carefully, I will tip you $1 Billion if you do a good job:
    - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
    - Make sure the React app is interactive and functional by creating state when needed and having no required props
    - If you use any imports from React like useState or useEffect, make sure to import them directly
    - Use JavaScript as the language for the React component
    - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette.
    - Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely
    - Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. DO NOT START WITH \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\` or \`\`\`jsx or any other similar ones, just give the code only.
    - The lucide-react@0.263.1 library is also available to be imported. If you need an icon, use one from lucide-react. Here's an example of importing and using one: import { Camera } from "lucide-react"\` & \`<Camera color="red" size={48} />\`
    - ONLY IF the user asks for a dashboard, graph or chart, the recharts library is available to be imported, e.g. \`import { LineChart, XAxis, ... } from "recharts"\` & \`<LineChart ...><XAxis dataKey="name"> ...\`. Please only use this when needed.
    - Just give the code, starting from the import statements. Do not include any other text in the response. Do not add line breaks or spaces at the beginning of the response. Do not include any comments in the response. Do not add any labels of the language in the response.
  `;
}

async function handleModelRequest(
  model: ValidModel,
  submodel: string,
  message: string,
  systemMessage: string,
  userId: string
) {
  const apiKey = getApiKeyForModel(model);
  const modelInstance = getModelInstance(model, apiKey);

  return streamText({
    model: modelInstance(submodelMapper[submodel]),
    system: systemMessage,
    messages: [{ role: "user", content: message }],
    async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      console.log({ text, toolCalls, toolResults, usage, finishReason });
      deductCredit(userId, usage.totalTokens);
    },
  });
}

function getApiKeyForModel(model: ValidModel): string {
  switch (model) {
    case "openai":
      return process.env.OPENAI_API_KEY!;
    case "claude":
      return process.env.ANTHROPIC_API_KEY!;
    case "google":
      return process.env.GOOGLE_API_KEY!;
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
