import React, { useState, useCallback } from "react";
import { ChatComponent } from "./chat-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "../ui/input";
import { IconPlus, IconSend, IconTableMinus, IconTablePlus } from "@tabler/icons-react";
import { WobbleCard } from "../ui/wobble-card";

function DashboardScreen() {
  const [chatCount, setChatCount] = useState(1);
  const [isSyncChat, setIsSyncChat] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [sendMessagetoAll, setSendMessagetoAll] = useState(false);
  const { toast } = useToast();

  const handleSyncChatToggle = useCallback(() => {
    setIsSyncChat((prev) => !prev);
  }, []);

  const addChatComponent = () => {
    if (chatCount < 6) {
      setChatCount((prev) => prev + 1);
    } else {
      toast({
        title: "Uh oh!",
        description: "You can only have 6 chat components",
        variant: "destructive",
      });
    }
  };

  const removeChatComponent = () => {
    if (chatCount > 1) {
      setChatCount((prev) => prev - 1);
    } else {
      toast({
        title: "Uh oh!",
        description: "You need atleast 1 chat component",
        variant: "destructive",
      });
    }
  };
  const handleSyncMessageChange = (event) => {
    console.log("event.target.value", event.target.value);
    setSyncMessage(event.target.value);
  };
  console.log("syncMessage", syncMessage);

  const handleSendButtonClick = () => {
    console.log("00000000000000000000", syncMessage, isSyncChat);
    if (isSyncChat && syncMessage.trim()) {
      console.log("000000000000000000");
      setSendMessagetoAll(true);
      // Set timeout to simulate async sending process
      setTimeout(() => {
        setSendMessagetoAll(false); // Reset sending state
        setSyncMessage(""); // Clear input after sending
      }, 500); // Adjust time as needed
    }
  };

  const getGridClasses = (count: number) => {
    const baseClasses = "grid gap-4 ";
    switch (count) {
      case 1:
        return `${baseClasses} grid-cols-1 sm:grid-cols-1`;
      case 2:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`;
      case 3:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
      case 4:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`;
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`;
    }
  };

  const CustomSwitch = () => {
    const handleToggle = () => {
      setIsSyncChat(!isSyncChat);
    };

    return (
      <label className="relative  w-12 h-6 hidden md:block">
        <input
          type="checkbox"
          checked={isSyncChat}
          onChange={handleToggle}
          className="opacity-0 w-0 h-0"
        />
        <div
          className={`absolute  top-0 left-0 right-0 bottom-0 flex items-center transition rounded-full ${
            isSyncChat ? "bg-yellow-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute h-5 w-5 bg-white rounded-full transition-transform transform ${
              isSyncChat ? "translate-x-6" : "translate-x-1"
            }`}
          >
            <div className="flex justify-center items-center w-full h-full">
              {isSyncChat ? (
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                >
                  <path
                    fill="currentColor"
                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                  />
                </svg>
              ) : (
                <svg
                  className="cross"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 365.696 365.696"
                  width="6"
                  height="6"
                >
                  <path
                    fill="currentColor"
                    d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </label>
    );
  };

  return (
    <div className="bg-gray-200 w-full h-screen  p-2 pb-6">
      <Toaster />
      <div className="flex items-center m-2 justify-end">
        <div className="flex items-center">
          <Button
            onClick={addChatComponent}
            className="hover:bg-gray-300 bg-transparent text-gray-800  hidden md:block"
          >
            <IconTablePlus />{" "}
          </Button>
          <Button
            onClick={removeChatComponent}
            className="bg-transparent hover:bg-gray-300  text-gray-800  hidden md:block"
          >
            <IconTableMinus />{" "}
          </Button>
          <p className="mx-2 hidden md:block">Sync Chat</p>
          <CustomSwitch />
        </div>
      </div>
      <div className=" w-full">
        <div
          className={`grid gap-x-4 justify-start items-start w-full p-4 h-[80vh]  overflow-y-scroll   bg-gray-200 ${getGridClasses(
            chatCount
          )}`}
        >
          {[...Array(chatCount)].map((_, index) => (
            <ChatComponent
              key={index}
              isSyncChat={isSyncChat}
              syncMessage={syncMessage}
              sendMessagetoAll={sendMessagetoAll}
              index={index}
            />
          ))}
        </div>
        {isSyncChat && (
          <div className="mt-4  justify-center items-center mx-8 hidden md:flex ">
            <Input
              type="text"
              value={syncMessage}
              onChange={handleSyncMessageChange}
              className="border border-gray-300 rounded-md p-2 "
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendButtonClick();
                }
              }}
              placeholder="Type a message for all chats..."
            />
            <Button
              onClick={handleSendButtonClick}
              className=" bg-gray-600 text-white mx-2"
            >
              <IconSend />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardScreen;


