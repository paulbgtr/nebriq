"use client";

import { useChatHistoryElement } from "@/shared/hooks/use-chat-history";
import { MessageBubble } from "@/shared/components/chat/message-bubble";
type Props = {
  chatId: string;
};

export const ChatContent = ({ chatId }: Props) => {
  const { data: chatHistoryElement } = useChatHistoryElement(chatId);

  if (!chatHistoryElement) {
    return <div>Loading chat history...</div>;
  }

  const messages = chatHistoryElement.messages || [];

  return (
    <div className="flex flex-col max-w-3xl mx-auto space-y-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          role={msg.message.type === "human" ? "user" : "assistant"}
          content={msg.message.content}
        />
      ))}
    </div>
  );
};
