import { useState } from "react";

export const useImageGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        if (response.status === 402) {
          window.location.href = "/pricing";
        }
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error generating image:", error);
      return { error: "Failed to generate image" };
    } finally {
      setIsLoading(false);
    }
  };

  return { generateImage, isLoading };
};