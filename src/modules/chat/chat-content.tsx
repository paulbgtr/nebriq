"use client";

import { useChatHistoryElement } from "@/shared/hooks/use-chat-history";

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
        <div
          key={msg.id}
          className={`p-3 rounded-lg max-w-xl ${
            msg.message.type === "human"
              ? "bg-blue-100 self-end text-blue-900"
              : "bg-gray-100 self-start text-gray-900"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">
            {/* Removed Strong tag for simplicity, using background color instead */}
            {msg.message.content}
          </p>
        </div>
      ))}
    </div>
  );
};
