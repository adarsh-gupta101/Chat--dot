import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";


let models: { [key: string]: string } = {
  gpt: "gpt-3.5-turbo",
  claude_sonnet_3_5: "claude-3-5-sonnet-20240620",
  claude_sonnet_3: "claude-3-sonnet-20240229",
  davinci: "davinci-3-5-turbo",
  claude_opus: "claude-3-opus-20240229",
  claude_haiku: "claude-3-haiku-20240307",
};

export async function POST(request: Request) {
  // return NextResponse.json({ message: "Hello World" });
  const { messages, inputMessage, model } = await request.json();

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const stream = anthropic.messages.stream({
        model: models[model as string],
        max_tokens: 2000,
        temperature: 0,
        system: "You are an AI assistant with huge knowledge, you need to answer the user's questions correctly and informatively. if you dont know the answer, you can ask the user for more information. You can also ask the user to rephrase the question if you dont understand it. But if the user is intentionally giving bad information, you can ask the user to respectfully talk. Don't be rude to the user and don't use bad language. Also, don't share any personal information with the user. ",
        messages: [...messages, { role: "user", content: inputMessage }],
    });

    let streamedResponse = "";
    // for await (const chunk of stream) {
    //   if (chunk.type === 'content_block_delta') {
    //     streamedResponse += chunk.delta.text;
    //   }
    // }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta") {
              if ("text" in chunk.delta) {
                controller.enqueue(encoder.encode(chunk.delta.text));
              }
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error(
      // `Failed to send message1111111111111111111111111111111111111 ${error.error as string}`
    );
    // return NextResponse.json({ error: `Failed to send message ${error.error.error}`}, { status: 500 });
  }
}
