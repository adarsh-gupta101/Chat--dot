import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { ChatHistoryModal } from "@/components/component/chat-history-model";


type Conversation = {
  id: string;
  messages: {
    role: string;
    content: string;
    timestamp: string;
  }[];
  created_at: string;
};

export function ChatHistory() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchChatHistory() {
      try {
        const response = await fetch("/api/ai/chat/history");
        if (response.ok) {
          const data = await response.json();
          setConversations(data.chat_history);
        //   console.log({ data });
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    }

    if (user) {
      fetchChatHistory();
    }
  }, [user]);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Chat History</h2>
      {conversations?.length === 0 ? (
        <p className="text-muted-foreground">No chat history yet</p>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="border rounded-lg p-4 hover:bg-accent transition-colors"
            onClick={() => handleConversationClick(conversation)}

          >
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <h3 className="font-medium">
                  {conversation.messages[0]?.content.slice(0, 50)}...
                </h3>
                <p className="text-sm text-muted-foreground">
                  {conversation.messages.length} messages
                </p>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(conversation.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="space-y-2">
              {conversation.messages.slice(0, 2).map((message, idx) => (
                <div
                  key={idx}
                  className={`text-sm ${
                    message.role === "assistant"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <span className="font-medium">{message.role}: </span>
                  {message.content.slice(0, 100)}...
                </div>
              ))}
            </div>
          </div>
        ))
      )}

<ChatHistoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedConversation(null);
        }}
        conversation={selectedConversation}
      />
    </div>
  );
}
