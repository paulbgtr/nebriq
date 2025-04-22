"use client";

import { useState } from "react";
import { ChatContent } from "@/modules/chat/features/chat-content";
import { InputArea } from "@/shared/components/chat/input-area";

export default function ChatModule({ chatId }: { chatId: string }) {
  const [isModelThinking, setIsModelThinking] = useState(false);

  return (
    <>
      <ChatContent chatId={chatId} isModelThinking={isModelThinking} />
      <InputArea chatId={chatId} setIsModelThinking={setIsModelThinking} />
    </>
  );
}
