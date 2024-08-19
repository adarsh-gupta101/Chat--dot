"use server";
import Anthropic from "@anthropic-ai/sdk";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Make sure this is set in your .env.local file
});

export async function sendMessageToAnthropic(
  messages: Message[],
  inputMessage: string
) {

    console.log(">> sendMessageToAnthropic");

try{
    const data= anthropic.messages.stream({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 500,
    temperature: 0,
    system: "Respond with clear crisp answers",
    messages: [
      ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: "user", content: inputMessage },
    ],
  });

  console.log(data);

    return data;
}
catch(err){
  console.log(err);
}

}