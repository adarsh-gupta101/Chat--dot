"use client";

import React, { useEffect, useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUIBuildModel } from "@/libs/hooks/useUIBuildModel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const modelsAvailable = [
  "claude-3-haiku",
  "claude-3-opus",
  "claude-3-sonnet",
  "claude-3-5-sonnet",
  "gpt-3.5-turbo",
  "gpt-4o",
  "gpt-4omini",
  "llama-3.1-70b",
  "llama-3.1-405b",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

function UIComponent() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedMessage, setStreamedMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState("claude");
  const [subModel, setSubModel] = useState("claude-3-haiku");

  const { sendMessage, isLoading } = useUIBuildModel(
    selectedModel,
    subModel,
  );

  useEffect(() => {
    if (subModel.includes("gpt")) {
      setSelectedModel("openai");
    } else if (subModel.includes("llama")) {
      setSelectedModel("google");
    } else if (subModel.includes("gemini")) {
      setSelectedModel("google");
    } else if (subModel.includes("claude")) {
      setSelectedModel("claude");
    }

    console.log({ selectedModel,subModel });
  }, [selectedModel, subModel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStreaming(true);
    setStreamedMessage("");

    let fullStreamedMessage = "";

    if (input.trim() && !isLoading) {
      const userMessage: Message = { role: "user", content: input.trim() };
      // setMessages((prev) => [...prev, userMessage]);
      setInput("");

      console.log(messages);

      try {
        await sendMessage(userMessage.content, (chunk) => {
          fullStreamedMessage += chunk;
          setStreamedMessage(fullStreamedMessage);
          console.log("chunk", chunk);
        },);
        console.log("fullStreamedMessage", fullStreamedMessage);
        setMessages((prev) => [
          { content: fullStreamedMessage, role: "assistant" },
        ]);

        //   setStreamedMessage((prev) => [...prev,{role:"assistant",content:fullStreamedMessage}]);
      } catch (error) {
        console.error("Error in chat:", error);
        setMessages((prev) => [
          // ...prev,
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
    <div className="w-full h-full">
      <header className="text-black py-2 px-4 w-full flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <span>{subModel.toUpperCase().replace(/-/g, " ")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {modelsAvailable.map((model) => (
              <DropdownMenuItem
                key={model}
                onSelect={() => setSubModel(model as typeof selectedModel)}
              >
                {model.replace(/_/g, " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <Sandpack
        template="react"
        options={{
          externalResources: [
            "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
          ],
          showNavigator: true,
          editorHeight: "80vh",
          showTabs: true,
          showLineNumbers: true,
          // showConsole:true
        }}
        customSetup={{
          dependencies: {
            "react-markdown": "latest",
            tailwindcss: "latest",
            "lucide-react": "latest",
            recharts: "2.9.0",
            "react-router-dom": "latest",
            "@radix-ui/react-accordion": "^1.2.0",
            "@radix-ui/react-alert-dialog": "^1.1.1",
            "@radix-ui/react-aspect-ratio": "^1.1.0",
            "@radix-ui/react-avatar": "^1.1.0",
            "@radix-ui/react-checkbox": "^1.1.1",
            "@radix-ui/react-collapsible": "^1.1.0",
            "@radix-ui/react-dialog": "^1.1.1",
            "@radix-ui/react-dropdown-menu": "^2.1.1",
            "@radix-ui/react-hover-card": "^1.1.1",
            "@radix-ui/react-label": "^2.1.0",
            "@radix-ui/react-menubar": "^1.1.1",
            "@radix-ui/react-navigation-menu": "^1.2.0",
            "@radix-ui/react-popover": "^1.1.1",
            "@radix-ui/react-progress": "^1.1.0",
            "@radix-ui/react-radio-group": "^1.2.0",
            "@radix-ui/react-select": "^2.1.1",
            "@radix-ui/react-separator": "^1.1.0",
            "@radix-ui/react-slider": "^1.2.0",
            "@radix-ui/react-slot": "^1.1.0",
            "@radix-ui/react-switch": "^1.1.0",
            "@radix-ui/react-tabs": "^1.1.0",
            "@radix-ui/react-toast": "^1.2.1",
            "@radix-ui/react-toggle": "^1.1.0",
            "@radix-ui/react-toggle-group": "^1.1.0",
            "@radix-ui/react-tooltip": "^1.1.2",
            "class-variance-authority": "^0.7.0",
            clsx: "^2.1.1",
            "date-fns": "^3.6.0",
            "embla-carousel-react": "^8.1.8",
            "react-day-picker": "^8.10.1",
            "tailwind-merge": "^2.4.0",
            "tailwindcss-animate": "^1.0.7",
            vaul: "^0.9.1",
          },
        }}
        files={{
          "/App.js": `${
            streamedMessage.length > 0
              ? ` ${streamedMessage ? streamedMessage : messages}`
              : `
import React from "react";

export default function App() {

return(<div>Hi Amigo</div>)
}
          
        
          
          `
          }`,
        }}
      />

      <footer className="p-2  flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          className="flex-1  border border-gray-300 rounded-l-lg"
          placeholder="Type your message here..."
          disabled={loading}
        />
        <Button onClick={handleSubmit} disabled={loading} className="ml-2">
          Send
        </Button>
      </footer>
    </div>
  );
}

export default UIComponent;
