"use client";

import { useCallback, useState } from "react";

const VALID_MODELS = ["openai", "claude", "google"];
type Message = {
  role: "user" | "assistant";
  content: string;
};

export const useChatModel = (model: string, submodel: string) => {
  console.log({ model, submodel})
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (
      message: string,
      onUpdate: (chunk: string) => void,
      history: Message[]
    ) => {
      if (!VALID_MODELS.includes(model)) {
        return "Error: Invalid model";
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/ai/chat/${model}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, submodel, history }),
        });
        // console.log(response.json())
        if (!response.ok) {
          let res = response.json();
          // setError(response.body.error)
          res.then((data) => {
            console.log(data);
            setError(data.error);
          });
          throw new Error("API response was not ok");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";

        while (true) {
          const { done, value } = await reader!.read();
          console.log({ done, value });
          if (done) break;
          const chunk = decoder.decode(value);
          console.log({ chunk: chunk });
          accumulatedResponse += chunk;
          onUpdate(chunk); // Call the callback with each chunk
        }

        return accumulatedResponse;
      } catch (error) {
        console.error("Error sending message:", error);
        return "Error: Unable to get response";
      } finally {
        setIsLoading(false);
      }
    },
    [model]
  );

  return { sendMessage, isLoading ,error};
};
