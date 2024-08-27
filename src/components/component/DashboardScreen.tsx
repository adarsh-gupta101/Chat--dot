import React, { useState, useCallback, ChangeEvent } from "react";
import { ChatComponent } from "./chat-component";
import { Button } from "../ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "../ui/input";
import {
  IconPlus,
  IconSend,
  IconTableMinus,
  IconTablePlus,
} from "@tabler/icons-react";
import { ModeToggle } from "../theme-toggle";

function DashboardScreen() {
  const [chatCount, setChatCount] = useState(1);
  const [isSyncChat, setIsSyncChat] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [sendMessagetoAll, setSendMessagetoAll] = useState("");
  const { toast } = useToast();

  const handleSyncChatToggle = useCallback(() => {
    setIsSyncChat((prev) => !prev);
  }, []);

  const addChatComponent = () => {
    setChatCount((prev) => {
      if (prev < 6) return prev + 1;
      toast({
        title: "Uh oh!",
        description: "You can only have 6 chat components",
        variant: "destructive",
      });
      return prev;
    });
  };

  const removeChatComponent = () => {
    setChatCount((prev) => {
      if (prev > 1) return prev - 1;
      toast({
        title: "Uh oh!",
        description: "You need at least 1 chat component",
        variant: "destructive",
      });
      return prev;
    });
  };

  const handleSyncMessageChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSyncMessage(event.target.value);

  const handleSendButtonClick = () => {
    if (isSyncChat && syncMessage.trim()) {
      setSendMessagetoAll(syncMessage.trim());
    }
  };

  const resetSendMessagetoAll = () => {
    setSendMessagetoAll("");
  };

  const getGridClasses = (count: number) => {
    const baseClasses = "grid gap-4 ";
    return `${baseClasses} ${
      count === 1
        ? "grid-cols-1 sm:grid-cols-1"
        : count === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : count === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2"
    }`;
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 w-full h-screen p-2 pb-6 border-l-2 border-gray-300 dark:border-gray-700">
      <Toaster />
      <div className="flex items-center m-2 justify-end">
        <div className="flex items-center">
        <ModeToggle/>

          <Button
            onClick={addChatComponent}
            className="hover:bg-gray-300 bg-transparent text-gray-800 dark:text-gray-200 hidden md:block"
          >
            <IconTablePlus />
          </Button>
          <Button
            onClick={removeChatComponent}
            className="bg-transparent hover:bg-gray-300 text-gray-800 dark:text-gray-200 hidden md:block"
          >
            <IconTableMinus />
          </Button>
          <p className="mx-2 hidden md:block text-gray-400 dark:text-gray-300">
            Sync Chat
          </p>
          <CustomSwitch
            isSyncChat={isSyncChat}
            onToggle={handleSyncChatToggle}
          />

        </div>
      </div>
      <div className="w-full">
        <div
          className={`grid gap-x-4 justify-start items-start w-full p-4 h-[80vh] overflow-y-scroll bg-gray-200 dark:bg-gray-800 ${getGridClasses(
            chatCount
          )}`}
        >
          {[...Array(chatCount)].map((_, index) => (
            <ChatComponent
              key={index}
              isSyncChat={isSyncChat}
              syncMessage={syncMessage}
              sendMessagetoAll={sendMessagetoAll}
              resetSendMessagetoAll={resetSendMessagetoAll}
              index={index}
            />
          ))}
        </div>
        {isSyncChat && (
          <div className="mt-4 justify-center items-center mx-8 hidden md:flex">
            <Input
              type="text"
              value={syncMessage}
              onChange={handleSyncMessageChange}
              className="border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-800 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendButtonClick();
                }
              }}
              placeholder="Type a message for all chats..."
            />
            <Button
              onClick={handleSendButtonClick}
              className="bg-gray-600 dark:bg-gray-500 text-white mx-2"
            >
              <IconSend />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

const CustomSwitch = ({
  isSyncChat,
  onToggle,
}: {
  isSyncChat: boolean;
  onToggle: () => void;
}) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={isSyncChat}
      onChange={onToggle}
      className="sr-only"
    />
    <div
      className={`w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-200 ease-in-out ${

        isSyncChat ? "bg-blue-600" : ""
      }`}
    >
      <span
        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${
          isSyncChat ? "translate-x-5" : ""
        }`}
      >
        {isSyncChat ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-4 text-blue-600 mx-auto "
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-4 text-gray-400 mx-auto"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </span>
    </div>
  </label>
);

export default DashboardScreen;
