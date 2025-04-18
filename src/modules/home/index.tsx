"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { InputArea } from "../chat/input-area";
import { MessageBubble } from "@/shared/components/chat/message-bubble";

type OptimisticMessage = {
  role: "user";
  content: string;
};

export default function HomeModule() {
  const [optimisticMessage, setOptimisticMessage] =
    useState<OptimisticMessage | null>(null);

  const handleOptimisticSubmit = (content: string) => {
    setOptimisticMessage({ role: "user", content });
  };

  return (
    <article
      role="main"
      className="fixed inset-0 top-16 flex flex-col bg-background"
    >
      <div className="absolute inset-0 flex flex-col max-w-5xl mx-auto w-full">
        <div className="flex-1 flex h-full overflow-hidden">
          <div
            className={cn(
              "w-full flex flex-col h-full px-4",
              optimisticMessage
                ? "justify-between"
                : "items-center justify-center"
            )}
          >
            {optimisticMessage && (
              <div className="flex-1 overflow-y-auto pt-4 w-full ml-4">
                <div className="flex justify-end mt-4">
                  <MessageBubble
                    role={optimisticMessage.role}
                    content={optimisticMessage.content}
                  />
                </div>
              </div>
            )}

            <InputArea onOptimisticSubmit={handleOptimisticSubmit} />
          </div>
        </div>
      </div>
    </article>
  );
}
