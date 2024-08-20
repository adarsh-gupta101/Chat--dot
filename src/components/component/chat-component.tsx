"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { renderMessageContent } from "@/libs/utils/markdown-parser";
import { useChatModel } from "@/libs/hooks/useChatModel";
import { useRouter } from "next/navigation";
import { IconSend } from "@tabler/icons-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const MODEL_OPTIONS = [
  "claude-3-5-sonnet",
  "claude-3-opus",
  "claude-3-sonnet",
  "claude-3-haiku",
  "gpt-3.5-turbo",
  "gpt-4omini",
  "gpt-4o",
  "llama-3.1-70b",
  "llama-3.1-405b",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
] as const;

interface ChatComponentProps {
  isSyncChat: boolean;
  syncMessage: string;
  sendMessagetoAll: boolean;
  index: number;
}

export function ChatComponent({
  isSyncChat,
  syncMessage,
  sendMessagetoAll,
  index,
}: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<typeof MODEL_OPTIONS[number]>("claude-3-haiku");
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedMessage, setStreamedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [provider, setProvider] = useState("claude");

  const { sendMessage, isLoading, error } = useChatModel(provider, selectedModel);
  const router = useRouter();

  // Redirect to pricing if an error occurs
  useEffect(() => {
    if (error) {
      router.push("/pricing");
    }
  }, [error, router]);

  // Handle syncing messages across all chat components
  useEffect(() => {
    if (isSyncChat && syncMessage && sendMessagetoAll) {
      handleSubmit(syncMessage);
    }
  }, [isSyncChat, syncMessage, sendMessagetoAll]);

  // Update provider based on selected model
  useEffect(() => {
    if (selectedModel.includes("gpt")) {
      setProvider("openai");
    } else if (selectedModel.includes("llama") || selectedModel.includes("gemini")) {
      setProvider("google");
    } else if (selectedModel.includes("claude")) {
      setProvider("claude");
    }
  }, [selectedModel]);

  // Handle message submission
  const handleSubmit = useCallback(
    async (content: string = inputMessage) => {
      if (content.trim() && !isLoading) {
        setIsStreaming(true);
        setStreamedMessage("");

        const userMessage: Message = { role: "user", content: content.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");

        try {
          let fullStreamedMessage = "";
          await sendMessage(
            userMessage.content,
            (chunk) => {
              fullStreamedMessage += chunk;
              setStreamedMessage(fullStreamedMessage);
            },
            messages.slice(-2)
          );
          setMessages((prev) => [
            ...prev,
            { content: fullStreamedMessage, role: "assistant" },
          ]);
        } catch (error) {
          console.error("Error in chat:", error);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
          ]);
        } finally {
          setIsStreaming(false);
          setStreamedMessage("");
        }
      }
    },
    [inputMessage, isLoading, sendMessage, messages]
  );

  return (
    <div className="flex flex-col justify-between w-full h-full max-h-[70vh] border-2 border-gray-200 shadow rounded-lg bg-gray-100">
      {/* Header with Model Selection */}
      <header className="text-black py-2 px-4 w-full flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <span>{selectedModel.toUpperCase().replace(/-/g, " ")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {MODEL_OPTIONS.map((model) => (
              <DropdownMenuItem key={model} onSelect={() => setSelectedModel(model)}>
                {model.replace(/-/g, " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Scrollable Messages Area */}
      <div className="overflow-y-scroll p-4 h-[80%]">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`${
                message.role === "user" ? "bg-blue-400 text-white" : "bg-gray-200 text-black"
              } rounded-lg p-1 px-6 max-w-lg`}
            >
              {renderMessageContent(message.content)}
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-black rounded-lg p-2 md:max-w-xl">
              {renderMessageContent(streamedMessage)}
            </div>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <footer className="p-2 flex">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="flex-1 border border-gray-300 rounded-l-lg"
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <Button onClick={() => handleSubmit()} disabled={isLoading} className="bg-gray-600 text-white mx-2">
          <IconSend />
        </Button>
      </footer>
    </div>
  );
}



