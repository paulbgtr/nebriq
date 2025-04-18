"use client";

import { useChatHistoryElement } from "@/shared/hooks/use-chat-history";
import { MessageBubble } from "@/shared/components/chat/message-bubble";

type Props = {
  chatId: string;
};

export const ChatContent = ({ chatId }: Props) => {
  const { data: chatHistoryElement, isLoading: isHistoryLoading } =
    useChatHistoryElement(chatId);

  if (isHistoryLoading || !chatHistoryElement) {
    return <div>Loading chat history...</div>;
  }

  const messages = chatHistoryElement.messages || [];

  return (
    <div className="flex flex-col max-w-3xl mx-auto space-y-4 pb-24">
      {" "}
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id.toString()}
          role={msg.message.type === "human" ? "user" : "assistant"}
          content={msg.message.content}
        />
      ))}
    </div>
  );
};
