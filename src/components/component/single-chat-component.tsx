"use client";
import React, { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { renderMessageContent } from "@/libs/utils/markdown-parser";
import { useChatModel } from "@/libs/hooks/useChatModel";
import { useSubModels } from "@/libs/hooks/useSubModels";
import { useRouter } from "next/navigation";
import { IconLayoutNavbarExpand, IconSend } from "@tabler/icons-react";
import { ModeToggle } from "../theme-toggle";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function SingleChatComponent({ model }: { model: string }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamedMessage, setStreamedMessage] = useState("");

  const submodels = useSubModels(model);
  const [selectedModel, setSelectedModel] = useState(submodels[0]);
  const { sendMessage, isLoading, error } = useChatModel(model, selectedModel);

  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const router = useRouter();
  if (error !== null) {
    router.push("/pricing");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStreaming(true);
    setStreamedMessage("");

    let fullStreamedMessage = "";

    if (input.trim() && !isLoading) {
      const userMessage: Message = { role: "user", content: input.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      console.log(messages);

      try {
        await sendMessage(
          userMessage.content,
          (chunk) => {
            fullStreamedMessage += chunk;
            setStreamedMessage(fullStreamedMessage);
            console.log("chunk", chunk);
          },
          messages.slice(-2)
        );
        console.log("fullStreamedMessage", fullStreamedMessage);
        setMessages((prev) => [
          ...prev,
          { content: fullStreamedMessage, role: "assistant" },
        ]);

        //   setStreamedMessage((prev) => [...prev,{role:"assistant",content:fullStreamedMessage}]);
      } catch (error) {
        console.error("Error in chat:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setIsStreaming(false);
      }
    }
  };
 
  return (
    <div className="dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-800 h-[100vh] w-screen p-2 shadow-xl">
      <header className="py-2 px-4 w-full flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
            <span>{selectedModel.toUpperCase().replace(/_/g, " ")}</span>

             <IconLayoutNavbarExpand className="dark:text-white text-gray-800" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            {submodels.map((model) => (
              <DropdownMenuItem
                key={model}
                onSelect={() => setSelectedModel(model as typeof selectedModel)}
                className="px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {model.replace(/_/g, " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle/>
      </header>
      <div className="flex-1 overflow-auto p-4 space-y-4 h-[80vh] bg-gray-100 dark:bg-gray-800 self-stretch">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                message.role === "user"
                  ? "bg-blue-600 text-white max-w-[70%]"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 max-w-[70%]"
              } rounded-lg p-1 px-6 `}
            >
              {renderMessageContent(message.content)}
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-2 max-w-lg">
              {renderMessageContent(streamedMessage)}
            </div>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        <div ref={messagesEndRef} />
      </div>
      <footer className="p-2  flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          className="flex-1  border border-gray-300 dark:border-gray-700 rounded-l-lg dark:bg-gray-800 dark:text-white"
          placeholder="Type your message here..."
          disabled={loading}
        />
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className=" bg-gray-600 dark:bg-gray-700 text-white mx-2"
        >
          <IconSend />
        </Button>
      </footer>
    </div>
  );
}

export default SingleChatComponent;
