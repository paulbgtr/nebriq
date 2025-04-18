"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { InputArea } from "../chat/input-area";

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
              <div className="flex-1 overflow-y-auto pt-4 w-full">
                <div className="flex justify-end mb-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] break-words">
                    {optimisticMessage.content}
                  </div>
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
