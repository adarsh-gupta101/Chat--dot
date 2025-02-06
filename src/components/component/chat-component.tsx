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
import { useAuth,useUser } from "@clerk/nextjs";
import { renderMessageContent } from "@/libs/utils/markdown-parser";
import { useChatModel } from "@/libs/hooks/useChatModel";
import { useRouter } from "next/navigation";
import { IconSend } from "@tabler/icons-react";
import { MODEL_OPTIONS } from "@/constants/model-options";
// import { storeChatMessage, type ChatMessage } from "@/libs/user";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ChatComponentProps {
  isSyncChat: boolean;
  syncMessage: string;
  sendMessagetoAll: string;
  resetSendMessagetoAll: () => void;
  index: number;
}

async function storeChatMessage(message: string, role: 'user' | 'assistant', conversationId?: string) {
  const response = await fetch(`/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      role,
      conversationId
    })
  });

  if (!response.ok) {
    throw new Error('Failed to store chat message');
  }
}

export function ChatComponent({
  isSyncChat,
  syncMessage,
  sendMessagetoAll,
  resetSendMessagetoAll,
  index,
}: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<typeof MODEL_OPTIONS[number]>("claude-3-haiku");
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedMessage, setStreamedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [provider, setProvider] = useState("claude");
  const [conversationId] = useState(() => crypto.randomUUID());


  const { sendMessage, isLoading, error } = useChatModel(provider, selectedModel);
  const router = useRouter();

  const { user } = useUser();

  console.log(user)

  // Handle syncing messages across all chat components
  useEffect(() => {
    if (isSyncChat && sendMessagetoAll) {
      handleSubmit(sendMessagetoAll);
      resetSendMessagetoAll();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isSyncChat, resetSendMessagetoAll, sendMessagetoAll]);

  //  // Load chat history on mount
  useEffect(() => {
    async function loadChatHistory() {
      const response = await fetch(`/api/chat?conversationId=${conversationId}`);
      if (response.ok) {
        const history = await response.json();
        setMessages(history.map((msg: any) => ({
          role: msg.role,
          content: msg.message
        })));
      }
    }
    loadChatHistory();
  }, [conversationId]);

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

          await storeChatMessage(
           userMessage.content,
            'user',
            conversationId
          );
          let fullStreamedMessage = "";
          await sendMessage(
            userMessage.content,
            (chunk) => {
              fullStreamedMessage += chunk;
              setStreamedMessage(fullStreamedMessage);
            },
            messages.slice(-2)
          );

          await storeChatMessage(
            fullStreamedMessage,
            'assistant',
            conversationId
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

  // Update the MessageBubble component to use a more semantic HTML tag
  function MessageBubble({ message }: { message: Message }) {
    return (
      <div
        className={`${
          message.role === "user"
            ? "bg-blue-400 dark:bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
        } rounded-lg p-1 px-6 max-w-lg my-2`}
      >
        <div className="">
          {renderMessageContent(message.content)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full h-full max-h-[70vh] border-2 border-gray-200 dark:border-gray-700 shadow rounded-lg bg-gray-100 dark:bg-gray-800">
      {/* Header with Model Selection */}
      <header className="text-black dark:text-white py-2 px-4 w-full flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <span>{selectedModel.toUpperCase().replace(/-/g, " ")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark:bg-gray-700">
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
            <MessageBubble message={message} />
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg p-2 md:max-w-xl">
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
          className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-lg"
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <Button onClick={() => handleSubmit()} disabled={isLoading} className="bg-gray-600 dark:bg-gray-500 text-white mx-2">
          <IconSend />
        </Button>
      </footer>
    </div>
  );
}



