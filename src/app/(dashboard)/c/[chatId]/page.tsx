"use client";

import { use, useState } from "react";
import { ChatContent } from "@/modules/chat/chat-content";
import { InputArea } from "@/modules/chat/input-area";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);
  const [isModelThinking, setIsModelThinking] = useState(false);

  return (
    <div>
      <ChatContent chatId={chatId} isModelThinking={isModelThinking} />
      <InputArea chatId={chatId} setIsModelThinking={setIsModelThinking} />
    </div>
  );
}
