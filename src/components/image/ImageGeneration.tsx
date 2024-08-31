"use client"
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useImageGeneration } from "@/libs/hooks/useImageGeneration";
import { Loader2, Send } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "../theme-toggle";

export function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { generateImage, isLoading } = useImageGeneration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const result = await generateImage(prompt);
    if (result.url) {
      setImageUrl(result.url);
    }
  };

  return (
    <div className="dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-800 h-[80vh]  p-2 shadow-xl flex flex-col">
      
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-800 self-stretch">
        {imageUrl && (
          <div className="flex justify-center">
            <Image src={imageUrl} alt="Generated image" className="rounded-lg shadow-lg" width={512} height={512} />
          </div>
        )}
      </div>
      <footer className="p-2 flex">
        <Input
          type="text"
          placeholder="Enter your image prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded-l-lg dark:bg-gray-800 dark:text-white"
          disabled={isLoading}
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-gray-600 dark:bg-gray-700 text-white mx-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
        </Button>
      </footer>
    </div>
  );
}