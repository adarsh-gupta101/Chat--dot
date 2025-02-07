import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { renderMessageContent } from "@/libs/utils/markdown-parser";
  
  type ChatHistoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    conversation: {
      id: string;
      messages: {
        role: string;
        content: string;
        timestamp: string;
      }[];
    } | null;
  };
  
  export function ChatHistoryModal({ isOpen, onClose, conversation }: ChatHistoryModalProps) {
    if (!conversation) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Chat History</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {conversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      message.role === "user"
                        ? "bg-blue-400 dark:bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                    } rounded-lg p-3 max-w-[80%]`}
                  >
                    {renderMessageContent(message.content)}
                    <div className="text-xs opacity-70 mt-2">
                      {new Date(message.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }