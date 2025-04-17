"use client";

import { use } from "react";
import { ChatContent } from "@/modules/chat/chat-content";
import { InputArea } from "@/modules/chat/input-area";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);

  return (
    <div>
      <ChatContent chatId={chatId} />
      <InputArea chatId={chatId} />
    </div>
  );
}
